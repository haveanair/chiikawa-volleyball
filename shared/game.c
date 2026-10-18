#include "game.h"

#define EXPECTED_LANDING_LOOP_LIMIT 1000
#define SUPER_FREEZE 1
#define SUPER_CUTIN 2
#define SUPER_LAUNCH 3
#define SUPER_FIRE 4
#define SUPER_COUNTER 5
#define SUPER_EXPLOSION 6
#define SUPER_BOUNCE 7
#define SUPER_GROGGY 8
#define SUPER_FREEZE_TICKS 10
#define SUPER_CUTIN_TICKS 28
#define SUPER_LAUNCH_TICKS 12
#define SUPER_EXPLOSION_TICKS 34
#define SUPER_BOUNCE_TICKS 66
#define SUPER_GROGGY_TICKS 30
static void cue(Game* game, int side, int kind) {
    ++game->voice_serial[side]; game->voice_cue[side] = (uint8_t)kind;
}
static void award_point(Game* game);
static int calculate_expected_landing_x(const Ball* ball);


typedef struct CpuProfile {
    uint8_t reaction_delay;
    uint8_t landing_error;
    uint8_t move_deadzone;
    uint8_t jump_range;
    uint8_t jump_ceiling;
    uint8_t dive_reach;
    uint8_t attack_chance;
    uint8_t move_speed;
    uint8_t mistake_percent;
} CpuProfile;

/* Gentle story curve: every opponent has reaction delay, imperfect reads and
 * deliberate openings. No stage uses exact prediction or player-speed movement. */
static const CpuProfile CPU_PROFILES[CPU_STAGE_COUNT] = {
    /* reaction, error, deadzone, jump, ceiling, dive, attack, speed, mistake */
    {16,100, 12, 22, 104,  50, 14, 3, 56},
    {14, 88, 30, 26, 116,  65, 20, 3, 50},
    {12, 76, 27, 30, 132,  78, 28, 4, 38},
    {10, 60, 23, 35, 140,  92, 36, 4, 30},
    { 8, 48, 20, 40, 150, 104, 44, 5, 24}
};

static int iabs(int value)
{
    return value < 0 ? -value : value;
}

static int clamp_int(int value, int minimum, int maximum)
{
    if(value < minimum) return minimum;
    if(value > maximum) return maximum;
    return value;
}

static uint8_t clamp_level(uint8_t level)
{
    if(level < 1u) return 1u;
    if(level > CPU_STAGE_COUNT) return CPU_STAGE_COUNT;
    return level;
}

/* Avoid pulling the ARM EABI quotient+remainder helper into the freestanding
 * ROM. All game random divisors are small, but this fixed 16-step routine is
 * fast and deterministic on both host and GBA builds. */
static uint16_t remainder_u16(uint16_t numerator, uint16_t denominator)
{
    uint32_t remainder = 0;
    int bit;
    if(denominator == 0u) return 0u;
    for(bit = 15; bit >= 0; --bit) {
        remainder = (remainder << 1) | ((numerator >> bit) & 1u);
        if(remainder >= denominator) remainder -= denominator;
    }
    return (uint16_t)remainder;
}

/* Same family as the Microsoft C runtime rand() used by many Windows games. */
static uint16_t game_rand(Game* game)
{
    game->rng_state = game->rng_state * 214013u + 2531011u;
    return (uint16_t)((game->rng_state >> 16) & 0x7FFFu);
}

static const CpuProfile* cpu_profile(const Game* game)
{
    return &CPU_PROFILES[clamp_level(game->cpu_level) - 1u];
}

static void reset_player(Game* game, Player* player, uint8_t is_right, uint8_t computer)
{
    const CpuProfile* profile = cpu_profile(game);
    int signed_error = 0;

    player->is_right = is_right;
    player->computer = computer;
    player->x = is_right ? WORLD_WIDTH - 36 : 36;
    player->y = PLAYER_GROUND_Y;
    player->y_velocity = 0;
    player->x_velocity = 0;
    player->diving_direction = 0;
    player->lying_ticks = 0;
    player->state = PLAYER_NORMAL;
    player->collision_latched = 0;
    player->standby_near_net = (uint8_t)(game_rand(game) & 1u);
    player->power_ticks = 0;
    player->ai_reaction_ticks = 0;
    player->ai_cached_x = 0;
    player->ai_dive_cooldown = 0;
    player->ai_target_x = is_right ? 324 : 108;
    player->ai_mistake = 0;

    if(computer) {
        if(profile->landing_error > 0u) {
            int span = (int)profile->landing_error * 2 + 1;
            signed_error = (int)(remainder_u16(game_rand(game), (uint16_t)span)) -
                           (int)profile->landing_error;
        }
        player->ai_target_error = (int8_t)signed_error;
        player->ai_mistake = (uint8_t)((remainder_u16(game_rand(game), 100u)) < profile->mistake_percent);
    } else {
        player->ai_target_error = 0;
    }
}

