#ifndef POCKET_VOLLEY_GAME_H
#define POCKET_VOLLEY_GAME_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

enum {
    WORLD_WIDTH = 432,
    WORLD_HEIGHT = 304,
    WORLD_HALF_WIDTH = 216,
    PLAYER_HALF_LENGTH = 32,
    PLAYER_GROUND_Y = 244,
    BALL_RADIUS = 20,
    BALL_GROUND_Y = 252,
    NET_HALF_WIDTH = 25,
    NET_TOP_Y = 176,
    NET_BOTTOM_Y = 192,
    MATCH_WIN_SCORE = 15,
    CPU_STAGE_COUNT = 5,
    GAME_START_TICKS = 71,
    POINT_PAUSE_TICKS = 10,
    READY_TICKS = 30,
    MATCH_END_TICKS = 211,
    MATCH_END_SKIP_TICKS = 70
};

typedef enum GameMode {
    GAME_MODE_STAGE = 0,
    GAME_MODE_LINK = 1,
    GAME_MODE_CPU_DEMO = 2
} GameMode;

typedef enum PlayerState {
    PLAYER_NORMAL = 0,
    PLAYER_JUMPING = 1,
    PLAYER_POWER_HIT = 2,
    PLAYER_DIVING = 3,
    PLAYER_LYING = 4,
    PLAYER_WINNER = 5,
    PLAYER_LOSER = 6,
    PLAYER_GROGGY = 7
} PlayerState;

typedef enum RallyState {
    RALLY_ACTIVE = 0,
    RALLY_POINT = 1,
    RALLY_READY = 2,
    RALLY_MATCH_OVER = 3,
    RALLY_GAME_START = 4
} RallyState;

typedef enum GameSoundEvent {
    GAME_SOUND_CHU = 1u << 0,
    GAME_SOUND_PIKA = 1u << 1,
    GAME_SOUND_PIPIKACHU = 1u << 2,
    GAME_SOUND_POWER_HIT = 1u << 3,
    GAME_SOUND_BALL_GROUND = 1u << 4,
    GAME_SOUND_SUPER_FIRE = 1u << 9,
    GAME_SOUND_SUPER_IMPACT = 1u << 10,
    GAME_SOUND_SUPER_WALL = 1u << 11,
    GAME_SOUND_SUPER_GROUND = 1u << 12,
    GAME_SOUND_SUPER_CEILING = 1u << 13,
    GAME_SOUND_SUPER_NET = 1u << 14
} GameSoundEvent;

typedef struct PlayerInput {
    int8_t x_direction; /* -1, 0, 1 */
    int8_t y_direction; /* -1 up, 0, 1 down */
    uint8_t action_pressed;
} PlayerInput;

typedef struct Player {
    int8_t x_velocity; /* Render movement, never used to drive physics. */
    int16_t x;
    int16_t y;
    int16_t y_velocity;
    int16_t ai_target_x;
    int8_t diving_direction;
    int8_t ai_target_error;
    int8_t ai_cached_x;
    int8_t lying_ticks;
    uint8_t state;
    uint8_t collision_latched;
    uint8_t computer;
    uint8_t is_right;
    uint8_t standby_near_net;
    uint8_t power_ticks;
    uint8_t ai_reaction_ticks;
    uint8_t ai_mistake;
    uint8_t ai_dive_cooldown;
} Player;

typedef struct Ball {
    int16_t x;
    int16_t y;
    int16_t x_velocity;
    int16_t y_velocity;
    int16_t previous_x;
    int16_t previous_y;
    int16_t previous_previous_x;
    int16_t previous_previous_y;
    int16_t expected_landing_x;
    uint8_t power_effect_ticks;
    uint8_t rotation;
    uint8_t fine_rotation;
} Ball;

typedef struct Game {
    uint8_t team_kind[2]; /* 0 solo, 1 rotating Pajama Parties, 2 leaf partners */
    uint8_t team_member[2];
    uint8_t rescue_used[2];
    uint8_t rescue_warning[2];
    uint8_t rescue_effect[2];
    int16_t rescue_x[2];
    uint32_t rescue_serial[2];
    /* Hamo super sequence, renderer-independent and synchronized by the host. */
    uint8_t super_phase; /* 0 none,1 freeze,2 cutin,3 launch,4 fire,5 counter,6 explosion,7 bounce,8 groggy */
    uint8_t phase_ticks;
    uint8_t super_owner;
    uint8_t super_target;
    uint8_t counter_window[2];
    uint8_t groggy_ticks[2];
    int16_t impact_x;
    int16_t impact_y;
    uint32_t impact_serial;
    uint32_t counter_serial;
    uint32_t impact_beat;
    uint8_t impact_pulse;
    uint32_t voice_serial[2];
    uint8_t voice_cue[2];
    uint32_t contacts[2];
    uint32_t upper_hits[2];
    uint32_t supers_used[2];
    uint8_t charge[2];
    uint8_t super_armed[2];
    uint8_t super_ticks;
    Player players[2];
    Ball ball;
    uint8_t scores[2];
    uint8_t server;
    uint8_t rally_state;
    uint8_t point_winner;
    uint8_t mode;
    uint8_t cpu_level;
    uint8_t match_win_score;
    uint16_t state_ticks;
    uint16_t sound_events;
    uint32_t tick;
    uint32_t rng_state;
} Game;

void game_init(Game* game, GameMode mode, uint8_t cpu_level, uint8_t match_win_score);
void game_set_team(Game* game, uint8_t side, uint8_t kind, uint8_t member);
void game_tick(Game* game, PlayerInput player_one_input, PlayerInput player_two_input);
uint16_t game_take_sound_events(Game* game);
uint8_t game_match_winner(const Game* game);
uint8_t game_state_checksum(const Game* game);

#ifdef __cplusplus
}
#endif

#endif
