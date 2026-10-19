import {translate} from './i18n.js?v=0.42';
import {actor,background} from './art.js?v=0.20';
import {roster,stages} from './progress.mjs?v=0.28';
// Original-style exchanges for this fan game, not purported canonical quotations.
const heroes={
 chiikawa:[['와…!','Wa…!'],['야앗!','Yaa!']],
 usagi:[['야하!','Yaha!'],['우라라라라!','Urararara!']],
 kurimanju:[['하아…','Haa…'],['하아…!','Haa…!']],
 hachiware:[['상대를 잘 보고… 하나씩 받아 보자!','Watch the opponent… and return one ball at a time!'],['어떻게든… 돼라!','We’ll… make it work!']],
 momonga:[['귀여운 내 모습을 잘 봐 두라고!','Take a good look at how cute I am!'],['내 귀여운 승리, 지켜보라고!','Watch my adorable victory!']],
 shisa:[['잘 부탁드려요! 끝까지 열심히 할게요!','Nice to meet you! I’ll give it my all!'],['네! 준비됐어요!','Yes! I’m ready!']],
 rakko:[['서두르지 않고, 공의 움직임을 보겠다.','I’ll watch the ball without rushing.'],['끝까지 집중하겠다. 간다.','Focus until the end. Here I go.']],
 kani:[['…! (조심스럽게 자세를 잡는다.)','…! (Carefully takes a stance.)'],['…! (두 발을 단단히 딛는다.)','…! (Plants both feet firmly.)']],
 armor:[['다치지 않게, 즐겁게 해 보자.','Let’s enjoy this and be careful.'],['준비됐니? 그럼 시작하자.','Ready? Then let’s begin.']],
 pajamas:[['♪ (네 친구가 함께 박자를 맞춘다.)','♪ (The four keep the beat together.)'],['…♪ (나란히 서서 준비한다.)','…♪ (They line up and get ready.)']],
 duo:[['…! (두 친구가 나란히 선다.)','…! (The pair stand side by side.)'],['…! (서로의 위치를 확인한다.)','…! (They check each other’s position.)']],
 roach:[['기익…!','Krr…!'],['기이이익!','Krrrr!']],
 boss:[['그르르…','Grr…'],['그르르르…!','Grrrr…!']],
 siren:[['노래가 들리는 쪽으로 온 거야?','Did you follow the sound of the song?'],['그럼… 끝까지 버텨 봐.','Then… try to hold out until the end.']]
};
const opponents=[
 [['기이익…! (몸을 낮추고 다가온다.)','Krrr…! (Lowers its body and approaches.)'],['기익! (발을 멈추고 마주 선다.)','Krr! (Stops and faces you.)']],
 [['그르르…! (커다란 그림자가 드리운다.)','Grrr…! (A huge shadow falls across the court.)'],['그르르! (천천히 앞으로 나선다.)','Grrr! (Slowly steps forward.)']],
 [['♪ (네 친구가 익숙한 박자를 맞춘다.)','♪ (The four keep a familiar beat.)'],['♪ (네 친구가 동시에 준비한다.)','♪ (The four ready themselves together.)']],
 [['…! (두 친구가 서로의 곁으로 다가선다.)','…! (The pair draw close to each other.)'],['…! (둘이 동시에 고개를 끄덕인다.)','…! (Both nod at once.)']],
 [['노래를 듣고도, 물러서지 않을 거야?','Even after hearing my song, you won’t back down?'],['어디… 얼마나 버틸 수 있을까?','Let’s see… how long can you hold out?']]
];
const variations={
 'chiikawa:0':['와…! (공을 꼭 쥐고 상대를 바라본다.)','Wa…! (Holds the ball tightly and looks at the opponent.)'],
 'chiikawa:1':['으…! (큰 그림자 앞에서 떨다가 다시 고개를 든다.)','Uu…! (Trembles before the shadow, then looks up again.)'],
 'chiikawa:2':['와아…♪ (익숙한 박자에 몸이 움직인다.)','Waa…♪ (Sways to the familiar beat.)'],
 'chiikawa:3':['아…? (두 친구를 번갈아 바라본다.)','Ah…? (Looks from one friend to the other.)'],
 'chiikawa:4':['우…! (물러서려다 두 발을 다시 딛는다.)','Uu…! (Starts to step back, then plants both feet.)'],
 'usagi:0':['야하! (공을 들고 성큼 나선다.)','Yaha! (Strides forward with the ball.)'],
 'usagi:1':['우라! (커다란 상대에게도 성큼 다가간다.)','Ura! (Strides toward even this huge opponent.)'],
 'usagi:2':['우라라♪ (자기만의 박자로 뛰어오른다.)','Urara♪ (Bounces to a beat of its own.)'],
 'usagi:3':['하아? (두 상대를 보더니 공을 높이 든다.)','Haa? (Looks at the pair, then raises the ball.)'],
 'usagi:4':['우라라라! (노랫소리에도 아랑곳하지 않는다.)','Urarara! (Unfazed by the song.)'],
 'hachiware:0':['집 앞에서 하는 첫 승부네. 잘 부탁해!','Our first match outside home. Let’s do our best!'],
 'hachiware:1':['크다…! 그래도 공을 잘 보면… 어떻게든 될 거야!','So big…! Watch the ball. We can make this work!'],
 'hachiware:2':['그 박자, 우리도 알고 있어! 같이 해 보자!','We know that beat! Let’s play together!'],
 'hachiware:3':['둘이 함께 움직이는구나. 빈 곳을 잘 봐야겠어.','You move together. I need to watch for an opening.'],
 'hachiware:4':['여기까지 왔어. 마지막 공까지 포기하지 않을게!','We made it this far. I won’t give up on the final ball!'],
 'momonga:1':['싫어! 싫다고! 공이나 받아 보라고!','No! I said no! Try returning the ball!'],
 'momonga:2':['내가 무대에 서면 더 인기 있을걸!','I’d be even more popular on that stage!'],
 'momonga:4':['큰 소리로 노래해도, 귀여운 건 나라고!','Sing as loudly as you like. I’m still the cute one!'],
 'rakko:1':['크기만으로 승부가 정해지지는 않는다.','Size alone does not decide a match.'],
 'rakko:3':['둘의 움직임을 읽으면 된다.','I must read how the pair moves.'],
 'shisa:1':['커… 커도, 끝까지 해 볼게요!','So… so big! But I’ll keep trying!'],
 'armor:2':['내가 만든 파자마, 잘 어울리는구나.','Those pajamas I made suit you well.'],
 'siren:2':['그 노래… 나도 들려줄까?','That song… shall I sing too?'],
 'duo:3':['…? (마주 선 두 쌍이 서로를 본다.)','…? (The two pairs face each other.)'],
 'pajamas:2':['♪ (양쪽에서 같은 박자가 울린다.)','♪ (The same beat sounds on both sides.)']
};
export function buildEncounter(hero,level){
 if(!heroes[hero]||!stages[level])throw Error('Unknown encounter');
 const reply=hero==='momonga'&&level===1?['돌려줘…! 돌려줘!','Give it back…! Give it back!']:opponents[level][0];
 return [{side:1,text:reply},{side:0,text:variations[`${hero}:${level}`]||heroes[hero][0]},{side:1,text:opponents[level][1]},{side:0,text:heroes[hero][1]}];
}
export function installStoryDialog({stage,hero,onStart}){
 const dialog=document.createElement('dialog');dialog.id='story-dialog';dialog.className='story-dialog';dialog.setAttribute('aria-labelledby','story-heading');dialog.setAttribute('data-no-translate','');
 dialog.innerHTML='<div class="story-stage"><canvas width="864" height="608" aria-hidden="true"></canvas><div class="story-top"><p id="story-heading"></p><span class="story-adaptation"></span></div><div class="story-dialogue"><b class="story-speaker"></b><p class="story-copy" aria-live="polite"></p><div class="story-actions"><button type="button" class="story-skip"></button><span class="story-page" aria-hidden="true"></span><button type="button" class="primary story-next"></button></div></div><div class="story-countdown" hidden aria-live="polite"></div></div>';
 document.body.append(dialog);const next=dialog.querySelector('.story-next'),skip=dialog.querySelector('.story-skip'),canvas=dialog.querySelector('canvas'),c=canvas.getContext('2d'),count=dialog.querySelector('.story-countdown');
 let page=0,script=[],selected,level,startTime=0,transitionAt=null,raf=0;
 const en=()=>document.documentElement.lang==='en';
 function render(){const entry=script[page];dialog.dataset.hero=selected;dialog.dataset.enemy=stages[level][2];dialog.dataset.speaker=String(entry.side);dialog.dataset.phase=transitionAt===null?'dialogue':'ready';dialog.querySelector('#story-heading').textContent=`${level+1} / 5 · ${en()?['Hachiware’s Home','The Forest','The Village','Mermaid Island','Siren’s Cave'][level]:stages[level][0]}`;dialog.querySelector('.story-adaptation').textContent=en()?'Game adaptation':'게임용 각색';const id=entry.side?stages[level][2]:selected;dialog.querySelector('.story-speaker').textContent=translate(roster.find(r=>r.id===id).name);dialog.querySelector('.story-copy').textContent=entry.text[en()?1:0];dialog.querySelector('.story-page').textContent=`${page+1} / ${script.length}`;skip.textContent=en()?'Skip':'스킵';next.textContent=page===script.length-1?(en()?'To the Court':'코트로'):(en()?'Continue':'계속');}
 function finish(){if(!dialog.open)return;cancelAnimationFrame(raf);dialog.close();count.hidden=true;next.disabled=false;onStart()}
 function draw(now){if(!dialog.open)return;const entrance=Math.min(1,(now-startTime)/650),speaker=script[page].side;c.setTransform(2,0,0,2,0,0);background(c,level);c.fillStyle='#14232920';c.fillRect(0,0,432,304);
  for(const [side,id] of [selected,stages[level][2]].entries()){const x=side?324+65*(1-entrance):108-65*(1-entrance),active=side===speaker,size=id==='siren'?1.7:id==='boss'?1.55:1.45;c.save();c.globalAlpha=transitionAt!==null||active?1:.68;c.fillStyle='#263b3925';c.beginPath();c.ellipse(x,206,35,5,0,0,7);c.fill();const bob=active?Math.sin(now/220)*1.4:0;actor(c,id,x,206-30*size+bob,size,transitionAt!==null?2:0,now/90,{portrait:true,selection:true,facing:side?-1:1});c.restore();}
  if(transitionAt!==null){const remaining=1400-(now-transitionAt);count.textContent=remaining>650?'READY?':en()?'LET’S PLAY!':'경기 시작!';if(remaining<=0){finish();return}}
  raf=requestAnimationFrame(draw);
 }
 function advance(){if(transitionAt!==null)return;if(page<script.length-1){page++;render()}else{transitionAt=performance.now();count.hidden=false;next.disabled=true;render()}}
 next.onclick=advance;skip.onclick=finish;dialog.querySelector('.story-copy').onclick=advance;dialog.addEventListener('cancel',e=>{e.preventDefault();finish()});
 dialog.addEventListener('keydown',e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();if(!e.repeat){if(e.target===skip)finish();else advance()}}});
 document.addEventListener('languagechange',()=>{if(dialog.open)render()});
 return{show(){selected=hero();level=stage();page=0;script=buildEncounter(selected,level);transitionAt=null;next.disabled=false;count.hidden=true;startTime=performance.now();render();dialog.showModal();next.focus();raf=requestAnimationFrame(draw)}};
}