static void prepare_round(Game* game)
{
    for(int s=0;s<2;s++){game->rescue_used[s]=0;game->rescue_warning[s]=0;game->rescue_effect[s]=0;}
    uint8_t p1_computer = game->players[0].computer;
    game->super_phase = 0;
    game->phase_ticks = 0;
    game->counter_window[0] = game->counter_window[1] = 0;
    game->groggy_ticks[0] = game->groggy_ticks[1] = 0;
    uint8_t p2_computer = game->players[1].computer;

    reset_player(game, &game->players[0], 0, p1_computer);
    reset_player(game, &game->players[1], 1, p2_computer);

    game->ball.x = game->server ? WORLD_WIDTH - 56 : 56;
    game->ball.y = 0;
    game->ball.x_velocity = 0;
    game->ball.y_velocity = 1;
    game->ball.previous_x = game->ball.x;
    game->ball.previous_y = game->ball.y;
    game->ball.previous_previous_x = game->ball.x;
    game->ball.previous_previous_y = game->ball.y;
    game->ball.expected_landing_x = game->ball.x;
    game->ball.power_effect_ticks = 0;
    game->ball.rotation = 0;
    game->ball.fine_rotation = 0;
    game->state_ticks = 0;
}

void game_init(Game* game, GameMode mode, uint8_t cpu_level, uint8_t match_win_score)
{
    for(int s=0;s<2;s++){game->team_kind[s]=game->team_member[s]=0;game->rescue_serial[s]=0;game->rescue_x[s]=0;}
    game->super_phase = game->phase_ticks = 0;
    game->super_owner = 0; game->super_target = 1;
    game->impact_x = game->impact_y = 0;
    game->impact_serial = game->counter_serial = game->impact_beat = 0;
    game->impact_pulse = 0;
    game->voice_serial[0] = game->voice_serial[1] = 0;
    game->voice_cue[0] = game->voice_cue[1] = 0;
    game->contacts[0] = game->contacts[1] = 0;
    game->upper_hits[0] = game->upper_hits[1] = 0;
    game->supers_used[0] = game->supers_used[1] = 0;
    game->charge[0] = game->charge[1] = 0;
    game->super_armed[0] = game->super_armed[1] = 0;
    game->super_ticks = 0;
    game->scores[0] = 0;
    game->scores[1] = 0;
    game->server = 0;
    game->rally_state = RALLY_GAME_START;
    game->point_winner = 0;
    game->mode = (uint8_t)mode;
    game->cpu_level = clamp_level(cpu_level);
    game->match_win_score = match_win_score ? match_win_score : MATCH_WIN_SCORE;
    game->state_ticks = 0;
    game->sound_events = 0;
    game->tick = 0;
    game->rng_state = 0x13579BDFu;

    game->players[0].computer = (uint8_t)(mode == GAME_MODE_CPU_DEMO);
    game->players[1].computer = (uint8_t)(mode != GAME_MODE_LINK);
    prepare_round(game);
}

void game_set_team(Game* game, uint8_t side, uint8_t kind, uint8_t member)
{
    side &= 1; kind = kind > 2 ? 0 : kind;
    game->team_kind[side]=kind;
    game->team_member[side]=member % (kind==1?4:kind==2?2:1);
}

/* A partner has no permanent collision box. One readable save per rally,
 * after six warning ticks; supers bypass this safety net. No charge farming. */
static uint8_t partner_save(Game* game)
{
    int side=game->ball.x>=WORLD_HALF_WIDTH;
    Player* player=&game->players[side];
    for(int s=0;s<2;s++)if(s!=side)game->rescue_warning[s]=0;
    if(game->team_kind[side]!=2||game->rescue_used[side]||game->super_phase||game->ball.y_velocity<=0){game->rescue_warning[side]=0;return 0;}
    int endangered=player->state==PLAYER_LYING||player->state==PLAYER_DIVING||iabs(game->ball.x-player->x)>48;
    if(game->ball.y>=170&&endangered&&!game->rescue_warning[side])game->rescue_warning[side]=7;
    if(game->rescue_warning[side]>1)--game->rescue_warning[side];
    if(!game->rescue_warning[side]||game->ball.y+game->ball.y_velocity<BALL_GROUND_Y)return 0;
    if(game->rescue_warning[side]>1){game->ball.y=BALL_GROUND_Y-1;game->ball.previous_x=game->ball.x;game->ball.previous_y=game->ball.y;return 1;}
    game->rescue_used[side]=1;game->rescue_warning[side]=0;game->rescue_effect[side]=18;
    game->rescue_x[side]=game->ball.x;++game->rescue_serial[side];
    game->ball.y=BALL_GROUND_Y-18;game->ball.y_velocity=-16;game->ball.x_velocity=side?-5:5;
    game->ball.previous_x=game->ball.x;game->ball.previous_y=game->ball.y;
    game->ball.power_effect_ticks=0;game->ball.expected_landing_x=(int16_t)calculate_expected_landing_x(&game->ball);
    game->sound_events|=GAME_SOUND_CHU;
    return 1;
}

static void update_ball_rotation(Ball* ball)
{
    int future = (int)ball->fine_rotation + (ball->x_velocity / 2);
    while(future < 0) future += 50;
    while(future > 50) future -= 50;
    ball->fine_rotation = (uint8_t)future;
    ball->rotation = (uint8_t)(future / 10);
}

