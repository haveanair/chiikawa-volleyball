import {drawTitleIntro,INTRO_DURATION,INTRO_IMPACT,INTRO_LOGO_LAND} from './title-intro.js';
import {getLanguage} from './i18n.js?v=0.52';
import {drawTitle} from './menu-art.js';
export function createTitleOpening({impact=()=>{},land=()=>{}}={}){
 const canvas=document.createElement('canvas');canvas.id='title-opening';canvas.width=1280;canvas.height=720;canvas.tabIndex=-1;canvas.hidden=true;
 canvas.setAttribute('aria-label','Opening · Enter / Space / Escape / Tap to skip');
 canvas.style.cssText='position:fixed;inset:0;width:100%;height:100%;object-fit:contain;background:#fff6e6;z-index:10000;touch-action:none';document.body.append(canvas);
 const c=canvas.getContext('2d'),world=document.createElement('canvas');world.width=864;world.height=608;
 const logos=['title-logo-v07.png','title-logo-en-v10.png'].map(file=>{const image=new Image();image.src='assets/original-style/'+file;return image;});
 let active=false,started=0,done=null,frameId=0,hit=false,landed=false,context;
 function beat(){try{context??=new (globalThis.AudioContext||globalThis.webkitAudioContext)();context.resume().catch(()=>{});for(const delay of [0,.13]){const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+delay;o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(60,t+.18);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.35,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+.24);o.onended=()=>{o.disconnect();g.disconnect();};}}catch{}}
 function finish(){if(!active)return;active=false;cancelAnimationFrame(frameId);canvas.hidden=true;const callback=done;done=null;callback?.();}
 function frame(now){if(!active)return;const t=now-started;if(t>=INTRO_DURATION){finish();return;}c.setTransform(1,0,0,1,0,0);drawTitleIntro(c,t,()=>{drawTitle(world,now);c.drawImage(world,0,0,1280,720);},(x,y)=>{const im=logos[getLanguage()==='ko'?0:1];if(!im.complete||!im.naturalWidth)return;const s=Math.min(650/im.width,265/im.height);c.drawImage(im,x+(650-im.width*s)/2,y+(265-im.height*s)/2,im.width*s,im.height*s);});if(!hit&&t>=INTRO_IMPACT){hit=true;beat();impact();}if(!landed&&t>=INTRO_LOGO_LAND){landed=true;land();}frameId=requestAnimationFrame(frame);}
 function skip(event){if(!active)return;if(event.type==='keydown'&&!['Enter','Space','Escape','KeyA','KeyB'].includes(event.code))return;event.preventDefault();event.stopImmediatePropagation();finish();}
 window.addEventListener('keydown',skip,true);window.addEventListener('pointerdown',skip,true);
 return {get active(){return active;},play(onDone){cancelAnimationFrame(frameId);active=true;started=performance.now();hit=landed=false;done=onDone;canvas.hidden=false;canvas.focus({preventScroll:true});frameId=requestAnimationFrame(frame);},finish};
}
