import {TEST_BUILD} from './build-config.mjs';
// Clear-based unlocks follow story progression; cumulative challenges precede the final boss.
export const roster=[
 ['chiikawa','치이카와','#fffdf7','#f5e9df'],['hachiware','하치와레','#d8e8f5','#e8f2f5'],['usagi','우사기','#ffe4a1','#fff3cf'],
 ['roach','곤충몬스터','#b9cb71','#f1f5db'],['momonga','모몽가','#d9e0f2','#edf0fa'],
 ['boss','데카츠요','#ead56e','#fff4cd'],['shisa','시사','#ecbf8c','#fff0da'],['rakko','랏코','#d2b49b','#ede5df'],
 ['pajamas','파자마파티즈','#c8b6eb','#eee6f9'],['duo','한잎이 · 두잎이','#b9d8c3','#edf5e9'],
 ['kurimanju','쿠리만쥬','#bb9873','#f2e8da'],['kani','카니','#f4a5bb','#fbe8ee'],['armor','포셰트 갑옷씨','#b6c5cb','#e7edef'],
 ['siren','세이렌','#b8b1de','#ece9fb']
].map(([id,name,color,wash])=>({id,name,color,wash}));
export const stages=[['하치와레의 집','곤충몬스터','roach',2],['숲속','데카츠요','boss',3],['마을','파자마파티즈','pajamas',1],['인어섬','한잎이 · 두잎이','duo',4],['세이렌의 동굴','세이렌','siren',5]];
export const fresh=()=>({version:1,upper:0,contacts:0,supers:0,wins:0,margins:[0,0,0,0,0],ending:false});
export const goals=[
 {id:'roach',name:'첫 코트의 새 친구',text:'1스테이지 클리어',value:p=>p.margins[0]>0?1:0,target:1},
 {id:'boss',name:'거대한 친구와 한 팀',text:'2스테이지 클리어',value:p=>p.margins[1]>0?1:0,target:1},
 {id:'momonga',name:'첫 승리의 기쁨',text:'1스테이지 7점 차 이상 승리',value:p=>p.margins[0],target:7},
 {id:'kurimanju',name:'위로, 한 번 더!',text:'상단 공튕기기 누적 50회',value:p=>p.upper,target:50},
 {id:'shisa',name:'숲속의 도전자',text:'2스테이지 7점 차 이상 승리',value:p=>p.margins[1],target:7},
 {id:'rakko',name:'달인의 실력',text:'2스테이지 10점 차 이상 승리',value:p=>p.margins[1],target:10},
 {id:'kani',name:'작지만 강한 한 방',text:'초필살기 누적 10회 발동',value:p=>p.supers,target:10},
 {id:'pajamas',name:'파자마 파티에 초대합니다',text:'3스테이지 7점 차 이상 승리',value:p=>p.margins[2],target:7},
 {id:'duo',name:'인어섬의 만남 · 한잎이와 두잎이',text:'4스테이지 7점 차 이상 승리',value:p=>p.margins[3],target:7},
 {id:'armor',name:'믿음직한 단골 선수',text:'스토리 경기 누적 10승',value:p=>p.wins,target:10},
 {id:'siren',name:'동굴에 울려 퍼진 노래',text:'5스테이지 7점 차 이상 승리 후 엔딩',value:p=>p.ending?p.margins[4]:0,target:7}
];
export function earned(p,id){if(id==='hitoha'||id==='futaha')id='duo';return ['chiikawa','hachiware','usagi'].includes(id)||goals.some(g=>g.id===id&&g.value(p)>=g.target)}
export function recordWin(p,stage,a,b){if(a>b){p.wins++;p.margins[stage]=Math.max(p.margins[stage],a-b)}}
export function loadProgress(storage){try{const v=JSON.parse(storage.getItem('chiivolley.progress.v1'));if(v?.version===1&&Array.isArray(v.margins)&&v.margins.length===5){const p=fresh();for(const k of ['upper','contacts','supers','wins'])p[k]=Math.max(0,Number(v[k])||0);p.margins=v.margins.map(n=>Math.max(0,Number(n)||0));p.ending=!!v.ending;return p}}catch{}return fresh()}



export function unlocked(p,id){return TEST_BUILD||earned(p,id)}
