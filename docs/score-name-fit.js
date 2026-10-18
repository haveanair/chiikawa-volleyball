// Keep the name row fixed; shrink text to its actual available width.
export function installScoreNameFit(){
 const names=[document.getElementById('name1'),document.getElementById('name2')],measure=document.createElement('canvas').getContext('2d');let pending=false;
 function fit(){pending=false;for(const el of names){const width=el.clientWidth;if(!width)continue;const style=getComputedStyle(el),max=Number.parseFloat(style.getPropertyValue('--name-font-max'))||26;measure.font=`${style.fontWeight} ${max}px ${style.fontFamily}`;const textWidth=measure.measureText(el.textContent).width;el.style.fontSize=`${Math.min(max,Math.floor(max*(width-2)/Math.max(1,textWidth)*10)/10)}px`;}}
 function schedule(){if(!pending){pending=true;requestAnimationFrame(fit)}}
 const resize=new ResizeObserver(schedule);for(const el of names)resize.observe(el);
 const changes=new MutationObserver(schedule);for(const el of names)changes.observe(el,{childList:true,characterData:true,subtree:true});
 document.fonts.ready.then(schedule);document.fonts.addEventListener('loadingdone',schedule);window.addEventListener('resize',schedule);schedule();
}
