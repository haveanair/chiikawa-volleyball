export const pajamaIds=['pajama-purple','pajama-green','pajama-pink','pajama-white'];
export const pajamaNames=['보라','녹색','빨강','흰색'];
export const teamLabel=id=>['hitoha','futaha','duo'].includes(id)?'한잎이 · 두잎이':null;
export function configureTeams(core,ids,first=Math.floor(Math.random()*4)){
 ids.forEach((id,s)=>core.team(s,id==='pajamas'?1:['hitoha','futaha','duo'].includes(id)?2:0,id==='pajamas'?first:id==='futaha'?1:0));
}
export function activeMember(get,ids,side){return get(35,side)===1?pajamaIds[get(36,side)%4]:get(35,side)===2?(get(36,side)%2?'futaha':'hitoha'):ids[side];}
export function leafPartner(get,side){return get(36,side)%2?'hitoha':'futaha';}