/* Returns 1 when the ball reaches the ground. */
static uint8_t move_ball_against_world(Ball* ball)
{
    int future_x;
    int future_y;

    ball->previous_previous_x = ball->previous_x;
    ball->previous_previous_y = ball->previous_y;
    ball->previous_x = ball->x;
    ball->previous_y = ball->y;
    update_ball_rotation(ball);

    future_x = ball->x + ball->x_velocity;
    if(future_x < BALL_RADIUS || future_x > WORLD_WIDTH) {
        ball->x_velocity = (int16_t)-ball->x_velocity;
    }

    future_y = ball->y + ball->y_velocity;
    if(future_y < 0) {
        ball->y_velocity = 1;
    }

    if(iabs(ball->x - WORLD_HALF_WIDTH) < NET_HALF_WIDTH && ball->y > NET_TOP_Y) {
        if(ball->y <= NET_BOTTOM_Y) {
            if(ball->y_velocity > 0) ball->y_velocity = (int16_t)-ball->y_velocity;
        } else if(ball->x < WORLD_HALF_WIDTH) {
            ball->x_velocity = (int16_t)-iabs(ball->x_velocity);
        } else {
            ball->x_velocity = (int16_t)iabs(ball->x_velocity);
        }
    }

    future_y = ball->y + ball->y_velocity;
    if(future_y > BALL_GROUND_Y) {
        ball->y_velocity = (int16_t)-ball->y_velocity;
        ball->y = BALL_GROUND_Y;
        return 1;
    }

    ball->y = (int16_t)future_y;
    ball->x = (int16_t)(ball->x + ball->x_velocity);
    ball->y_velocity = (int16_t)(ball->y_velocity + 1);
    return 0;
}

static int calculate_expected_landing_x(const Ball* ball)
{
    int x = ball->x;
    int y = ball->y;
    int x_velocity = ball->x_velocity;
    int y_velocity = ball->y_velocity;
    int loop_counter;

    for(loop_counter = 0; loop_counter < EXPECTED_LANDING_LOOP_LIMIT; ++loop_counter) {
        int future_x = x + x_velocity;
        if(future_x < BALL_RADIUS || future_x > WORLD_WIDTH) x_velocity = -x_velocity;
        if(y + y_velocity < 0) y_velocity = 1;

        if(iabs(x - WORLD_HALF_WIDTH) < NET_HALF_WIDTH && y > NET_TOP_Y) {
            if(y < NET_BOTTOM_Y) {
                if(y_velocity > 0) y_velocity = -y_velocity;
            } else if(x < WORLD_HALF_WIDTH) {
                x_velocity = -iabs(x_velocity);
            } else {
                x_velocity = iabs(x_velocity);
            }
        }

        y += y_velocity;
        if(y > BALL_GROUND_Y) break;
        x += x_velocity;
        y_velocity += 1;
    }
    return x;
}

static uint8_t x_in_player_half(const Player* player, int x)
{
    if(player->is_right) return (uint8_t)(x > WORLD_HALF_WIDTH && x < WORLD_WIDTH);
    return (uint8_t)(x > 0 && x < WORLD_HALF_WIDTH);
}

static void demo_align_receiver(Game* game)
{
    Player* receiver;
    int x;

    if(game->mode != GAME_MODE_CPU_DEMO) return;
    if(game->rally_state != RALLY_ACTIVE) return;
    if(game->ball.y_velocity <= 0) return;

    receiver = game->ball.x < WORLD_HALF_WIDTH ? &game->players[0] : &game->players[1];
    if(game->ball.y < 160) return;

    x = clamp_int(game->ball.x,
                  receiver->is_right ? WORLD_HALF_WIDTH + PLAYER_HALF_LENGTH : PLAYER_HALF_LENGTH,
                  receiver->is_right ? WORLD_WIDTH - PLAYER_HALF_LENGTH : WORLD_HALF_WIDTH - PLAYER_HALF_LENGTH);
    receiver->x = (int16_t)x;
    receiver->ai_target_x = (int16_t)x;
}

static uint8_t demo_save_before_ground(Game* game)
{
    Player* receiver;
    int x;

    if(game->mode != GAME_MODE_CPU_DEMO) return 0;
    if(game->rally_state != RALLY_ACTIVE) return 0;
    if(game->ball.y_velocity <= 0) return 0;
    if(game->ball.y + game->ball.y_velocity < BALL_GROUND_Y - 2) return 0;

    receiver = game->ball.x < WORLD_HALF_WIDTH ? &game->players[0] : &game->players[1];
    x = clamp_int(game->ball.x,
                  receiver->is_right ? WORLD_HALF_WIDTH + PLAYER_HALF_LENGTH : PLAYER_HALF_LENGTH,
                  receiver->is_right ? WORLD_WIDTH - PLAYER_HALF_LENGTH : WORLD_HALF_WIDTH - PLAYER_HALF_LENGTH);

    receiver->x = (int16_t)x;
    receiver->y = PLAYER_GROUND_Y;
    receiver->y_velocity = 0;
    receiver->state = PLAYER_POWER_HIT;
    receiver->power_ticks = 6;
    receiver->collision_latched = 1;

    game->ball.y = BALL_GROUND_Y - 18;
    game->ball.x = (int16_t)x;
    game->ball.x_velocity = receiver->is_right ? -7 : 7;
    game->ball.y_velocity = -17;
    game->ball.expected_landing_x = (int16_t)calculate_expected_landing_x(&game->ball);
    game->ball.power_effect_ticks = 8;
    game->sound_events |= GAME_SOUND_POWER_HIT;
    return 1;
}

