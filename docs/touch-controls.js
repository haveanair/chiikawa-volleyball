export function createTouchState(onPress,onRelease){
 const pointers=new Map(),counts=new Map();
 const release=id=>{for(const key of pointers.get(id)||[]){const n=(counts.get(key)||1)-1;if(n)counts.set(key,n);else{counts.delete(key);onRelease(key)}}pointers.delete(id)};
 return {press(id,codes){release(id);const set=new Set(codes);pointers.set(id,set);for(const key of set){const n=counts.get(key)||0;counts.set(key,n+1);if(!n)onPress(key)}},release,reset(){for(const id of [...pointers.keys()])release(id)}};
}
export function installTouchControls(onPress,onRelease){const state=createTouchState(onPress,onRelease);for(const button of document.querySelectorAll('#touch [data-keys]')){
 const codes=button.dataset.keys.split(' ');button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);state.press(e.pointerId,codes);button.classList.add('held')});
 const release=e=>{state.release(e.pointerId);button.classList.remove('held')};for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,release);
 }const reset=()=>{state.reset();document.querySelectorAll('#touch .held').forEach(el=>el.classList.remove('held'))};window.addEventListener('blur',reset);window.addEventListener('pagehide',reset);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset()});return{reset};}
