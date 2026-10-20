import {getLanguage} from './i18n.js?v=0.52';
const translate=text=>getLanguage()==='ko'?text:({'\uc791\uc740 \uce5c\uad6c\ub4e4\uc758':'Little friends,','\ud070 \uc2b9\ubd80!!':'BIG MATCH!!','A / B \uac74\ub108\ub6f0\uae30':'Enter / Tap to skip'}[text]||text);
export const INTRO_DURATION=4600;
export const INTRO_IMPACT=950;
export const INTRO_LOGO_LAND=3300;
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
export function drawTitleIntro(c,time,world,drawLogo){
 const t=Math.max(0,time);world();c.fillStyle=`rgba(255,246,230,${1-clamp((t-3200)/1400)})`;c.fillRect(0,0,1280,720);
 if(t<2450){
  const p=ease(t/INTRO_IMPACT),hit=Math.max(0,1-(t-INTRO_IMPACT)/240),shake=t>=INTRO_IMPACT&&hit>0?Math.sin(t*.09)*hit*5:0;
  c.save();c.globalAlpha=1-clamp((t-2100)/350);c.translate(640+shake,350);const bump=t>=INTRO_IMPACT?1+Math.sin(clamp((t-INTRO_IMPACT)/240)*Math.PI)*.035:1;c.scale(bump,bump);
  const small=translate('작은 친구들의'),big=translate('큰 승부!!');
  c.font='82px PocketKO';const left=c.measureText(small).width;c.font='116px PocketKO';const right=c.measureText(big).width,start=-(left+right+24)/2;
  const fit=Math.min(1,1120/(left+right+24));c.scale(fit,fit);
  c.textAlign='left';c.textBaseline='middle';c.lineJoin='round';c.strokeStyle='#fffdf8';c.lineWidth=13;
  const phrases=[[small,82,start-(1280+left)*(1-p),'#739c91'],[big,116,start+left+24+(1280+right)*(1-p),'#d48c83']];
  for(const [text,size,x,color] of phrases){c.font=`${size}px PocketKO`;c.strokeText(text,x,0);c.fillStyle=color;c.fillText(text,x,0);}
  if(t>=INTRO_IMPACT){const burst=clamp((t-INTRO_IMPACT)/360);c.strokeStyle='#e8c16f';c.lineWidth=5;c.globalAlpha*=1-burst;for(let i=0;i<12;i++){const a=i*Math.PI/6,x=Math.cos(a),y=Math.sin(a);c.beginPath();c.moveTo(x*(170+burst*40),y*(130+burst*30));c.lineTo(x*(230+burst*90),y*(175+burst*60));c.stroke();}}
  c.restore();
 }
 if(t>=2350){
  const drop=ease((t-2350)/950);let y=-320+530*drop;
  if(t>=INTRO_LOGO_LAND)y=210-Math.sin(clamp((t-INTRO_LOGO_LAND)/300)*Math.PI)*22;
  if(t>=3700)y=210-200*ease((t-3700)/900);
  drawLogo(315,y);
 }
 c.font='16px PocketKO';c.textAlign='right';c.textBaseline='middle';c.fillStyle='#948578';c.fillText(translate('A / B 건너뛰기'),1235,682);
}