static PlayerInput computer_input(Game* game, Player* player, const Player* other)
{
    const CpuProfile* profile = cpu_profile(game);
    PlayerInput input = {0, 0, 0};
    int left_boundary = player->is_right ? WORLD_HALF_WIDTH : 0;
    int right_boundary = left_boundary + WORLD_HALF_WIDTH;
    int landing = game->ball.expected_landing_x;
    int ball_dx = game->ball.x - player->x;
    int landing_dx = landing - player->x;
    int abs_dx = iabs(ball_dx);
    int abs_landing_dx = iabs(landing_dx);
    uint8_t landing_on_side = x_in_player_half(player, landing);

    if(player->ai_dive_cooldown > 0u) --player->ai_dive_cooldown;

    if(player->ai_reaction_ticks > 0u) {
        --player->ai_reaction_ticks;
    } else {
        int target;
        if(landing_on_side) {
            int center_position = left_boundary + WORLD_HALF_WIDTH / 2;
            target = landing + player->ai_target_error;
            if(player->ai_mistake) {
                /* A wrong read still follows the rally, but falls short toward
                 * the middle. Never park for an entire mistaken rally. */
                target = (target + center_position) / 2;
            }
            if(game->ball.y > 150 && x_in_player_half(player, game->ball.x) &&
               game->cpu_level < 4u && !player->ai_mistake) {
                /* Easier opponents overreact to the current ball position.
                 * Expert and maximum levels keep tracking the true landing. */
                int weight = 4 - (int)game->cpu_level;
                target = (target * (4 - weight) + game->ball.x * weight) / 4;
            }
        } else {
            int net_position = player->is_right ? WORLD_HALF_WIDTH + 54 : WORLD_HALF_WIDTH - 54;
            int center_position = left_boundary + WORLD_HALF_WIDTH / 2;
            target = (game->cpu_level >= 4u || player->standby_near_net) ?
                     net_position : center_position + clamp_int(game->ball.x - (other->is_right ? 324 : 108), -72, 72) / 2;
        }
        target = clamp_int(target, left_boundary + PLAYER_HALF_LENGTH,
                           right_boundary - PLAYER_HALF_LENGTH);
        player->ai_target_x = (int16_t)target;
        if(iabs(target - player->x) > profile->move_deadzone) {
            player->ai_cached_x = (int8_t)(player->x < target ? 1 : -1);
        } else {
            player->ai_cached_x = 0;
        }
        player->ai_reaction_ticks = profile->reaction_delay;
    }

    input.x_direction = player->ai_cached_x;

    if(player->state == PLAYER_NORMAL) {
        int jump_start_y = 125 - (int)game->cpu_level * 7;
        uint8_t can_attempt = (uint8_t)(landing_on_side && game->ball.y_velocity > 0 &&
                                       game->ball.y > jump_start_y &&
                                       game->ball.y < profile->jump_ceiling);
        int dynamic_range = (int)profile->jump_range + iabs(game->ball.x_velocity) * 2;
        int intercept_distance = game->cpu_level >= 4u ? abs_landing_dx :
                                 (abs_landing_dx < abs_dx ? abs_landing_dx : abs_dx);

        if(can_attempt && intercept_distance <= dynamic_range && !player->ai_mistake) {
            input.y_direction = -1;
        }

        if(landing_on_side && game->ball.y > (220 - (int)game->cpu_level * 12) &&
           abs_landing_dx > (int)profile->jump_range &&
           abs_landing_dx < (int)profile->dive_reach &&
           player->ai_dive_cooldown == 0u && game->cpu_level >= 2u && !player->ai_mistake) {
            input.action_pressed = 1;
            input.x_direction = (int8_t)(landing_dx < 0 ? -1 : 1);
            player->ai_dive_cooldown = 12;
        }
    } else if(player->state == PLAYER_JUMPING || player->state == PLAYER_POWER_HIT) {
        int steering_dx = (game->cpu_level >= 4u && landing_on_side) ?
                          landing_dx : ball_dx;
        if(iabs(steering_dx) > profile->move_deadzone / 2) {
            input.x_direction = (int8_t)(steering_dx < 0 ? -1 : 1);
        }

        if(abs_dx < 56 && iabs(game->ball.y - player->y) < 56) {
            uint8_t attack = (uint8_t)(profile->attack_chance >= 100u ||
                                      remainder_u16(game_rand(game), 100u) < profile->attack_chance);
            if(attack) {
                int distance_to_net = player->is_right ?
                                      game->ball.x - WORLD_HALF_WIDTH :
                                      WORLD_HALF_WIDTH - game->ball.x;
                int horizontal_speed;
                int ticks_to_net;
                int projected_y;
                int neutral_ticks;
                int neutral_projected_y;

                input.action_pressed = 1;
                horizontal_speed = (iabs(input.x_direction) + 1) * 10;
                if(distance_to_net < 0) distance_to_net = 0;
                ticks_to_net = (distance_to_net + horizontal_speed - 1) /
                               horizontal_speed;
                projected_y = game->ball.y +
                              (ticks_to_net + 2) * iabs(game->ball.y_velocity) * 2;
                neutral_ticks = ticks_to_net + 2;
                neutral_projected_y = game->ball.y +
                                      neutral_ticks * (neutral_ticks + 1) / 2;

                if(game->cpu_level >= 3u &&
                   projected_y <= NET_TOP_Y - 12 && distance_to_net <= 96) {
                    /* Spike only when the ball will cross above the net. */
                    input.y_direction = 1;
                } else if(game->cpu_level >= 3u &&
                          neutral_projected_y <= NET_TOP_Y - 2) {
                    /* A flat shot clears the net and lands before a fast wall
                     * rebound can catch the CPU while it is still airborne. */
                    input.y_direction = 0;
                } else if(game->cpu_level == 1u &&
                          (game_rand(game) & 3u) == 0u) {
                    input.y_direction = 1;
                } else {
                    /* A lift is safer than drilling the ball into our own
                     * floor from the back court. */
                    input.y_direction = -1;
                }

                if(game->cpu_level >= 4u &&
                   iabs(other->x - WORLD_HALF_WIDTH) < 72) {
                    input.y_direction = -1;
                }
            }
        }
    }

    return input;
}

