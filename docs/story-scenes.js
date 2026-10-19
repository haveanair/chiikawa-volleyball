// Brief summaries of verified original scenes. Evidence: story-sources.md.
export const storyScenes=[
 {place:['하치와레의 집','Hachiware’s Home'],focus:['hachiware','hachiware'],lines:[['하치와레는 동굴에서 살고 있어요. 집에는 기타와 꽃병, 골판지로 만든 탁자가 있어요.','Hachiware lives in a cave, with a guitar, a vase, and a cardboard table.'],['하치와레가 기타를 치며 부르는 노래는 「혼잣말」. 소박한 집에 노랫소리가 울려요.','Hachiware plays the guitar and sings Hitorigotsu in this simple home.']]},
 {place:['숲속','The Forest'],focus:['boss','momonga'],lines:[['데카츠요는 모몽가를 뒤쫓으며 돌려달라는 말을 거듭 외쳐요.','Dekatsuyo chases Momonga, repeatedly demanding something back.'],['모몽가는 싫다며 달아나요. 데카츠요는 계속 돌려달라고 외쳐요.','Momonga refuses and runs away. Dekatsuyo keeps demanding it back.']]},
 {place:['마을','The Village'],focus:['pajamas','pajamas'],lines:[['초록·분홍·보라·하양 파자마를 입은 네 친구가 모여 파자마파티즈를 이루었어요.','Four friends in green, pink, purple, and white pajamas form the Pajama Parties.'],['처음 무대에는 관객이 없었지만, 네 친구는 함께 노래를 불렀어요.','There was no audience at their first performance, but the four sang together.']]},
 {place:['인어섬','Mermaid Island'],focus:['usagi','duo'],lines:[['우사기가 가져온 전단에는 특별한 섬으로의 초대가 적혀 있었어요. 치이카와와 하치와레도 섬 합숙에 가기로 해요.','Usagi brings a flyer inviting them to a special island. Chiikawa and Hachiware decide to join the island camp.'],['섬의 주민 한잎이와 두잎이. 두 친구는 언제나 함께 다녀요.','Hitoha and Futaba are island residents who are always together.']]},
 {place:['세이렌의 동굴','Siren’s Cave'],focus:['siren','siren'],lines:[['노래를 잘하는 세이렌은 인어들과 함께 다녀요. 어떤 이유로 섬 주민들을 습격하고 있어요.','Siren is a talented singer who travels with the mermaids and attacks the islanders for a reason.'],['섬 주민들이 세이렌에게 끌려간다는 이야기를 듣고, 치이카와 일행은 세이렌 토벌에 휘말려요.','Hearing that Siren is taking islanders away, Chiikawa and friends become involved in the hunt for Siren.']]}
];
export function installStoryDialog({stage,draw,onStart}){
 const dialog=document.createElement('dialog');dialog.id='story-dialog';dialog.className='story-dialog';dialog.setAttribute('aria-labelledby','story-heading');dialog.setAttribute('data-no-translate','');
 dialog.innerHTML='<p id="story-heading"></p><canvas width="320" height="300" aria-hidden="true"></canvas><p class="story-copy" aria-live="polite"></p><div class="story-actions"><button type="button" class="story-skip"></button><button type="button" class="primary story-next"></button></div>';
 document.body.append(dialog);let page=0;
 const english=()=>document.documentElement.lang==='en',next=dialog.querySelector('.story-next'),skip=dialog.querySelector('.story-skip');
 function render(){const scene=storyScenes[stage()],en=english()?1:0;dialog.querySelector('#story-heading').textContent=`${stage()+1} / 5 · ${scene.place[en]}`;dialog.querySelector('.story-copy').textContent=scene.lines[page][en];skip.textContent=en?'Skip':'스킵';next.textContent=page===scene.lines.length-1?(en?'Start Match':'경기 시작'):(en?'Continue':'계속');draw(dialog.querySelector('canvas'),scene.focus[page]);}
 function finish(){if(!dialog.open)return;dialog.close();onStart()}
 next.onclick=()=>{if(++page>=storyScenes[stage()].lines.length)finish();else render()};skip.onclick=finish;dialog.addEventListener('cancel',e=>{e.preventDefault();finish()});
 document.addEventListener('languagechange',()=>{if(dialog.open)render()});
 return{show(){page=0;render();dialog.showModal();next.focus()}};
}
