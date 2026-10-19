#ifndef CHIIVOLLEY_HAPTICS_H
#define CHIIVOLLEY_HAPTICS_H
#include <stdint.h>
/* Millisecond on/off/on patterns. Feed game_take_sound_events() once per tick.
   GBA frontend converts milliseconds to VBlank ticks and drives its rumble
   hardware adapter. Never write cartridge registers from the shared core. */
typedef struct VolleyHapticPattern { uint16_t ms[3]; uint8_t count; } VolleyHapticPattern;
static inline VolleyHapticPattern volley_haptic_pattern(uint32_t events) {
 VolleyHapticPattern p={{0,0,0},0};
 if(events&(512u|32u)){p.ms[0]=1000;p.count=1;}
 else if(events&(1024u|256u|2048u|4096u|8192u|16384u|8u)){p.ms[0]=133;p.count=1;}
 else if(events&(64u|(1u<<21)|(1u<<22))){p.ms[0]=267;p.count=1;}
 else if(events&(1u<<20)){p.ms[0]=67;p.count=1;}
 return p;
}
/* Use this variant for the final ground collision (impact_beat >= 6). */
static inline VolleyHapticPattern volley_haptic_pattern_context(uint32_t events,unsigned impact_beat) {
 VolleyHapticPattern p=volley_haptic_pattern(events);
 if((events&4096u)&&impact_beat>=6){p.ms[0]=267;p.count=1;}
 return p;
}
/* UI events: cursor 1<<20, confirm 1<<21, full gauge 1<<22. */
/* Adapter callback: on=1 starts motor, on=0 stops it. Call tick with ~17ms
   each GBA VBlank. Bind set_motor to the existing Hamo Ayo rumble driver. */
typedef struct VolleyHapticDriver {
 VolleyHapticPattern pattern;
 uint16_t remaining_ms;
 uint8_t index;
 void (*set_motor)(int on);
} VolleyHapticDriver;
static inline void volley_haptic_stop(VolleyHapticDriver *d) {
 d->pattern.count=0;d->remaining_ms=0;d->index=0;
 if(d->set_motor)d->set_motor(0);
}
static inline void volley_haptic_event(VolleyHapticDriver *d,uint32_t events) {
 VolleyHapticPattern p=volley_haptic_pattern(events);
 if(!p.count)return;
 d->pattern=p;d->index=0;d->remaining_ms=p.ms[0];
 if(d->set_motor)d->set_motor(1);
}
static inline void volley_haptic_event_context(VolleyHapticDriver *d,uint32_t events,unsigned impact_beat) {
 VolleyHapticPattern p=volley_haptic_pattern_context(events,impact_beat);
 if(!p.count)return;
 d->pattern=p;d->index=0;d->remaining_ms=p.ms[0];
 if(d->set_motor)d->set_motor(1);
}
static inline void volley_haptic_tick(VolleyHapticDriver *d,uint16_t elapsed_ms) {
 while(d->pattern.count && elapsed_ms>=d->remaining_ms){
  elapsed_ms-=d->remaining_ms;
  if(++d->index>=d->pattern.count){volley_haptic_stop(d);return;}
  d->remaining_ms=d->pattern.ms[d->index];
  if(d->set_motor)d->set_motor((d->index&1)==0);
 }
 if(d->pattern.count)d->remaining_ms-=elapsed_ms;
}
#endif