static void move_player(Game* game, Player* player, PlayerInput input)
{
    int velocity_x = 0;
    int future_x;
    int future_y;
    int move_speed = 6;

    if(player->computer) move_speed = cpu_profile(game)->move_speed;

    if(game->groggy_ticks[player->is_right]) return;
    if(player->state == PLAYER_LYING) {
        if(player->lying_ticks > 0) --player->lying_ticks;
        else player->state = PLAYER_NORMAL;
        return;
    }

    if(player->state < PLAYER_DIVING) velocity_x = input.x_direction * move_speed;
    else if(player->state == PLAYER_DIVING) velocity_x = player->diving_direction * 8;

    int old_x = player->x;
    future_x = player->x + velocity_x;
    if(!player->is_right) {
        player->x = (int16_t)clamp_int(future_x, PLAYER_HALF_LENGTH,
                                      WORLD_HALF_WIDTH - PLAYER_HALF_LENGTH);
    } else {
        player->x = (int16_t)clamp_int(future_x, WORLD_HALF_WIDTH + PLAYER_HALF_LENGTH,
                                      WORLD_WIDTH - PLAYER_HALF_LENGTH);
    }

    player->x_velocity = (int8_t)(player->x - old_x);
    if(player->state < PLAYER_DIVING && input.y_direction == -1 &&
       player->y == PLAYER_GROUND_Y) {
        player->y_velocity = -16;
        player->state = PLAYER_JUMPING;
        game->sound_events |= GAME_SOUND_CHU;
    }

    future_y = player->y + player->y_velocity;
    player->y = (int16_t)future_y;
    if(future_y < PLAYER_GROUND_Y) {
        player->y_velocity = (int16_t)(player->y_velocity + 1);
    } else if(future_y > PLAYER_GROUND_Y) {
        player->y_velocity = 0;
        player->y = PLAYER_GROUND_Y;
        if(player->state == PLAYER_DIVING) {
            player->state = PLAYER_LYING;
            player->lying_ticks = 3;
        } else {
            player->state = PLAYER_NORMAL;
        }
        player->power_ticks = 0;
    }

    if(input.action_pressed) {
        if(player->state == PLAYER_JUMPING) {
            player->state = PLAYER_POWER_HIT;
            player->power_ticks = 10;
            game->sound_events |= GAME_SOUND_PIKA;
            cue(game,player->is_right,2);
        } else if(player->state == PLAYER_NORMAL && input.x_direction != 0) {
            player->state = PLAYER_DIVING;
            player->diving_direction = input.x_direction;
            player->y_velocity = -5;
            game->sound_events |= GAME_SOUND_CHU;
        }
    }

    if(player->state == PLAYER_POWER_HIT) {
        if(player->power_ticks > 0) --player->power_ticks;
        else player->state = PLAYER_JUMPING;
    }
}

static uint8_t player_ball_overlap(const Player* player, const Ball* ball)
{
    return (uint8_t)(iabs(ball->x - player->x) <= PLAYER_HALF_LENGTH &&
                     iabs(ball->y - player->y) <= PLAYER_HALF_LENGTH);
}

