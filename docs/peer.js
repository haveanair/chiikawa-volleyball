import {ONLINE_CONFIG} from './online-config.js?v=0.52';
export class PeerMatch{
 constructor(host,onMessage,onStatus){this.host=host;this.onMessage=onMessage;this.status=onStatus;this.connected=false;this.closed=false;this.clientId=crypto.randomUUID();this.ref=1;this.lastInput=-1;this.lastInputAt=0;this.lastSeen=Date.now();}
 async roomRequest(action,code){const response=await fetch(ONLINE_CONFIG.url+'/functions/v1/chiivolley-room',{method:'POST',headers:{apikey:ONLINE_CONFIG.key,Authorization:'Bearer '+ONLINE_CONFIG.key,'Content-Type':'application/json'},body:JSON.stringify({action,code,clientId:this.clientId,token:this.room?.token}),signal:AbortSignal.timeout(20000)});const result=await response.json();if(!response.ok)throw Error(result.message||'방 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.');return result;}
 async connect(code){
  if(!this.host&&!/^\d{4}$/.test(code||''))throw Error('숫자 4자리를 입력해 주세요.');
  this.status('방 연결 중…');const room=await this.roomRequest(this.host?'create':'join',code);this.room=room;this.code=room.code;
  if(this.closed){await this.roomRequest('leave',room.code).catch(()=>{});throw Error('연결이 취소되었습니다.');}
  this.topic='realtime:chiivolley:'+room.channel;this.role=this.host?'host':'guest';
  await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>{this.close();reject(Error('실시간 연결이 지연됩니다. 다시 시도해 주세요.'));},20000);this.joinReject=reject;
   const url=ONLINE_CONFIG.url.replace(/^http/,'ws')+'/realtime/v1/websocket?apikey='+encodeURIComponent(ONLINE_CONFIG.key)+'&vsn=1.0.0';this.ws=new WebSocket(url);
   this.ws.onopen=()=>this.push('phx_join',{config:{broadcast:{ack:false,self:false},presence:{enabled:false},postgres_changes:[],private:false}},'1');
   this.ws.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}
    if(m.event==='phx_reply'&&m.ref==='1'){
     if(m.payload?.status!=='ok'){clearTimeout(timeout);this.close();reject(Error('실시간 방에 접속할 수 없습니다.'));return}
     clearTimeout(timeout);this.subscribed=true;this.joinReject=null;this.status(this.host?'방 번호를 친구에게 알려주세요.':'상대방 연결을 기다리는 중…');this.hello();
     this.timer=setInterval(()=>{if(this.closed)return;this.push('heartbeat',{},String(++this.ref),'phoenix');this.hello();if(this.connected&&Date.now()-this.lastSeen>15000)this.fail();},3000);resolve();return;
    }
    if(m.event==='broadcast'&&m.payload?.event==='game'){const p=m.payload.payload;if(!p||p.role===this.role||!['host','guest'].includes(p.role))return;this.lastSeen=Date.now();
     if(p.kind==='bye'){this.fail();return}if(p.kind==='hi'){if(!this.connected){this.connected=true;this.hello();this.status('연결 완료! 방장이 대전을 시작할 수 있습니다.');this.onMessage({type:'connected'});}return}
     if(p.kind==='message'&&p.message&&typeof p.message.type==='string'&&this.connected)this.onMessage(p.message);
    }
    if(m.event==='phx_error'||m.event==='phx_close')this.fail();
   };
   this.ws.onerror=()=>{clearTimeout(timeout);reject(Error('온라인 서버에 연결할 수 없습니다.'));this.fail();};this.ws.onclose=()=>{clearTimeout(timeout);if(this.joinReject){this.joinReject(Error('서버 연결이 끊겼습니다.'));this.joinReject=null;}this.fail();};
  });return this.code;
 }
 push(event,payload,ref=String(++this.ref),topic=this.topic){if(this.ws?.readyState===1)this.ws.send(JSON.stringify({topic,event,payload,ref,join_ref:topic===this.topic?'1':null}));}
 broadcast(payload){if(!this.subscribed||this.ws?.readyState!==1||this.ws.bufferedAmount>=128000)return false;this.push('broadcast',{type:'broadcast',event:'game',payload:{role:this.role,...payload}});return true;}
 hello(){this.broadcast({kind:'hi'});}
 flushState(){clearTimeout(this.stateTimer);this.stateTimer=null;if(!this.connected||!this.pendingState)return;if(this.ws?.readyState!==1)return;if(this.ws.bufferedAmount>8192){this.stateTimer=setTimeout(()=>this.flushState(),16);return}const message=this.pendingState;this.pendingState=null;this.broadcast({kind:'message',message});}
 send(message){if(!this.connected)return false;
  // Replace snapshots while congested instead of queuing stale simulation frames.
  if(message.type==='state'){this.pendingState=message;this.flushState();return true}
  if(message.type==='input'){const now=Date.now();if(message.bits===this.lastInput&&now-this.lastInputAt<160)return false;if(!this.broadcast({kind:'message',message}))return false;this.lastInput=message.bits;this.lastInputAt=now;return true}
  return this.broadcast({kind:'message',message});
 }
 fail(){if(this.closed)return;this.close();this.onMessage({type:'disconnect'});}
 close(){if(this.closed)return;this.broadcast({kind:'bye'});this.closed=true;this.connected=false;clearInterval(this.timer);clearTimeout(this.stateTimer);this.pendingState=null;this.ws?.close();if(this.room)this.roomRequest('leave',this.room.code).catch(()=>{});}
}
