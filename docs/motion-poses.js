export function motionPose(state,tick=0,moving=false){
 switch(state){
  case 0:return moving?2+(Math.floor(tick/3)%2):(tick%70>=65?1:0);
  case 1:return 4;
  case 2:return 5;
  case 3:return 6;
  case 4:case 6:case 7:return 7;
  case 5:return 4+(Math.floor(tick/7)%2);
  default:return 0;
 }
}
