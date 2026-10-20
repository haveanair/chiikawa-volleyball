import {translate} from './i18n.js?v=0.52';
import {actor} from './art.js?v=0.52';
export const STATE_FIELDS=43;
export const cueCategory={2:'attack',3:'huntcutin',4:'lose',5:'win',6:'lose',7:'skill'};
export function cameraOffset(get){const phase=get(17),timer=get(18);let power=phase===1?2:phase===3?4:phase===6?Math.max(1,7*(timer/34)):0;
 if(phase===7){const elapsed=66-timer;const beat=[0,16,24,36,50,66].find(b=>elapsed>=b&&elapsed<b+5);if(beat!==undefined)power=6*(1-(elapsed-beat)/5)}
 power=Math.max(power,get(29)*1.2);
 return [Math.round(Math.sin((timer+get(29))*2.4)*power),Math.round(Math.cos((timer+get(29))*3.1)*power*.65)];}
export function drawGroggy(c,x,y,remaining,t){if(!remaining)return;c.save();c.strokeStyle='#b27348';c.lineWidth=1.2;c.beginPath();c.ellipse(x,y-41,23,6,0,0,7);c.stroke();for(let i=0;i<3;i++){const a=t*.16+i*2.094,xx=x+Math.cos(a)*23,yy=y-41+Math.sin(a)*6;c.fillStyle='#f5c65a';c.strokeStyle='#98703e';c.beginPath();for(let j=0;j<10;j++){const aa=j*Math.PI/5-Math.PI/2,rr=j%2?2.5:6;c.lineTo(xx+Math.cos(aa)*rr,yy+Math.sin(aa)*rr)}c.closePath();c.fill();c.stroke()}c.font='bold 9px "PocketKO"';c.textAlign='center';c.fillStyle='#875a51';c.fillText(translate('그로기'),x,y-55);c.restore()}
export function drawSuper(c,get,ids,names){const phase=get(17),timer=get(18),owner=get(19),target=get(20);if(!phase)return;
 c.save();
 if(phase===1||phase===2){
  c.fillStyle='#162838b8';c.fillRect(0,0,432,304);
  const progress=phase===1?0:phase===2?Math.min(1,(28-timer)/6):1;
  const slide=(1-progress)*(owner?300:-300),x=(owner?316:116)+slide;
  const enemy=['roach','boss'].includes(ids[owner]);
  const gradient=c.createLinearGradient(0,75,432,220);gradient.addColorStop(0,'#416b83');gradient.addColorStop(.5,'#8ccac0');gradient.addColorStop(1,'#ecbc7a');c.fillStyle=gradient;c.beginPath();c.moveTo(0,82);c.lineTo(432,56);c.lineTo(432,219);c.lineTo(0,244);c.closePath();c.fill();
  c.save();c.beginPath();c.moveTo(0,82);c.lineTo(432,56);c.lineTo(432,219);c.lineTo(0,244);c.closePath();c.clip();for(let i=0;i<16;i++){c.strokeStyle=i%2?'#ffffff50':'#24516a30';c.lineWidth=i%3+1;c.beginPath();c.moveTo(0,82+i*10);c.lineTo(432,56+i*10);c.stroke()}actor(c,get(35,owner)===2?'duo':ids[owner],x,enemy?170:get(35,owner)===1?90:get(35,owner)===2?160:164,enemy?1.6:ids[owner]==='armor'?2.0:get(35,owner)===2?2.2:3.5,2,28-timer,{portrait:true,upperBody:ids[owner]==='armor',facing:owner?-1:1});c.restore();
  c.textAlign=owner?'left':'right';const tx=owner?36:396;c.fillStyle='#fffdf0';c.strokeStyle='#294f64';c.lineWidth=4;c.font='bold 23px "PocketKO"';c.strokeText(names[owner],tx,118);c.fillText(names[owner],tx,118);c.font='bold 28px "PocketKO"';c.strokeText(translate('초 필 살 기 !'),tx,162);c.fillText(translate('초 필 살 기 !'),tx,162);c.font='bold 11px sans-serif';c.fillText(translate(get(35,owner)===2?'둘이 함께! 연계 강타':get(35,owner)===1?'파자마파티즈 총출동!':'필살 배구 강타'),tx,185);
 }
 if(phase===4){const bx=get(3),by=get(4),dir=owner?1:-1;c.shadowColor='#ffae42';c.shadowBlur=16;for(let i=5;i>=0;i--){c.fillStyle=i%2?'#ff9553b0':'#ffe282d0';c.beginPath();c.ellipse(bx+dir*i*11,by,20-i*2,18-i*2,0,0,7);c.fill()}c.shadowBlur=0;c.fillStyle='#fff9db';c.beginPath();c.arc(bx,by,12,0,7);c.fill();}
 if(phase===5){c.fillStyle='#e8ffff85';c.fillRect(0,0,432,304);c.font='bold 30px "PocketKO"';c.textAlign='center';c.lineWidth=4;c.strokeStyle='#fff';c.fillStyle='#456b9f';c.strokeText(translate('완벽한 반격!'),216,116);c.fillText(translate('완벽한 반격!'),216,116)}
 if(phase===6||((phase===7||phase===8)&&get(29)>0)){let x=phase===6?get(26):get(0,target),y=phase===6?get(28):get(1,target),age=phase===6?34-timer:6-get(29);let radius=phase===6?22+Math.min(20,age*2):18+age*3;let fade=phase===6?Math.max(.1,1-age/42):get(29)/6;c.globalAlpha=fade;c.fillStyle='#ffc86b';c.strokeStyle='#f18055';c.lineWidth=3;c.beginPath();for(let i=0;i<24;i++){let a=i*Math.PI/12,r=i%2?radius*.6:radius;c.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r)}c.closePath();c.fill();c.stroke();c.strokeStyle='#fffbe2';c.lineWidth=2;c.beginPath();c.arc(x,y,radius*1.3,0,7);c.stroke();for(let i=0;i<10;i++){const a=i*.628;c.beginPath();c.moveTo(x+Math.cos(a)*(radius+8),y+Math.sin(a)*(radius+8));c.lineTo(x+Math.cos(a)*(radius+25),y+Math.sin(a)*(radius+25));c.stroke()}c.globalAlpha=1;if(phase===6&&age<3){c.fillStyle=`rgba(255,244,215,${.6-age*.18})`;c.fillRect(0,0,432,304)}}
 c.restore();}









