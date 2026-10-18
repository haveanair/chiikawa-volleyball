import {installTouchControls} from './touch-controls.js?v=0.23';
import {createCombatAudio,combatEvents} from './combat-audio.js?v=0.20';
import {installScoreNameFit} from './score-name-fit.js?v=0.20';
import {TEST_BUILD} from './build-config.mjs?v=0.26';
import {installLanguageUI,translate} from './i18n.js?v=0.20';
import {drawNet} from './net-art.js?v=0.20';
import {createBallRenderer} from './ball-effects.js?v=0.20';
import {updateChargeMeter,chargeTone} from './charge-meter.js?v=0.20';
import {drawTitle,drawSelectionPortrait} from './menu-art.js?v=0.20';
import {configureTeams,teamLabel} from './teams.js?v=0.20';
import {drawEnding} from './ending-art.js?v=0.20';
import {drawPlayer} from './player-render.js?v=0.20';
import {STATE_FIELDS,cueCategory,cameraOffset,drawGroggy,drawSuper} from './super-effects.js?v=0.20';
import {CharacterVoices} from './voices.js?v=0.20';
import {PeerMatch} from './peer.js?v=0.20';
import {roster,stages,fresh,goals,unlocked,recordWin,loadProgress} from './progress.mjs?v=0.26';
import {actor,background} from './art.js?v=0.20';
installLanguageUI();
installScoreNameFit();
if(TEST_BUILD){document.querySelector('#selection .section-title span').textContent='테스트판 · 모든 캐릭터 개방';document.querySelector('.selection-keys').textContent='방향키 / W A S D: 이동 · Enter: 결정';}
const $=id=>document.getElementById(id),canvas=$('court'),c=canvas.getContext('2d'),music=$('music');
let p=loadProgress(localStorage),chosen=['chiikawa','hachiware'],mode=0,stage=0,selectSide=0,running=false,paused=false,handled=false,muted=false,last=0,acc=0,t=0,tracked=[0,0,0],net=null;
const voices=new CharacterVoices(music);let voiceSeen=[0,0];
let core;
let soundContext;const combatAudio=createCombatAudio();
const ballRenderer=createBallRenderer();let chargeSeen=[0,0];
document.addEventListener('pointerdown',()=>{try{soundContext??=new AudioContext();soundContext.resume().catch(()=>{})}catch{}});
function effects(events){if(!events||muted)return;try{soundContext??=new AudioContext();if(soundContext.state!=='running')return;combatAudio.play(soundContext,events).catch(console.error);if(combatEvents(events).length)return;const osc=soundContext.createOscillator(),gain=soundContext.createGain(),now=soundContext.currentTime;osc.type=(events&8)?'triangle':'sine';osc.frequency.setValueAtTime((events&8)?740:(events&16)?130:430,now);osc.frequency.exponentialRampToValueAtTime((events&8)?180:220,now+.09);gain.gain.setValueAtTime(.035,now);gain.gain.exponentialRampToValueAtTime(.001,now+.11);osc.connect(gain);gain.connect(soundContext.destination);osc.start(now);osc.stop(now+.12)}catch{}}
try{const response=await fetch('./public/game.wasm?v=0.20',{cache:'no-store'});if(!response.ok)throw Error('game.wasm HTTP '+response.status);core=(await WebAssembly.instantiate(await response.arrayBuffer())).instance.exports}catch(e){$('select-title').textContent='경기 코어를 불러오지 못했습니다. 실행하기.cmd로 실행해 주세요.';console.error(e);throw e}
const get=(f,s=0)=>(net?.connected&&!net.host&&netState)?netState[f*2+(s&1)]:core.get(f,s),keys=new Set(),edges=new Set(),touchKeys=new Set();
function save(){try{localStorage.setItem('chiivolley.progress.v1',JSON.stringify(p))}catch{$('save-note').textContent='저장 공간을 사용할 수 없어 이번 실행에서만 기록됩니다.'}}
function play(n){const url=new URL(`audio/${String(n).padStart(2,'0')}.mp3`,location.href).href;if(music.src!==url){music.src=url;music.currentTime=0}music.muted=muted;music.volume=.45;music.play().then(()=>{$('title-music').hidden=true}).catch(()=>{if(document.body.classList.contains('title-open'))$('title-music').hidden=false});}
function stop(){voices.stop();running=false;paused=false;keys.clear();edges.clear();$('pause').textContent='일시정지'}
function portraits(preview=chosen[selectSide]){
 const ids=[chosen[0],mode===1?chosen[1]:stages[stage][2]];ids[selectSide]=preview;
 for(let side=0;side<2;side++){const suffix=side?'two':'one',id=ids[side],r=roster.find(r=>r.id===id),locked=!!r&&!unlocked(p,id);drawSelectionPortrait($('portrait-'+suffix),id,side?-1:1,locked);$('portrait-name-'+suffix).textContent=r?.name||stages[stage][1];$('portrait-status-'+suffix).textContent=locked?'미해금 · 도전과제를 확인하세요':side===1&&mode===0?'STAGE BOSS':mode===1&&selectSide===1&&side===0?'선택 완료':'READY';}
 $('right-tag').textContent=mode===1?'2P':'CPU';$('select-turn').textContent=`${selectSide+1}P SELECT`;
 $('versus-context').textContent=mode===1?'친구와 2인 대전':`${stage+1} STAGE\n${stages[stage][0]}`;
 $('selection').dataset.turn=String(selectSide+1);
}
function cards(){const grid=$('roster');grid.replaceChildren();$('select-title').textContent=mode===1?`${selectSide+1}P · 캐릭터를 선택하세요`:`${stage+1}스테이지 · 캐릭터를 선택하세요`;
 for(const r of roster){const open=unlocked(p,r.id),b=document.createElement('button');b.className='character'+(chosen[selectSide]===r.id?' selected':'');b.dataset.id=r.id;b.style.setProperty('--wash',r.wash);b.setAttribute('aria-pressed',String(chosen[selectSide]===r.id));b.setAttribute('aria-disabled',String(!open));b.setAttribute('aria-label',r.name+(open?' 선택':' · '+(goals.find(g=>g.id===r.id)?.text||'')));
 const pic=document.createElement('canvas');pic.width=180;pic.height=150;actor(pic.getContext('2d'),r.id,90,r.id==='armor'?80:r.id==='siren'?72:r.id==='pajamas'?78:90,r.id==='armor'?1.85:r.id==='siren'?1.8:1.5,0,0,{portrait:true,selection:true,upperBody:r.id==='armor'});if(!open)pic.style.opacity='.35';const label=document.createElement('b');label.textContent=r.name;const sub=document.createElement('small');sub.textContent=open?'선택 가능':goals.find(g=>g.id===r.id)?.text||'';b.append(pic,label,sub);
 const flags=[];if(chosen[0]===r.id)flags.push('1P');if(mode===1&&chosen[1]===r.id)flags.push('2P');if(!open||flags.length){const flag=document.createElement('span');flag.className='cursor-tag';flag.textContent=open?flags.join(' / '):'🔒';b.append(flag)}
 const inspect=()=>{portraits(r.id);$('selection-note').textContent=open?`${selectSide+1}P · ${r.name} — 선택 후 결정 버튼을 눌러주세요.`:`${r.name} 해금 조건: ${sub.textContent}`};b.onpointerenter=inspect;b.onfocus=inspect;b.onclick=()=>{if(!open){inspect();return}chosen[selectSide]=r.id;voices.play(r.id,'select',selectSide);cards();$('start').focus({preventScroll:true});$('selection-note').textContent=`${selectSide+1}P · ${r.name} 선택`};grid.append(b)}
 $('start').textContent=mode===1&&selectSide===0?'1P 결정 · 2P 선택 →':'선택 결정 · 경기 시작 →';$('stage-picker').hidden=mode===1;portraits();$('selection-note').textContent=TEST_BUILD?'테스트판 · 모든 캐릭터와 5개 스테이지를 자유롭게 선택할 수 있어요.':'처음에는 치이카와 · 하치와레 · 우사기를 선택할 수 있어요.';
}
function showTitle(){if(net){const old=net;net=null;old.close()}stop();document.body.classList.add('title-open');$('title-screen').hidden=false;drawTitle($('title-art'));$('title-start').disabled=false;play(1);$('title-start').focus()}
function enterGame(){document.body.classList.remove('title-open');$('title-screen').hidden=true;mode=0;selection(true);$('start').focus({preventScroll:true});voices.playStart()}
function selection(reset=false){chosen=chosen.map((id,i)=>unlocked(p,id)?id:i?'hachiware':'chiikawa');if(net){const old=net;net=null;old.close()}$('network').hidden=true;stop();$('arena').hidden=true;$('ending').hidden=true;$('selection').hidden=false;if(reset)stage=0;$('stage-select').value=String(stage);for(const option of $('stage-select').options)option.disabled=!TEST_BUILD&&Number(option.value)>0&&p.margins[Number(option.value)-1]===0;selectSide=0;$('score').disabled=false;cards();drawGoals();play(1)}
function start(){if(mode===1&&selectSide===0){selectSide=1;cards();return}if(!net&&(!unlocked(p,chosen[0])||!unlocked(p,chosen[1])))return;core.init(mode,stage+1,Number($('score').value));configureTeams(core,characterIds());tracked=[0,0,0];voiceSeen=[0,0];chargeSeen=[0,0];ballRenderer.reset();voices.stop();handled=false;running=true;paused=false;acc=0;last=performance.now();$('selection').hidden=true;$('arena').hidden=false;$('result').hidden=true;$('name1').textContent=(teamLabel(chosen[0])||roster.find(r=>r.id===chosen[0]).name);$('name2').textContent=mode===1?(teamLabel(chosen[1])||roster.find(r=>r.id===chosen[1]).name):stages[stage][1];$('stage-label').textContent=(net?'온라인 친구 대전 · ':mode===1?'2인 대전 · ':`${stage+1} / 5 · `)+stages[stage][0];play(stages[stage][3]);canvas.focus();render()}
function drawGoals(){const box=$('goals');box.replaceChildren();for(const g of [...goals].sort((a,b)=>roster.findIndex(r=>r.id===a.id)-roster.findIndex(r=>r.id===b.id))){const done=g.value(p)>=g.target,item=document.createElement('div');item.className='goal'+(done?' complete':'');const title=document.createElement('b');title.textContent=(done?'✓ ':'○ ')+g.name;const text=document.createElement('p');text.textContent=`${roster.find(r=>r.id===g.id).name} · ${g.text}`;const meter=document.createElement('progress');meter.max=g.target;meter.value=Math.min(g.value(p),g.target);const count=document.createElement('small');count.textContent=done?'해금 완료':`${g.value(p)} / ${g.target}`;item.append(title,text,meter,count);box.append(item)}}
function record(){if(mode!==0)return;const before=goals.filter(g=>unlocked(p,g.id)).map(g=>g.id);let changed=false;for(const [i,field,key] of [[0,14,'contacts'],[1,15,'upper'],[2,16,'supers']]){const n=get(field);if(n!==tracked[i])changed=true;p[key]+=n-tracked[i];tracked[i]=n}if(changed)save();const newNames=goals.filter(g=>!before.includes(g.id)&&unlocked(p,g.id)).map(g=>roster.find(r=>r.id===g.id).name);if(newNames.length)toast('새 친구 해금! '+newNames.join(' · '));}
let toastUntil=0,toastText='';function toast(s){toastText=s;toastUntil=performance.now()+4000;$('live').textContent=s}
function finish(){if(handled)return;handled=true;record();const win=get(10)===0,before=roster.filter(r=>unlocked(p,r.id)).map(r=>r.id);if(mode===0){recordWin(p,stage,get(5,0),get(5,1));save();}const names=roster.filter(r=>!before.includes(r.id)&&unlocked(p,r.id)).map(r=>r.name);$('result-title').textContent=mode===1?`${get(10)+1}P 승리!`:win?'승리! 다음 코트로 가볼까요?':'아쉬워요! 다시 도전해 봐요.';$('result-detail').textContent=`${get(5,0)} : ${get(5,1)}`+(names.length?` · 새 친구: ${names.join(', ')}`:'');$('next').textContent=mode===0&&win?(stage===4?'엔딩 보기 →':'다음 스테이지 선택 →'):'다시 캐릭터 선택 →';$('result').hidden=false;drawGoals();}
function bits(side){const m=side?['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyK']:['KeyA','KeyD','KeyW','KeyS','KeyF'];let b=0;for(let i=0;i<4;i++)if(keys.has(m[i])||touchKeys.has(m[i]))b|=1<<i;for(let i=4;i<5;i++)if(edges.has(m[i]))b|=1<<i;return b}
function characterIds(){return [chosen[0],mode===1?chosen[1]:stages[stage][2]]}
function observeVoices(){const ids=characterIds();for(let side=0;side<2;side++){const serial=get(24,side);if(serial!==voiceSeen[side]){voiceSeen[side]=serial;const category=cueCategory[get(25,side)];if(category)voices.play(ids[side],category,side)}}}
function tick(){if(net?.connected&&!net.host){net.send({type:'input',bits:bits(0)});edges.clear();return}core.step(bits(0),net?.connected?remoteBits:bits(1));remoteBits&=15;edges.clear();if(net?.connected){const state=[];for(let f=0;f<STATE_FIELDS;f++)for(let s=0;s<2;s++)state.push(core.get(f,s));net.send({type:'state',state})}record();observeVoices();const events=core.sounds();effects(events);if(net?.connected&&events)net.send({type:'sfx',events});if(get(6)===3)finish();t++;}
function render(){c.setTransform(2,0,0,2,0,0);t=get(32);c.fillStyle='#32434b';c.fillRect(0,0,432,304);c.save();const shake=cameraOffset(get);c.translate(...shake);background(c,stage,t);for(let side=0;side<2;side++)drawPlayer(c,get,characterIds(),side);
 drawNet(c);
 ballRenderer.draw(c,get);drawSuper(c,get,characterIds(),[$('name1').textContent,$('name2').textContent]);c.restore();
 $('points').textContent=`${get(5,0)} : ${get(5,1)}`;for(let side=0;side<2;side++){const charge=get(7,side);updateChargeMeter($('meter'+(side+1)),charge,get(8,side),side);if(charge>chargeSeen[side]&&!muted)chargeTone(soundContext,charge===10);chargeSeen[side]=charge;}

 let msg=paused?'일시정지':get(6)===4?'READY?':get(6)===2?'다음 서브!':get(17)===8?'':performance.now()<toastUntil?toastText:'';if(msg){c.font='bold 20px "PocketKO"';c.textAlign='center';c.lineWidth=5;c.strokeStyle='#fffdf1';c.strokeText(translate(msg),216,110);c.fillStyle='#405c54';c.fillText(translate(msg),216,110)}}
