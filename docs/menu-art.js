import {actor,background} from './art.js?v=0.52';
export function drawTitle(canvas,time=0){
 const c=canvas.getContext('2d');c.setTransform(2,0,0,2,0,0);background(c,0);
 // Compose existing raster artwork; keep the game characters' original drawings.
 const friends=[['rakko',62,218,.78],['momonga',369,218,.85],['chiikawa',142,216,1.25],['hachiware',217,218,1.25],['usagi',294,216,1.25]];
 friends.forEach(([id,x,y,size],i)=>{
  const phase=time/650+i*1.7,breath=time?Math.sin(phase):0;
  // Anchor at the feet so breathing never shifts the lineup into the menu.
  c.save();c.translate(x,y+30*size);c.scale(1+breath*.006,1+breath*.012);
  actor(c,id,0,-30*size,size,0,time?time/90+i*5:0,{move:time>0,facing:x<216?1:-1});c.restore();
 });
}
export function drawSelectionPortrait(canvas,id,facing=1,locked=false){
 const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);
 c.save();c.globalAlpha=locked?.4:1;
 if(id==='boss'){actor(c,id,160,190,2.8,0,0,{portrait:true,selection:true,facing});}else if(id==='siren'){
  // Use the full portrait canvas for the wide boss silhouette, with room for the tail.
  actor(c,id,160,158,4.6,0,0,{portrait:true,facing});
 }else actor(c,id,160,id==='armor'||id==='pajamas'?160:190,id==='armor'?3.7:id==='pajamas'?4:3.3,0,0,{portrait:true,selection:true,facing,upperBody:id==='armor'});c.restore();
}
