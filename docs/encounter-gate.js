// Both players finish/skip before the authoritative host starts simulation.
export class EncounterGate{
 constructor({host,send,start}){Object.assign(this,{host,send,start});this.local=false;this.remote=false;this.started=false;}
 finishLocal(){if(this.started||this.local)return;this.local=true;this.timer=setInterval(()=>{if(!this.started){this.send({type:'encounter-ready'});this.tryStart()}},1000);this.send({type:'encounter-ready'});this.tryStart()}
 receive(message){if(this.started)return;if(message.type==='encounter-ready'){this.remote=true;this.tryStart()}else if(message.type==='encounter-begin'&&!this.host&&this.local){this.started=true;this.cancel();this.start()}}
 tryStart(){if(this.host&&this.local&&this.remote&&!this.started){if(this.send({type:'encounter-begin'})===false)return;this.started=true;this.cancel();this.start()}}
 cancel(){clearInterval(this.timer)}
}
