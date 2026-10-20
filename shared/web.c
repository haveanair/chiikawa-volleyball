#include "game.h"
static Game g;
void init(int mode, int level, int score) { game_init(&g, (GameMode)mode, level, score); }
void team(int side,int kind,int member){game_set_team(&g,side,kind,member);}
static PlayerInput input(int b) {
    PlayerInput p = {0,0,0};
    p.x_direction = ((b & 2) != 0) - ((b & 1) != 0);
    p.y_direction = (b & 4) ? -1 : ((b & 8) ? 1 : 0);
    p.action_pressed = (b & 16) != 0;
    return p;
}
void step(int a, int b) {
    game_tick(&g,input(a),input(b));
}
int get(int f, int s) {
    s &= 1;
    switch(f) {
    case 0:return g.players[s].x; case 1:return g.players[s].y;
    case 2:return g.players[s].state; case 3:return g.ball.x;
    case 4:return g.ball.y; case 5:return g.scores[s];
    case 6:return g.rally_state; case 7:return g.charge[s];
    case 8:return g.super_armed[s]; case 9:return g.super_ticks;
    case 10:return game_match_winner(&g); case 11:return g.state_ticks;
    case 12:return g.ball.power_effect_ticks; case 13:return game_state_checksum(&g);
    case 14:return g.contacts[s]; case 15:return g.upper_hits[s];
    case 16:return g.supers_used[s];
    case 17:return g.super_phase; case 18:return g.phase_ticks;
    case 19:return g.super_owner; case 20:return g.super_target;
    case 21:return g.impact_serial; case 22:return g.counter_serial;
    case 23:return g.groggy_ticks[s]; case 24:return g.voice_serial[s];
    case 25:return g.voice_cue[s]; case 26:return g.impact_x;
    case 27:return g.impact_beat; case 28:return g.impact_y;
    case 29:return g.impact_pulse;
    case 30:return g.players[s].x_velocity;
    case 31:return g.players[s].y_velocity;
    case 32:return g.tick;
    case 33:return g.ball.previous_x; case 34:return g.ball.previous_y;
    case 35:return g.team_kind[s]; case 36:return g.team_member[s];
    case 37:return g.rescue_used[s]; case 38:return g.rescue_warning[s];
    case 39:return g.rescue_effect[s]; case 40:return g.rescue_x[s];
    case 41:return g.rescue_serial[s];
    case 42:return g.server;
    default:return 0;
    }
}
int sounds(void) { return game_take_sound_events(&g); }
