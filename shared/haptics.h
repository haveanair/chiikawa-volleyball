#ifndef CHIIVOLLEY_HAPTICS_H
#define CHIIVOLLEY_HAPTICS_H
#include <stdint.h>
/* Millisecond on/off/on patterns. Feed game_take_sound_events() once per tick.
   GBA frontend converts milliseconds to VBlank ticks and drives its rumble
   hardware adapter. Never write cartridge registers from the shared core. */
typedef struct VolleyHapticPattern { uint16_t ms[3]; uint8_t count; } VolleyHapticPattern;
static inline VolleyHapticPattern volley_haptic_pattern(uint32_t events) {
 VolleyHapticPattern p={{0,0,0},0};
 if(events&1024u){p.ms[0]=85;p.ms[1]=45;p.ms[2]=110;p.count=3;}
 else if(events&256u){p.ms[0]=35;p.ms[1]=30;p.ms[2]=75;p.count=3;}
 else if(events&512u){p.ms[0]=45;p.ms[1]=25;p.ms[2]=90;p.count=3;}
 else if(events&(2048u|4096u|8192u|16384u)){p.ms[0]=65;p.count=1;}
 else if(events&(32u|64u)){p.ms[0]=25;p.ms[1]=35;p.ms[2]=25;p.count=3;}
 else if(events&8u){p.ms[0]=22;p.count=1;}
 else if(events&16u){p.ms[0]=12;p.count=1;}
 return p;
}
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
