// Track actual simulation positions, rather than extrapolating through bounces.
export function createBallRenderer(){
 let history=[],tick=-1,upper=[0,0],contacts=[0,0],kind=0,rally=-1;
 function reset(){history=[];tick=-1;upper=[0,0];contacts=[0,0];kind=0;rally=-1}
 function draw(c,get){const now=get(32),x=get(3),y=get(4),phase=get(17),r=get(6);
  if(now<tick)reset();
  if(now!==tick){
   const changed=get(14,0)!==contacts[0]||get(14,1)!==contacts[1],up=get(15,0)>upper[0]||get(15,1)>upper[1];
   if(r!==rally||phase===1||phase===2||phase>=6){history=[];if(r!==rally)kind=0}
   if(changed){kind=up?2:get(12)>0?1:0;history=[]}
   history.unshift({x,y});history.length=Math.min(history.length,8);tick=now;rally=r;
   upper=[get(15,0),get(15,1)];contacts=[get(14,0),get(14,1)];
  }
  if(phase>=4&&phase!==5)return;
  c.save();
  if(kind===2||(kind===1&&get(12)>0)){
   for(let i=history.length-1;i>=1;i--){const h=history[i];c.save();c.globalAlpha=(kind===2?.68:.26)*(1-i/10);c.translate(h.x,h.y);c.rotate((now-i)*.1);ball(c,kind===2?'#b9f0ff':'#ffe0a1');c.restore()}
   c.shadowColor=kind===2?'#54dfff':'#ffbb55';c.shadowBlur=kind===2?18:10;
  }
  c.translate(x,y);c.rotate(now*.1);ball(c);c.restore();
  if(kind===2){c.save();c.strokeStyle='#a8f6ff';c.lineWidth=1.6;c.beginPath();c.arc(x,y,23,0,Math.PI*2);c.stroke();c.restore()}
 }
 return {draw,reset};
}
function ball(c,fill='#fffdf1'){c.fillStyle=fill;c.strokeStyle='#746f64';c.lineWidth=1.2;c.beginPath();c.arc(0,0,20,0,Math.PI*2);c.fill();c.stroke();c.strokeStyle='#9ebcc9';for(let i=0;i<3;i++){c.rotate(Math.PI*2/3);c.beginPath();c.moveTo(0,-20);c.quadraticCurveTo(12,0,0,20);c.stroke()}}
