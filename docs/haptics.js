// Uses the same event bits and timing as shared/haptics.h (milliseconds).
export function vibrationPattern(events){
 if(events&1024)return [85,45,110];
 if(events&256)return [35,30,75];
 if(events&512)return [45,25,90];
 if(events&(2048|4096|8192|16384))return [65];
 if(events&(32|64))return [25,35,25];
 if(events&8)return [22];
 if(events&16)return [12];
 return [];
}
export function createHaptics(nav=globalThis.navigator,storage=globalThis.localStorage){
 let enabled=true;try{enabled=storage.getItem('chiivolley.vibration')!=='off'}catch{}
 const supported=typeof nav?.vibrate==='function';
 return {get enabled(){return enabled},supported,setEnabled(value){enabled=!!value;try{storage.setItem('chiivolley.vibration',enabled?'on':'off')}catch{}if(!enabled&&supported)try{nav.vibrate(0)}catch{}},play(events){if(!enabled||!supported)return;const pattern=vibrationPattern(events);if(pattern.length)try{nav.vibrate(pattern)}catch{}},stop(){if(supported)try{nav.vibrate(0)}catch{}}};
}
