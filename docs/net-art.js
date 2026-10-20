import {courtGeometry} from './court-projection.js';
// Same floor center-depth axis as the projected court. Net crest center y=176.
export function drawNet(c,stage=0){
 const g=courtGeometry(stage),a=g.near,b=g.far;
 const point=(u,v)=>{const x=a.x+(b.x-a.x)*u,top=g.nearTop+(g.farTop-g.nearTop)*u+Math.sin(u*Math.PI)*1.2,height=(a.y-g.nearTop)*(1-u)+(b.y-g.farTop)*u;return [x,top+height*.62*v];};
 c.save();c.fillStyle='#54665725';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(b.x+4,b.y+2);c.lineTo(a.x+7,a.y+2);c.closePath();c.fill();
 post(c,b.x,g.farTop-3,b.y,3.1);
 // Perspective spacing compresses toward the distant pole.
 const depth=t=>t/(1.45-.45*t);
 for(let j=0;j<=7;j++)strokeCurve(c,point,0,1,j/7,'#3e6669c9',.55);
 for(let i=0;i<=12;i++){const u=depth(i/12);c.strokeStyle='#3e6669c9';c.lineWidth=.45+.3*(1-u);c.beginPath();c.moveTo(...point(u,0));c.lineTo(...point(u,1));c.stroke();}
 c.fillStyle='#fffdf0';c.strokeStyle='#78928c';c.lineWidth=.6;c.beginPath();
 for(let i=0;i<=24;i++){const [x,y]=point(i/24,0);if(i)c.lineTo(x,y);else c.moveTo(x,y);}
 for(let i=24;i>=0;i--){const u=i/24,[x,y]=point(u,0);c.lineTo(x,y+4.4-u*1.5);}c.closePath();c.fill();c.stroke();
 strokeCurve(c,point,0,1,1,'#fff6da',1.5);
 for(const u of [0,1]){c.strokeStyle='#fff4d9';c.lineWidth=1.1;c.beginPath();c.moveTo(...point(u,0));c.lineTo(...point(u,1));c.stroke();}
 post(c,a.x,g.nearTop-3,a.y,4.4);c.restore();
}
function strokeCurve(c,point,from,to,v,color,width){c.strokeStyle=color;c.lineWidth=width;c.beginPath();for(let i=0;i<=24;i++){const p=point(from+(to-from)*i/24,v);if(i)c.lineTo(...p);else c.moveTo(...p);}c.stroke();}
function post(c,x,top,bottom,w){
 c.fillStyle='#3b58562b';c.beginPath();c.ellipse(x+2,bottom+1,w*1.5,1.7,0,0,Math.PI*2);c.fill();
 const metal=c.createLinearGradient(x-w/2,0,x+w/2,0);metal.addColorStop(0,'#658c89');metal.addColorStop(.35,'#fffbed');metal.addColorStop(.6,'#c6ded3');metal.addColorStop(1,'#6e938c');c.fillStyle=metal;c.fillRect(x-w/2,top,w,bottom-top);
 c.fillStyle='#faf3d9';c.beginPath();c.ellipse(x,top,w*.6,1.2,0,0,Math.PI*2);c.fill();
 c.fillStyle='#74988c';c.fillRect(x-w*.64,bottom-5,w*1.28,5);
 c.strokeStyle='#6a8d82';c.lineWidth=.7;for(const y of [top+6,top+(bottom-top)*.62]){c.beginPath();c.moveTo(x-w*.6,y);c.lineTo(x+w*.6,y);c.stroke();}
}