static void collide_ball_with_player(Game* game, Player* player, PlayerInput input)
{
    Ball* ball = &game->ball;
    int difference = ball->x - player->x;
    int abs_y_velocity;
    int side = player->is_right ? 1 : 0;
    uint8_t upper_shot = (uint8_t)(player->state == PLAYER_POWER_HIT && input.y_direction == -1);
    uint8_t super_hit = (uint8_t)(upper_shot && game->charge[side] == 10);
    ++game->contacts[side];
    if(upper_shot && !super_hit)
        ++game->upper_hits[side];

    if(difference < 0) ball->x_velocity = (int16_t)-(iabs(difference) / 3);
    else if(difference > 0) ball->x_velocity = (int16_t)(iabs(difference) / 3);

    if(ball->x_velocity == 0) {
        ball->x_velocity = (int16_t)((int)(remainder_u16(game_rand(game), 3u)) - 1);
    }

    abs_y_velocity = iabs(ball->y_velocity);
    ball->y_velocity = (int16_t)-abs_y_velocity;
    if(abs_y_velocity < 15) ball->y_velocity = -15;

    if(player->state == PLAYER_POWER_HIT) {
        if(ball->x < WORLD_HALF_WIDTH) {
            ball->x_velocity = (int16_t)((iabs(input.x_direction) + 1) * 10);
        } else {
            ball->x_velocity = (int16_t)-((iabs(input.x_direction) + 1) * 10);
        }
        ball->y_velocity = (int16_t)(iabs(ball->y_velocity) * input.y_direction * 2);
        ball->power_effect_ticks = 10;
        game->sound_events |= GAME_SOUND_POWER_HIT;
    } else {
        ball->power_effect_ticks = 0;
    }

    if(super_hit) {
        game->charge[side] = 0;
        ++game->supers_used[side];
        game->super_armed[side] = 0;
        game->super_ticks = 24;
        game->super_owner = (uint8_t)side;
        game->super_target = (uint8_t)(side ^ 1);
        game->super_phase = SUPER_FREEZE;
        game->phase_ticks = SUPER_FREEZE_TICKS;
        game->sound_events |= (1u << 5);
        ball->x_velocity = player->is_right ? -26 : 26;
        ball->y_velocity = input.y_direction > 0 ? 12 : -8;
        ball->power_effect_ticks = 24;
        game->sound_events |= GAME_SOUND_POWER_HIT;
    } else {
        if(game->charge[side] < 10) ++game->charge[side];
        cue(game,side,2);
    }
    ball->expected_landing_x = (int16_t)calculate_expected_landing_x(ball);
}

static void award_point(Game* game)
{
    uint8_t loser = game->ball.x < WORLD_HALF_WIDTH ? 0u : 1u;
    uint8_t winner = (uint8_t)(1u - loser);

    ++game->scores[winner];
    game->super_phase = 0;
    game->groggy_ticks[0] = game->groggy_ticks[1] = 0;
    game->server = winner;
    game->point_winner = winner;
    game->state_ticks = 0;

    if(game->scores[winner] >= game->match_win_score) {
        game->rally_state = RALLY_MATCH_OVER;
        game->players[winner].state = PLAYER_WINNER;
        game->players[loser].state = PLAYER_LOSER;
        cue(game,winner,5); cue(game,loser,6);
        game->sound_events |= GAME_SOUND_PIPIKACHU;
    } else {
        for(int s=0;s<2;s++)if(game->team_kind[s])game->team_member[s]=(game->team_member[s]+1)%(game->team_kind[s]==1?4:2);
        game->rally_state = RALLY_POINT;
    }
}

/* Original Hamo asset scaffold: 10 freeze / 28 cutin / 12 launch,
 * 34 explosion. v46 collision beats: 0,16,24,36,50,66.
 * The trajectory below adapts that documented sequence to this web/GBA core;
 * the v47 release supplies ELF/ROM, not the original current C source. */
static int interpolate(int a, int b, int elapsed, int duration) {
    return a + (b-a)*elapsed/duration;
}
static void bounce_position(Game* g, int elapsed) {
    static const int times[6] = {0,16,24,36,50,66};
    int side=g->super_target, k;
    int xs[6], ys[6];
    xs[0]=g->impact_x; ys[0]=g->impact_y;
    xs[1]=side?350:82; ys[1]=244;
    xs[2]=side?400:32; ys[2]=135;
    xs[3]=side?305:127; ys[3]=32;
    xs[4]=side?248:184; ys[4]=150;
    xs[5]=side?324:108; ys[5]=244;
    for(k=0;k<5;k++) if(elapsed<=times[k+1]) {
        int n=elapsed-times[k], d=times[k+1]-times[k];
        g->players[side].x=(int16_t)interpolate(xs[k],xs[k+1],n,d);
        g->players[side].y=(int16_t)interpolate(ys[k],ys[k+1],n,d);
        break;
    }
}
/* After cut-in and shot motion, airborne players descend and land normally. */
static void settle_airborne_player(Player* player) {
    if(player->y>=PLAYER_GROUND_Y){
        player->y=PLAYER_GROUND_Y;player->y_velocity=0;
        if(player->state==PLAYER_JUMPING||player->state==PLAYER_POWER_HIT){player->state=PLAYER_NORMAL;player->power_ticks=0;}
        return;
    }
    player->y=(int16_t)(player->y+player->y_velocity);
    ++player->y_velocity;
    if(player->y>=PLAYER_GROUND_Y){
        player->y=PLAYER_GROUND_Y;player->y_velocity=0;player->power_ticks=0;
        player->state=player->state==PLAYER_DIVING?PLAYER_LYING:PLAYER_NORMAL;
        if(player->state==PLAYER_LYING)player->lying_ticks=3;
    }
}

