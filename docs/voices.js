// Only vo_* assets with verified character codes are mapped. Never borrow another character's voice.
const allowedVoice=file=>typeof file==='string'&&!/_titlecall_/i.test(file);
export class CharacterVoices {
 constructor(music,onStatus=()=>{}){this.onStatus=onStatus;this.epoch=0;this.music=music;this.manifest={};this.enabled=true;this.pool=new Map();this.clock=new Map();this.indices=new Map();this.active=new Map();this.ready=fetch('audio/voices/manifest.json').then(r=>{if(!r.ok)throw Error('voice manifest');return r.json()}).then(m=>{for(const entry of Object.values(m))for(const key of Object.keys(entry))if(Array.isArray(entry[key]))entry[key]=entry[key].filter(allowedVoice);this.manifest=m}).catch(()=>{});}
 async play(id,category,side=0){
  if(!this.enabled)return;const epoch=this.epoch;await this.ready;if(!this.enabled||epoch!==this.epoch)return;
  const files=category==='huntcutin'&&id==='chiikawa'?[this.activationFile(id)]:this.manifest[id]?.[category==='select'?'attack':category];if(!files?.length||!files[0])return;
  const now=performance.now(),key=id+':'+category;
  if(category==='attack'&&now-(this.clock.get(key)||-1000)<700)return;
  this.clock.set(key,now);const index=this.indices.get(key)||0;this.indices.set(key,index+1);
  const file=files[index%files.length];this.playFile(file,id,category,side);
 }
 async playStart(){
  if(!this.enabled)return;const epoch=this.epoch;
  try{this.startReady??=fetch('audio/title-calls/manifest.json').then(r=>r.ok?r.json():[]);const clips=await this.startReady;if(epoch!==this.epoch||!this.enabled||!Array.isArray(clips))return;
   const pool=clips.filter(v=>/^audio\/title-calls\/[a-z]+-chiikawa\.wav$/.test(v.file));
   if(!pool.length)return;const index=this.startIndex||0,selected=pool[index%pool.length];this.startIndex=index+1;this.playFile(selected.file,selected.id,'start',0);
  }catch{}
 }
 playFile(file,id,category,side){
  this.active.get(side)?.pause();
  const poolKey=side+':'+file;let audio=this.pool.get(poolKey);if(!audio){audio=new Audio(file);audio.preload='auto';this.pool.set(poolKey,audio)}
  audio.currentTime=0;audio.volume=.85;this.active.set(side,audio);
  this.music.volume=.2;
  const restore=()=>{if(this.active.get(side)===audio)this.active.delete(side);if(!this.active.size)this.music.volume=.45};
  audio.onplaying=()=>this.onStatus(`${id} · ${file.split('/').pop()} · 음성 재생 중`);audio.onended=()=>{restore();this.onStatus(`${id} · ${category} · 음성 재생 완료`)};audio.onerror=()=>{restore();this.onStatus(`${id} · 음성 읽기 실패`)};audio.play().catch(()=>{restore();this.onStatus('음성 재생을 시작하려면 버튼을 눌러 주세요.')});
 }
 activationFile(id){const m=this.manifest[id];if(!m)return null;const valid=Object.values(m).flat();let saved;try{saved=localStorage.getItem('chiivolley.activation.'+id)}catch{}return valid.includes(saved)?saved:id==='chiikawa'?'audio/voices/vo_ch1001_attack_003.wav':m.huntcutin?.[0]||m.skill?.[0];}
 setActivation(id,file){const valid=Object.values(this.manifest[id]||{}).flat();if(!valid.includes(file))return;try{localStorage.setItem('chiivolley.activation.'+id,file)}catch{}this.onStatus('선택한 발동음을 저장했습니다.');}
 setEnabled(on){this.enabled=on;if(!on)this.stop()}
 stop(){this.epoch++;for(const a of this.active.values())a.pause();this.active.clear();this.music.volume=.45}
}
