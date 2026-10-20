import {drawTitleIntro,INTRO_DURATION,INTRO_IMPACT,INTRO_LOGO_LAND} from './title-intro.js?v=0.54';
import {getLanguage} from './i18n.js?v=0.54';
export function createTitleOpening({impact=()=>{},land=()=>{}}={}){
 const canvas=document.createElement('canvas');canvas.id='title-opening';canvas.width=1280;canvas.height=720;canvas.tabIndex=-1;canvas.hidden=true;
 canvas.setAttribute('aria-label','Opening · Enter / Space / Escape / Tap to skip');
 canvas.style.cssText='position:fixed;z-index:10000;touch-action:none';document.body.append(canvas);
 const c=canvas.getContext('2d');
 const logos=['title-logo-v07.png','title-logo-en-v10.png'].map(file=>{const image=new Image();image.src='assets/original-style/'+file;return image;});
 let active=false,started=0,done=null,frameId=0,hit=false,landed=false,context;
 function beat(){try{context??=new (globalThis.AudioContext||globalThis.webkitAudioContext)();context.resume().catch(()=>{});for(const delay of [0,.13]){const o=context.createOscillator(),g=context.createGain(),t=context.currentTime+delay;o.type='sine';o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(60,t+.18);g.gain.setValueAtTime(.001,t);g.gain.exponentialRampToValueAtTime(.35,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(context.destination);o.start(t);o.stop(t+.24);o.onended=()=>{o.disconnect();g.disconnect();};}}catch{}}
 function finish(){if(!active)return;active=false;cancelAnimationFrame(frameId);canvas.hidden=true;document.body.classList.remove('opening-active');const callback=done;done=null;callback?.();}
 function render(t){
  const title=document.getElementById('title-screen'),rect=title.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
  canvas.style.left=rect.left+'px';canvas.style.top=rect.top+'px';canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
  const width=Math.round(rect.width*dpr),height=Math.round(rect.height*dpr);
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,rect.width,rect.height);
  // Keep the real title artwork underneath: its aspect ratio and layout never change.
  c.fillStyle=`rgba(255,246,230,${1-Math.max(0,Math.min(1,(t-3200)/1400))})`;c.fillRect(0,0,rect.width,rect.height);
  const scale=Math.min(rect.width/1280,rect.height/720);
  c.save();c.translate((rect.width-1280*scale)/2,(rect.height-720*scale)/2);c.scale(scale,scale);
  drawTitleIntro(c,t,()=>{},()=>{
   const im=logos[getLanguage()==='ko'?0:1],element=document.getElementById(getLanguage()==='ko'?'title-logo':'title-logo-en');
   if(!im.complete||!im.naturalWidth)return;
   const box=element.getBoundingClientRect(),fit=Math.min(box.width/im.naturalWidth,box.height/im.naturalHeight),w=im.naturalWidth*fit,h=im.naturalHeight*fit;
   const x=box.left-rect.left+(box.width-w)/2,finalY=box.top-rect.top+(box.height-h)/2;
   const progress=Math.max(0,Math.min(1,(t-2350)/(INTRO_LOGO_LAND-2350))),ease=1-Math.pow(1-progress,3);
   let y=(-h-rect.height*.05)*(1-ease)+finalY*ease;
   if(t>=INTRO_LOGO_LAND)y=finalY-Math.sin(Math.min(1,(t-INTRO_LOGO_LAND)/300)*Math.PI)*12*scale;
   c.save();c.setTransform(dpr,0,0,dpr,0,0);c.drawImage(im,x,y,w,h);c.restore();
  },{backgroundFade:false});c.restore();
 }
 function frame(now){if(!active)return;const t=now-started;if(t>=INTRO_DURATION){finish();return;}render(t);if(!hit&&t>=INTRO_IMPACT){hit=true;beat();impact();}if(!landed&&t>=INTRO_LOGO_LAND){landed=true;land();}frameId=requestAnimationFrame(frame);}
 function skip(event){if(!active)return;if(event.type==='keydown'&&!['Enter','Space','Escape','KeyA','KeyB'].includes(event.code))return;event.preventDefault();event.stopImmediatePropagation();finish();}
 window.addEventListener('keydown',skip,true);window.addEventListener('pointerdown',skip,true);
 return {get active(){return active;},play(onDone){cancelAnimationFrame(frameId);active=true;started=performance.now();hit=landed=false;done=onDone;document.body.classList.add('opening-active');canvas.hidden=false;render(0);canvas.focus({preventScroll:true});frameId=requestAnimationFrame(frame);},finish};
}
