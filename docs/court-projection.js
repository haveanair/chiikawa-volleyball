// Court endpoints measured on each original background, in 432 x 304 units.
// Floor and net share the same center-depth axis; gameplay coordinates stay put.
const courts=[
 {far:[218,203],near:[216,277]},
 {far:[216,188],near:[216,275]},
 {far:[216,212],near:[216,275]},
 {far:[216,197],near:[216,273]},
 {far:[216,198],near:[216,276]},
];
export function courtGeometry(stage=0){
 const source=courts[stage]||courts[0],far={x:238,y:source.far[1]},near={x:194,y:source.near[1]};
 const shiftFar=far.x-source.far[0],shiftNear=near.x-source.near[0];
 const shear=(shiftNear-shiftFar)/(near.y-far.y),offset=shiftFar-shear*far.y;
 const farHeight=(near.y+far.y-352)/2.56,nearHeight=farHeight*1.56;
 return {far,near,farTop:far.y-farHeight,nearTop:near.y-nearHeight,shear,offset,cut:far.y-2};
}
export function drawCourtBackground(c,im,stage){
 const g=courtGeometry(stage);c.drawImage(im,0,0,432,304);
 c.save();c.beginPath();c.rect(0,g.cut,432,304-g.cut);c.clip();
 c.transform(1,0,g.shear,1,g.offset,0);
 // Extend edge pixels under the shear, so the floor has no empty wedges.
 c.drawImage(im,0,0,1,im.height,-80,0,80,304);
 c.drawImage(im,im.width-1,0,1,im.height,432,0,80,304);
 c.drawImage(im,0,0,432,304);c.restore();
}
