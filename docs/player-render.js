import {translate} from './i18n.js?v=0.20';
import {actor} from './characters.js?v=0.20';
import {attackExpression} from './attack-expression.js?v=0.20';
import {drawGroggy} from './super-effects.js?v=0.20';
import {activeMember,leafPartner,pajamaIds,pajamaNames} from './teams.js?v=0.20';
export function drawPlayer(c,get,ids,side){
 const x=get(0,side),y=get(1,side),state=get(2,side),phase=get(17),tick=get(32);
 const frozen=[1,2,3,5,6].includes(phase);
 const tumbling=phase===7&&side===get(20);
 const activeId=activeMember(get,ids,side),visualHalf=activeId==='boss'?50:activeId==='siren'?65:0;
 const visualX=visualHalf?Math.max((side?216:0)+visualHalf,Math.min((side?432:216)-visualHalf,x)):x;
 const kind=get(35,side),member=get(36,side),back=side?385:47;
 const changing=kind===1&&get(6)===1,displayMember=changing?(member+3)%4:member;
 if(kind===1){for(let i=0;i<4;i++)if(i!==displayMember)actor(c,pajamaIds[i],back+(i-1.5)*15,187,.38,5,tick,{move:1,facing:side?-1:1});c.save();c.font='bold 9px "Malgun Gothic"';c.fillStyle='#405c54';c.textAlign='center';c.fillText(translate(pajamaNames[member]+(changing?' 교대 준비!':' 출전')),side?330:100,294);c.restore();}
 if(kind===2){const rescue=get(39,side),warning=get(38,side);let px=Math.max(side?250:34,Math.min(side?398:182,x+(side?46:-46))),py=244,scale=1;
  if(rescue){px=get(40,side);py=244-Math.sin((18-rescue)/18*Math.PI)*30;scale=1;}
  const combo=phase===3&&side===get(19);
  if(combo){px=Math.max(side?248:32,Math.min(side?400:184,x+(side?-38:38)));py=y-10;scale=1;}
  actor(c,leafPartner(get,side),px,py,scale,combo?(get(18)>6?1:2):rescue?2:0,tick,{move:warning||rescue||combo,facing:side?-1:1});
  c.save();c.textAlign='center';c.font='bold 9px "Malgun Gothic"';c.fillStyle=warning?'#a34e32':'#405c54';
  c.fillText(translate(warning?'내가 도울게!':rescue?'함께 살렸어!':get(37,side)?'한잎이 · 두잎이 · 구출 사용 완료':'한잎이 · 두잎이 · 함께 출전'),side?330:100,294);c.restore();
 }
 c.save();c.globalAlpha=.13;c.fillStyle='#35444c';c.beginPath();c.ellipse(visualX,274,Math.max(15,27-(244-y)*.035),4,0,0,7);c.fill();c.restore();
 let exchange=0;if(kind===1){if(changing)exchange=(side?1:-1)*get(11)*11;else if(get(6)===2)exchange=(side?1:-1)*110*(1-Math.min(1,get(11)/12));}
 c.save();c.translate(visualX+exchange,y);if(tumbling)c.rotate((66-get(18))*.38);if(phase===8&&side===get(20))c.rotate(side?-.3:.3);
 if(phase===3&&side===get(19)){c.translate(0,30);c.rotate((side?-1:1)*Math.sin((12-get(18))/12*Math.PI)*.16);c.translate(0,-30);}
 const currentId=kind===1?pajamaIds[displayMember]:activeMember(get,ids,side),size=currentId==='siren'?2:1;
 actor(c,currentId,0,-30*(size-1),size,state,phase===3?12-get(18):frozen?0:tick,{move:get(30,side)||exchange,facing:side?-1:1,expression:attackExpression(get,side,currentId)});c.restore();
 drawGroggy(c,visualX,y,get(23,side),tick);
}