const titleMotion=matchMedia('(prefers-reduced-motion: reduce)');let titleFrameAt=0,endingFrameAt=0;
function frame(now){if(!$('ending').hidden&&!document.hidden&&now-endingFrameAt>=40){drawEnding($('ending-art').getContext('2d'),titleMotion.matches?0:now/120);endingFrameAt=now;}if(document.body.classList.contains('title-open')&&!document.hidden&&now-titleFrameAt>=40){drawTitle($('title-art'),titleMotion.matches?0:now);titleFrameAt=now}if(running){acc+=Math.min(now-last,150);if(!paused){let count=0;while(acc>=1000/25&&count++<5){tick();acc-=1000/25}}else acc=0;render()}last=now;requestAnimationFrame(frame)}
window.addEventListener('keydown',e=>{
 if(document.body.classList.contains('title-open')){if(!(e.target instanceof HTMLSelectElement)&&(e.code==='Enter'||e.code==='Space')){e.preventDefault();$('title-start').click()}return}
 if(!$('selection').hidden&&!(e.target instanceof HTMLSelectElement)){
  const moves={ArrowLeft:-1,KeyA:-1,ArrowRight:1,KeyD:1,ArrowUp:-1,KeyW:-1,ArrowDown:1,KeyS:1};
  if(e.code in moves){e.preventDefault();const buttons=[...$('roster').children],columns=getComputedStyle($('roster')).gridTemplateColumns.split(' ').length,current=buttons.findIndex(b=>b===document.activeElement),base=current<0?roster.findIndex(r=>r.id===chosen[selectSide]):current,vertical=['ArrowUp','ArrowDown','KeyW','KeyS'].includes(e.code),next=(base+moves[e.code]*(vertical?columns:1)+buttons.length)%buttons.length;buttons[next].focus();return}
  if((e.code==='Enter'||e.code==='Space')&&!e.repeat&&e.target===$('start')){e.preventDefault();start();return}
 }
if(e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement||e.target instanceof HTMLSelectElement)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(!keys.has(e.code))edges.add(e.code);keys.add(e.code);if(e.code==='Escape'&&running)$('pause').click()});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();edges.clear();if(running&&!paused)$('pause').click()});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)$('pause').click()});
const touchControls=installTouchControls(key=>{touchKeys.add(key);edges.add(key)},key=>touchKeys.delete(key));
$('mobile-fullscreen').hidden=!document.fullscreenEnabled;
$('mobile-fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else{await $('arena').requestFullscreen();await screen.orientation?.lock?.('landscape').catch(()=>{});}}catch{}};
const touchScreen=matchMedia('(any-pointer:coarse)');function updateMobileView(){document.documentElement.style.setProperty('--play-height',(window.visualViewport?.height||innerHeight)+'px');document.documentElement.style.setProperty('--play-width',(window.visualViewport?.width||innerWidth)+'px');document.body.classList.toggle('mobile-match',touchScreen.matches&&!$('arena').hidden);if($('arena').hidden)touchControls.reset();}touchScreen.addEventListener('change',updateMobileView);window.addEventListener('resize',updateMobileView);window.addEventListener('orientationchange',()=>{touchControls.reset();updateMobileView();});window.visualViewport?.addEventListener('resize',updateMobileView);new MutationObserver(updateMobileView).observe($('arena'),{attributes:true,attributeFilter:['hidden']});updateMobileView();
for(const [id,fn] of Object.entries({story:()=>{mode=0;selection(true)},versus:()=>{mode=1;selection()},home:()=>selection(),start, pause:()=>{paused=!paused;$('pause').textContent=paused?'계속하기':'일시정지';keys.clear();edges.clear()},sound:()=>{muted=!muted;music.muted=muted;$('sound').textContent=muted?'♫ 음악 꺼짐':'♫ 음악 켜짐';if(!muted)music.play().catch(()=>{})},next:()=>{if(net){$('online').click();return}if(mode===0&&get(10)===0){if(stage===4){p.ending=true;save();drawGoals();drawEnding($('ending-art').getContext('2d'));stop();$('arena').hidden=true;$('ending').hidden=false;play(6);return}stage++}selection()},again:()=>{mode=0;selection(true)}}))$(id).onclick=fn;
let netState=null,remoteBits=0,remoteCharacter='hachiware';
function netMessage(m){
 if(!net)return;
 if(m.type==='sfx'&&!net.host&&Number.isInteger(m.events))effects(m.events);
 if(m.type==='connected'){net.send({type:'hello',protocol:8,character:$('net-character').value});$('net-start').disabled=true}
 if(m.type==='hello'&&m.protocol!==8){$('net-status').textContent='게임 버전이 다릅니다. 양쪽 화면을 새로고침해 주세요.';net.connected=false;$('net-start').disabled=true;return}
 if(m.type==='hello'&&m.protocol===8&&roster.some(r=>r.id===m.character)){remoteCharacter=m.character;$('net-character').disabled=true;$('net-start').disabled=!net.host}
 if(m.type==='input'&&net?.host&&Number.isInteger(m.bits))remoteBits=(m.bits&15)|(remoteBits&16)|(m.bits&16);
 if(m.type==='state'&&!net?.host&&Array.isArray(m.state)&&m.state.length===STATE_FIELDS*2&&m.state.every(Number.isFinite)){netState=m.state;observeVoices();if(get(6)===3)finish()}
 if(m.type==='start'&&!net?.host&&Array.isArray(m.chars)&&m.chars.length===2&&m.chars.every(id=>roster.some(r=>r.id===id)))launchNet(m.chars,m.score);
 if(m.type==='pause'){paused=!!m.paused;$('pause').textContent=paused?'계속하기':'일시정지'}
 if(m.type==='disconnect'){stop();$('net-status').textContent='연결이 끊겼습니다. 온라인 메뉴에서 다시 연결해 주세요.';toast('온라인 연결이 끊겼습니다.');$('network').hidden=false}
}
function launchNet(chars,score=Number($('score').value)){$('score').value=String([10,15,20].includes(score)?score:15);chosen=chars;stage=0;mode=1;selectSide=1;netState=null;remoteBits=0;$('network').hidden=true;start()}
function newPeer(host){if(net){const old=net;net=null;old.close()}const peer=new PeerMatch(host,m=>{if(net===peer)netMessage(m)},s=>{if(net===peer)$('net-status').textContent=s});net=peer;$('net-start').disabled=true;return net}
async function netAction(fn){try{$('net-status').textContent='연결 정보 준비 중…';await fn()}catch(e){$('net-status').textContent=e.message;$('net-character').disabled=false}}
$('online').onclick=()=>{if(net){const old=net;net=null;old.close()}$('room-display').hidden=true;$('room-number').textContent='';$('net-status').textContent='연결 대기 중';stop();$('selection').hidden=true;$('arena').hidden=true;$('ending').hidden=true;$('network').hidden=false;const select=$('net-character');select.replaceChildren();select.disabled=false;for(const r of roster.filter(r=>unlocked(p,r.id))){const o=document.createElement('option');o.value=r.id;o.textContent=r.name;select.append(o)}};
$('net-host').onclick=()=>netAction(async()=>{const peer=newPeer(true);$('net-character').disabled=true;const code=await peer.connect();if(net!==peer)return;$('room-number').textContent=code;$('room-display').hidden=false;});
$('room-code').oninput=e=>{e.target.value=e.target.value.replace(/[^0-9]/g,'').slice(0,4)};
$('room-join-form').onsubmit=e=>{e.preventDefault();netAction(async()=>{const code=$('room-code').value;if(!/^\d{4}$/.test(code))throw Error('숫자 4자리를 입력해 주세요.');const peer=newPeer(false);$('net-character').disabled=true;await peer.connect(code);if(net!==peer)return;$('room-number').textContent=code;$('room-display').hidden=false;});};
$('net-start').onclick=()=>{if(net?.connected&&net.host&&!$('net-start').disabled){const chars=[$('net-character').value,remoteCharacter],score=Number($('score').value);net.send({type:'start',chars,score});launchNet(chars,score)}};
const localPause=$('pause').onclick;$('pause').onclick=()=>{localPause();if(net?.connected)net.send({type:'pause',paused})};
$('voice-toggle').onclick=()=>{voices.setEnabled(!voices.enabled);$('voice-toggle').textContent=voices.enabled?'음성 켜짐':'음성 꺼짐'};
$('stage-select').onchange=e=>{stage=Number(e.target.value);cards()};
$('export-save').onclick=()=>{const a=document.createElement('a');const u=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'}));a.href=u;a.download='chiivolley-progress.json';a.click();URL.revokeObjectURL(u)};
$('title-music').onclick=()=>play(1);document.addEventListener('pointerdown',()=>{if(document.body.classList.contains('title-open'))play(1)});document.addEventListener('keydown',()=>{if(document.body.classList.contains('title-open'))play(1)});$('title-start').onclick=enterGame;$('title-home').onclick=showTitle;core.init(0,1,15);drawGoals();showTitle();requestAnimationFrame(frame);



document.addEventListener('languagechange',()=>{if(!$('ending').hidden)drawEnding($('ending-art').getContext('2d'));});

// Keep the three game modes visually distinct from match actions and settings.
function updateModeNavigation(){for(const [id,value] of [['story',0],['versus',1],['online',2]]){const active=id==='online'?!$('network').hidden:($('network').hidden&&mode===value);$(id).classList.toggle('active',active);$(id).setAttribute('aria-pressed',String(active));}}
const menuObserver=new MutationObserver(updateModeNavigation);for(const id of ['selection','network','arena'])menuObserver.observe($(id),{attributes:true,attributeFilter:['hidden']});updateModeNavigation();