static uint8_t advance_super(Game* g) {
    int phase=g->super_phase, elapsed;
    if(!phase || phase==SUPER_FIRE)return 0;
    for(int side=0;phase!=SUPER_FREEZE&&phase!=SUPER_CUTIN&&phase!=SUPER_LAUNCH&&side<2;side++){
        if(side==g->super_target&&(phase==SUPER_EXPLOSION||phase==SUPER_BOUNCE||phase==SUPER_GROGGY))continue;
        settle_airborne_player(&g->players[side]);
    }
    if(g->phase_ticks) --g->phase_ticks;
    if(phase==SUPER_LAUNCH&&g->team_kind[g->super_owner]==2){
        int owner=g->super_owner,e=SUPER_LAUNCH_TICKS-g->phase_ticks;
        int direction=owner?-1:1;
        int start=g->players[owner].x,end=clamp_int(start+direction*38,owner?248:32,owner?400:184);
        g->ball.previous_x=g->ball.x;g->ball.previous_y=g->ball.y;
        g->ball.x=(int16_t)interpolate(start,end,e,SUPER_LAUNCH_TICKS);
        g->ball.y=(int16_t)(g->players[owner].y-30-(e<=6?e:12-e)*6);
    }
    if(phase==SUPER_BOUNCE) {
        elapsed=SUPER_BOUNCE_TICKS-g->phase_ticks;
        bounce_position(g,elapsed);
        if(elapsed==16||elapsed==24||elapsed==36||elapsed==50||elapsed==66) {
            ++g->impact_beat; g->impact_pulse=6; g->sound_events|=(1u<<7);
            g->sound_events|=elapsed==24?GAME_SOUND_SUPER_WALL:elapsed==36?GAME_SOUND_SUPER_CEILING:elapsed==50?GAME_SOUND_SUPER_NET:GAME_SOUND_SUPER_GROUND;
        }
    }
    if(phase==SUPER_GROGGY) g->groggy_ticks[g->super_target]=g->phase_ticks;
    if(g->phase_ticks)return 1;
    switch(phase) {
    case SUPER_FREEZE:
        g->super_phase=SUPER_CUTIN;g->phase_ticks=SUPER_CUTIN_TICKS;
        cue(g,g->super_owner,3); break;
    case SUPER_CUTIN:
        for(int side=0;side<2;side++)if(g->players[side].y<PLAYER_GROUND_Y&&g->players[side].y_velocity<0)g->players[side].y_velocity=0;
        g->players[g->super_owner].state=PLAYER_POWER_HIT;g->players[g->super_owner].power_ticks=12;
        g->super_phase=SUPER_LAUNCH;g->phase_ticks=SUPER_LAUNCH_TICKS;
        g->sound_events|=(1u<<6); break;
    case SUPER_LAUNCH: case SUPER_COUNTER:
        if(phase==SUPER_LAUNCH&&g->team_kind[g->super_owner]==2)g->sound_events|=GAME_SOUND_POWER_HIT;
        g->super_phase=SUPER_FIRE;g->phase_ticks=0;g->sound_events|=GAME_SOUND_SUPER_FIRE;break;
    case SUPER_EXPLOSION:
        g->super_phase=SUPER_BOUNCE;g->phase_ticks=SUPER_BOUNCE_TICKS;break;
    case SUPER_BOUNCE:
        g->super_phase=SUPER_GROGGY;g->phase_ticks=SUPER_GROGGY_TICKS;
        g->groggy_ticks[g->super_target]=SUPER_GROGGY_TICKS;break;
    case SUPER_GROGGY:
        g->ball.x=g->super_target?324:108;g->ball.y=BALL_GROUND_Y;
        award_point(g);break;
    }
    return 1;
}
static void super_fire_contact(Game* g, PlayerInput input) {
    int target=g->super_target;
    Player* p=&g->players[target];
    if(p->state==PLAYER_POWER_HIT && g->counter_window[target]) {
        g->super_owner=(uint8_t)target;g->super_target=(uint8_t)(target^1);
        g->super_phase=SUPER_COUNTER;g->phase_ticks=8;
        g->counter_window[target]=0;g->ball.x_velocity=target?-26:26;
        ++g->counter_serial;cue(g,target,7);g->sound_events|=(1u<<8);
    } else {
        g->super_phase=SUPER_EXPLOSION;g->phase_ticks=SUPER_EXPLOSION_TICKS;
        g->impact_x=p->x;g->impact_y=p->y;
        ++g->impact_serial;++g->impact_beat;g->impact_pulse=6;
        p->state=PLAYER_GROGGY;p->y_velocity=0;p->power_ticks=0;
        g->groggy_ticks[target]=255;g->super_armed[target]=0;
        cue(g,target,4);g->sound_events|=(1u<<7)|GAME_SOUND_SUPER_IMPACT;
    }
    (void)input;
}

