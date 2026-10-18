// Two perspective poles; the binding crosses the collision crest at x=216, y=176.
export function drawNet(c){
 c.save();c.strokeStyle='#fffbea99';c.lineWidth=1.3;c.beginPath();c.moveTo(194,277);c.lineTo(238,203);c.stroke();
 c.fillStyle='#53635b20';c.beginPath();c.moveTo(194,277);c.lineTo(238,203);c.lineTo(244,204);c.lineTo(203,278);c.closePath();c.fill();
 const point=(u,v)=>[194+44*u,199-48*u+Math.sin(u*Math.PI)*1.3+v*(43-10*u)];post(c,238,149,203,3.1);
 c.strokeStyle='#4c696b99';c.lineWidth=.65;
 for(let i=0;i<=10;i++){const u=i/10;c.beginPath();c.moveTo(...point(u,0));c.lineTo(...point(u,1));c.stroke()}
 for(let j=1;j<=10;j++){c.beginPath();for(let i=0;i<=12;i++){const p=point(i/12,j/10);if(i)c.lineTo(...p);else c.moveTo(...p)}c.stroke()}
 c.fillStyle='#fff9e8';c.strokeStyle='#adad95';c.lineWidth=.65;c.beginPath();
 for(let i=0;i<=16;i++){const [x,y]=point(i/16,0);if(i)c.lineTo(x,y);else c.moveTo(x,y)}
 for(let i=16;i>=0;i--){const u=i/16,[x,y]=point(u,0);c.lineTo(x,y+4.5-u*1.5)}c.closePath();c.fill();c.stroke();
 c.strokeStyle='#899b89';c.lineWidth=1;c.beginPath();c.moveTo(...point(0,1));c.lineTo(...point(1,1));c.stroke();post(c,194,197,277,4.4);c.restore();
}
function post(c,x,top,bottom,width){
 c.fillStyle='#42585625';c.beginPath();c.ellipse(x+2,bottom+1,width*1.6,1.8,0,0,Math.PI*2);c.fill();
 const metal=c.createLinearGradient(x-width/2,0,x+width/2,0);metal.addColorStop(0,'#72918e');metal.addColorStop(.4,'#e3ebe0');metal.addColorStop(1,'#74928f');c.fillStyle=metal;c.fillRect(x-width/2,top,width,bottom-top);
 c.fillStyle='#fff5dc';c.beginPath();c.ellipse(x,top,width*.65,1.5,0,0,Math.PI*2);c.fill();c.fillStyle='#739087';c.fillRect(x-width*.65,bottom-5,width*1.3,5);
}
