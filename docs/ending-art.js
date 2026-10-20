import {translate} from './i18n.js?v=0.52';
import {actor,background} from './raster-art.js?v=0.52';
import {endingFeet} from './ending-feet.js?v=0.52';
export const endingCast={front:['chiikawa','hachiware','usagi','rakko','momonga','kurimanju','shisa','kani'],middle:['pajama-purple','pajama-green','pajama-pink','pajama-white','armor','hitoha','futaha'],back:['boss','roach','siren']};
export const endingLayout=[
 {id:'boss',x:84,ground:203,size:1.12,row:'back'},
 {id:'roach',x:216,ground:203,size:.78,row:'back'},
 {id:'siren',x:346,ground:203,size:1.65,row:'back'},
 ...endingCast.middle.map((id,i)=>({id,x:44+i*57.4,ground:236,size:id==='armor'?.38:.43,row:'middle'})),
 ...endingCast.front.map((id,i)=>({id,x:[34,82,136,187,239,290,341,392][i],ground:295,size:id==='momonga'?.60:.70,row:'front'}))
];
export function drawEndingCharacter(c,entry,t,offset){
 const {id,x,ground,size}=entry,time=t+offset*3,frame=Math.floor(time/3)%8,feet=endingFeet[id]?.[frame]??30;
 c.save();c.globalAlpha=.12;c.fillStyle='#4d5849';c.beginPath();c.ellipse(x,ground+1,size*(id==='boss'?34:id==='siren'?24:19),1.8,0,0,Math.PI*2);c.fill();c.restore();
 const breath=Math.sin(t*.18+offset*1.3);c.save();c.translate(x,ground);c.scale(1+breath*.008,1+breath*.018);actor(c,id,0,-feet*size,size,5,time,{facing:x<216?1:-1});c.restore();
}
export function drawEnding(c,t=0){
 c.save();c.setTransform(2,0,0,2,0,0);background(c,0);endingLayout.forEach((entry,i)=>drawEndingCharacter(c,entry,t,i));
 c.fillStyle='#fffdf2';c.strokeStyle='#655b53';c.lineWidth=3;c.font='bold 15px "PocketKO", sans-serif';c.textAlign='center';const text=translate('모두 함께해서 즐거웠어!');c.strokeText(text,216,35);c.fillText(text,216,35);c.restore();
}