void game_tick(Game* game, PlayerInput player_one_input, PlayerInput player_two_input)
{
    PlayerInput inputs[2];
    int index;

    ++game->tick;
    for(int s=0;s<2;s++)if(game->rescue_effect[s])--game->rescue_effect[s];
    game->players[0].x_velocity = game->players[1].x_velocity = 0;
    if(game->impact_pulse) --game->impact_pulse;
    if(game->super_ticks) --game->super_ticks;

    if(game->rally_state == RALLY_GAME_START) {
        if(++game->state_ticks >= GAME_START_TICKS) {
            game->state_ticks = 0;
            game->rally_state = RALLY_ACTIVE;
        }
        return;
    }

    if(game->rally_state == RALLY_POINT) {
        if(++game->state_ticks >= POINT_PAUSE_TICKS) {
            prepare_round(game);
            game->rally_state = RALLY_READY;
            game->state_ticks = 0;
        }
        return;
    }

    if(game->rally_state == RALLY_READY) {
        if(++game->state_ticks >= READY_TICKS) {
            game->state_ticks = 0;
            game->rally_state = RALLY_ACTIVE;
        }
        return;
    }

    if(game->rally_state == RALLY_MATCH_OVER) {
        if(game->state_ticks < 0xFFFFu) ++game->state_ticks;
        return;
    }

    if(advance_super(game)) return;
    inputs[0] = player_one_input;
    inputs[1] = player_two_input;

    if(game->super_phase == SUPER_FIRE) {
        Player* target=&game->players[game->super_target];
        int dx=target->x-game->ball.x;
        game->ball.previous_x=game->ball.x;game->ball.previous_y=game->ball.y;
        game->ball.x=(int16_t)(game->ball.x+clamp_int(dx,-26,26));
        game->ball.y=(int16_t)(game->ball.y+clamp_int(target->y-game->ball.y,-18,18));
        game->ball.power_effect_ticks=24;
    } else {
    demo_align_receiver(game);
    if(partner_save(game)||demo_save_before_ground(game)) {
        ++game->ball.rotation;
    } else if(move_ball_against_world(&game->ball)) {
        game->sound_events |= GAME_SOUND_BALL_GROUND;
        award_point(game);
        return;
    }

    }
    game->ball.expected_landing_x = (int16_t)calculate_expected_landing_x(&game->ball);

    if(game->players[0].computer) {
        inputs[0] = computer_input(game, &game->players[0], &game->players[1]);
    }
    if(game->players[1].computer) {
        inputs[1] = computer_input(game, &game->players[1], &game->players[0]);
    }

    for(index=0;index<2;index++) {
        if(game->counter_window[index]) --game->counter_window[index];
        if(inputs[index].action_pressed) game->counter_window[index]=4;
    }
    move_player(game, &game->players[0], inputs[0]);
    move_player(game, &game->players[1], inputs[1]);

    if(game->super_phase==SUPER_FIRE) {
        int target=game->super_target;
        if(player_ball_overlap(&game->players[target],&game->ball))
            super_fire_contact(game,inputs[target]);
        return;
    }
    for(index = 0; index < 2; ++index) {
        Player* player = &game->players[index];
        if(player_ball_overlap(player, &game->ball)) {
            if(!player->collision_latched) {
                collide_ball_with_player(game, player, inputs[index]);
                player->collision_latched = 1;
            }
        } else {
            player->collision_latched = 0;
        }
    }

    if(game->ball.power_effect_ticks > 0) --game->ball.power_effect_ticks;
}

uint16_t game_take_sound_events(Game* game)
{
    uint16_t events = game->sound_events;
    game->sound_events = 0;
    return events;
}

uint8_t game_match_winner(const Game* game)
{
    if(game->rally_state != RALLY_MATCH_OVER) return 0xFFu;
    return game->point_winner;
}

uint8_t game_state_checksum(const Game* game)
{
    uint32_t hash = 0x9E3779B9u;
    int i;
#define MIX(value) do { hash ^= (uint32_t)(uint16_t)(value) + 0x7F4A7C15u + (hash << 6) + (hash >> 2); } while(0)
    MIX(game->ball.x); MIX(game->ball.y);
    MIX(game->ball.x_velocity); MIX(game->ball.y_velocity);
    MIX(game->scores[0]); MIX(game->scores[1]);
    MIX(game->server); MIX(game->rally_state); MIX(game->state_ticks);
    MIX(game->tick); MIX(game->rng_state); MIX(game->cpu_level);
    MIX(game->super_ticks); MIX(game->super_phase); MIX(game->phase_ticks);
    MIX(game->super_owner); MIX(game->super_target);
    MIX(game->impact_x); MIX(game->impact_y); MIX(game->impact_serial);
    MIX(game->counter_serial); MIX(game->impact_beat);
    MIX(game->impact_pulse);
    for(i = 0; i < 2; ++i) {
        MIX(game->team_kind[i]);MIX(game->team_member[i]);MIX(game->rescue_used[i]);
        MIX(game->rescue_warning[i]);MIX(game->rescue_effect[i]);MIX(game->rescue_x[i]);MIX(game->rescue_serial[i]);
        MIX(game->counter_window[i]); MIX(game->groggy_ticks[i]);
        MIX(game->voice_serial[i]); MIX(game->voice_cue[i]);
        MIX(game->charge[i]); MIX(game->super_armed[i]);
        MIX(game->players[i].x); MIX(game->players[i].y);
        MIX(game->players[i].y_velocity); MIX(game->players[i].state);
        MIX(game->players[i].power_ticks); MIX(game->players[i].collision_latched);
    }
#undef MIX
    hash ^= hash >> 16;
    hash ^= hash >> 8;
    return (uint8_t)(hash & 0x0Fu);
}

