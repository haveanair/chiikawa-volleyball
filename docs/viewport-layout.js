// Keep desktop selection controls beside the artwork, without scaling the UI.
export function installViewportLayout(){
 const fine=matchMedia('(orientation:landscape)'),main=document.querySelector('#game-main'),panel=document.querySelector('#selection');
 const touch=matchMedia('(any-pointer:coarse)');
 const classify=()=>document.body.classList.toggle('touch-device',navigator.maxTouchPoints>0||touch.matches);
 touch.addEventListener('change',classify);classify();
 const sidebar=document.createElement('div');sidebar.className='selection-sidebar';
 const settings=document.createElement('div');settings.className='selection-settings-side';
 const settingsCopy=document.createElement('div');settingsCopy.className='selection-settings-copy';settings.append(settingsCopy);
 main.prepend(sidebar);panel.append(settings);
 const moves=[];
 function relocate(selector,target){
  const node=document.querySelector(selector),anchor=document.createComment('original '+selector);
  node.before(anchor);moves.push({node,anchor,target});
 }
 for(const selector of ['.game-header','#game-nav','#achievements','#controls-help','#live','#game-main>footer'])relocate(selector,sidebar);
 for(const selector of ['#stage-picker','#selection-note','.selection-keys'])relocate(selector,settingsCopy);
 relocate('.match-settings',settings);
 function arrange(){
  for(const {node,anchor,target} of moves){if(fine.matches)target.append(node);else anchor.after(node)}
  sidebar.hidden=!fine.matches;settings.hidden=!fine.matches;
  panel.style.zoom='';
 }
 fine.addEventListener('change',arrange);arrange();
 // Keep the sidebar triggers compact; read the full content in a centered modal.
 for(const id of ['achievements','controls-help']){
  const details=document.getElementById(id),summary=details.querySelector('summary');
  const dialog=document.createElement('dialog');dialog.className='info-dialog';dialog.id=id+'-dialog';
  const header=document.createElement('div');header.className='info-dialog-header';
  const title=document.createElement('h2');title.id=id+'-dialog-title';
  const close=document.createElement('button');close.type='button';close.textContent='닫기';
  const content=document.createElement('div');content.className='info-dialog-content';
  dialog.setAttribute('aria-labelledby',title.id);
  summary.setAttribute('aria-haspopup','dialog');summary.setAttribute('aria-controls',dialog.id);
  header.append(title,close);dialog.append(header,content);document.body.append(dialog);
  for(const node of [...details.childNodes])if(node!==summary)content.append(node);
  details.open=false;
  summary.onclick=event=>{event.preventDefault();title.textContent=summary.textContent;dialog.showModal()};
  close.onclick=()=>dialog.close();
  dialog.addEventListener('click',event=>{
   const rect=dialog.getBoundingClientRect();
   if(event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom))dialog.close();
  });
 }
 new MutationObserver(()=>{if(!document.querySelector('#arena').hidden)window.scrollTo(0,0)}).observe(document.querySelector('#arena'),{attributes:true,attributeFilter:['hidden']});
}
