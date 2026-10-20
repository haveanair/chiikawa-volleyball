import {sourceFacing as resolveSourceFacing} from './source-facing.js?v=0.52';
import {drawCourtBackground} from './court-projection.js?v=0.52';
// Native Pocket drawings + reference-guided raster scenes. No procedural character/background fallback.
import {motionPose} from './motion-poses.js?v=0.52';
const base='assets/original-style/',images=new Map();let meta=null;
export async function loadArt(loader,manifest){
 if(manifest)meta=manifest;
 if(!loader)loader=src=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('그림을 불러오지 못했습니다: '+src));im.src=src+'?v=0.20'});
 if(!meta){const r=await fetch(base+'characters/manifest.json',{cache:'no-store'});if(!r.ok)throw Error('Character manifest');meta=await r.json()}
 const files=[];for(let i=1;i<=5;i++)files.push(base+`courts/stage-${i}.png`);
 for(const entry of Object.values(meta.characters)){files.push(base+'characters/'+entry.file);if(entry.portrait)files.push(base+'characters/'+entry.portrait);if(entry.motion)files.push(base+'characters/'+entry.motion.file);if(entry.kya)files.push(base+'characters/'+entry.kya);if(entry.selectionPortrait)files.push(base+'characters/'+entry.selectionPortrait)}
 await Promise.all([...new Set(files)].map(async src=>images.set(src,await loader(src))));
}
export const ready=typeof Image==='undefined'?Promise.resolve():loadArt();
if(typeof Image!=='undefined')await ready;
export function background(c,stage){const im=images.get(base+`courts/stage-${stage+1}.png`);if(im)drawCourtBackground(c,im,stage);}
export function endingBackdrop(c){const im=images.get(base+'courts/stage-1.png');if(im){const h=im.height*210/304;c.drawImage(im,0,im.height-h,im.width,h,0,0,432,210)}}
export function actor(c,id,x,y,size=1,state=0,t=0,pose={}){
 if(id==='pajamas'){
  ['purple','green','pink','white'].forEach((color,i)=>actor(c,'pajama-'+color,x+(i-1.5)*16*size,y+21*size,size*.30,state,t,pose));return;
 }
 if(id==='duo'){actor(c,'hitoha',x-17*size,y,size*.68,state,t,pose);actor(c,'futaha',x+17*size,y,size*.68,state,t,pose);return}
 const entry=meta?.characters[id];if(!entry)return;
 c.save();c.translate(x,y);const face=pose.facing===-1?-1:1,poseIndex=motionPose(state,t,!!pose.move),nativeFrame=state===0&&!pose.move?0:Math.floor(t/3)%8,sourceFacing=resolveSourceFacing(entry,state,nativeFrame,poseIndex,pose);c.scale(size*face*sourceFacing,size);
 const movingArt=entry.motion&&!pose.portrait;
 if(!movingArt){if(state===3){c.rotate(.7);c.scale(1.1,.85)}else if(state===4)c.rotate(1.3);}
 if(movingArt){
  const im=images.get(base+'characters/'+entry.motion.file),b=entry.motion.frames[motionPose(state,t,!!pose.move)],scale=(entry.logicalWidth||55)/entry.motion.frames[0].w;
  const w=b.w*scale,h=b.h*scale,breath=state===0&&!pose.move?Math.sin(t*.13)*.012:0;
  c.translate(0,30);c.scale(1-breath*.3,1+breath);if(im)c.drawImage(im,b.x,b.y,b.w,b.h,-w/2,-h,w,h);
 }else if(entry.kind==='static'){
  const im=images.get(base+'characters/'+entry.file),b=entry.bounds;if(im&&b){const width=entry.logicalWidth||55,height=width*b.h/b.w;const bob=state===0&&pose.move?Math.abs(Math.sin(t*.8))*1.5:0;c.drawImage(im,b.x,b.y,b.w,b.h,-width/2,30-height-bob,width,height)}
 }else{
  const selected=pose.selection&&entry.selectionPortrait,portrait=pose.portrait&&images.get(base+'characters/'+(selected?entry.selectionPortrait:entry.portrait));
  if(portrait){const b=selected?entry.selectionBounds:entry.portraitBounds;if(b){const cropHeight=pose.upperBody?Math.round(b.h*.60):b.h,width=pose.upperBody?65:selected?entry.selectionWidth||55:entry.portraitWidth||55,height=width*cropHeight/b.w;c.drawImage(portrait,b.x,b.y,b.w,cropHeight,-width/2,30-height,width,height)}else c.drawImage(portrait,-80,-110,160,160);}
  else {const im=images.get(base+'characters/'+(pose.expression==='kya'&&entry.kya?entry.kya:entry.file)),frame=state===0&&!pose.move?0:Math.floor(t/3)%8;if(im)c.drawImage(im,frame*320,Math.min(7,state)*320,320,320,-80,-110,160,160)}
 }
 c.restore();
}

