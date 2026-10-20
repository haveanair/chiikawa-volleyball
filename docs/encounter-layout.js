// Canvas coordinates and HTML overlays share one visible actor region, including object-fit cropping.
export function portraitMetrics(id,entries){
 if(id==='duo'){const a=portraitMetrics('hitoha',entries),b=portraitMetrics('futaha',entries);return {bottom:20.4,height:Math.max(a.height,b.height)*.68}}
 if(id==='pajamas')return {bottom:30,height:Math.max(...['purple','green','pink','white'].map(c=>portraitMetrics('pajama-'+c,entries).height))*.3};
 const e=entries[id];if(!e)return {bottom:30,height:90};
 const b=e.kind==='static'?e.bounds:(e.selectionPortrait?e.selectionBounds:e.portraitBounds);
 const width=e.kind==='static'?(e.logicalWidth||55):(e.selectionPortrait?(e.selectionWidth||55):(e.portraitWidth||55));
 return {bottom:30,height:b?width*b.h/b.w:90};
}
export function placeEncounter({canvas,dialogue,header,fit},ids,entries){
 let sx=canvas.width/432,sy=canvas.height/304,ox=0,oy=0;
 if(fit==='cover'||fit==='contain'){sx=sy=(fit==='cover'?Math.max(sx,sy):Math.min(sx,sy));ox=(canvas.width-432*sx)/2;oy=(canvas.height-304*sy)/2}
 const top=(Math.max(canvas.top,header.bottom+6)-canvas.top-oy)/sy+4;
 const floor=Math.min(206,(Math.min(canvas.bottom,dialogue.top-10)-canvas.top-oy)/sy-4);
 const originals=ids.map(id=>id==='siren'?1.7:id==='boss'?1.55:1.45),metrics=ids.map(id=>portraitMetrics(id,entries));
 const scale=Math.max(.1,Math.min(1,(floor-top-8)/Math.max(...metrics.map((m,i)=>m.height*originals[i]))));
 return {floor,top,scale,actors:ids.map((id,i)=>({size:originals[i]*scale,y:floor-metrics[i].bottom*originals[i]*scale})),screen:{sx,sy,ox,oy}};
}
