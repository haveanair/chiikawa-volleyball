// One title screen between every CPU match. Hidden-tab time is not counted.
export class AttractLoop {
 constructor({onTitle,onDemo,period=20000,stageCount=5}){
  Object.assign(this,{onTitle,onDemo,period,stageCount});this.active=false;this.phase='title';this.nextStage=0;this.stage=0;this.elapsed=0;this.last=0;
 }
 get showingDemo(){return this.active&&this.phase==='demo'}
 start(now){this.active=true;this.phase='title';this.nextStage=0;this.stage=0;this.elapsed=0;this.last=now}
 stop(){this.active=false;this.elapsed=0}
 rebase(now){this.last=now}
 rewind(now){this.elapsed=0;this.last=now}
 update(now,visible=true){
  if(!this.active)return;
  const delta=Math.max(0,now-this.last);this.last=now;
  if(!visible)return;
  this.elapsed+=delta;
  while(this.active&&this.elapsed>=this.period){
   this.elapsed-=this.period;
   if(this.phase==='title'){
    this.phase='demo';this.stage=this.nextStage;this.nextStage=(this.nextStage+1)%this.stageCount;this.onDemo(this.stage);
   }else{this.phase='title';this.onTitle()}
  }
 }
}
