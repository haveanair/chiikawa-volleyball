// The same server field is used locally, in demos, and in network snapshots.
export function serveCue(get,names){
 const phase=get(6);if(phase!==1&&phase!==2&&phase!==4)return null;
 const side=get(42)===1?1:0;
 return {side,name:names[side],heading:'다음 서브!',phase};
}
