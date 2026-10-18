const states=new WeakMap();
export function attackExpression(get,side,id){
 let sides=states.get(get);if(!sides){sides=[{},{}];states.set(get,sides)}
 const state=sides[side],tick=get(32),serial=get(24,side);
 if(state.lastTick>tick||state.id!==id){state.serial=undefined;state.start=-1000}
 if(state.serial!==serial){state.serial=serial;state.start=get(25,side)===2&&serial>0?tick:-1000}
 state.lastTick=tick;state.id=id;
 return id==='kurimanju'&&tick-state.start<42?'kya':undefined;
}
