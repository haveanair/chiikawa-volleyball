// Uses the same event bits as shared/haptics.h (milliseconds).
export const HAPTIC_CURSOR=1<<20,HAPTIC_CONFIRM=1<<21,HAPTIC_MAX=1<<22;
// Gameplay follows Hamo Ayo v46; menus use brief, gentle taps.
export function vibrationPattern(events,{impactBeat=0}={}){
 if(events&(512|32))return [1000];
 if((events&4096)&&impactBeat>=6)return [267];
 if(events&(1024|256|2048|4096|8192|16384|8))return [133];
 if(events&(64|HAPTIC_MAX))return [267];
 if(events&HAPTIC_CONFIRM)return [20];
 if(events&HAPTIC_CURSOR)return [8];
 return [];
}
export function createHaptics(nav=globalThis.navigator,storage=globalThis.localStorage){
 let enabled=true;try{enabled=storage.getItem('chiivolley.vibration')!=='off'}catch{}
 const supported=typeof nav?.vibrate==='function';
 return {get enabled(){return enabled},supported,setEnabled(value){enabled=!!value;try{storage.setItem('chiivolley.vibration',enabled?'on':'off')}catch{}if(!enabled&&supported)try{nav.vibrate(0)}catch{}},play(events,context){if(!enabled||!supported)return;const pattern=vibrationPattern(events,context);if(pattern.length)try{nav.vibrate(pattern)}catch{}},stop(){if(supported)try{nav.vibrate(0)}catch{}}};
}
