// Match the Switch startup artwork and animation before game modules finish loading.
(()=>{
 const overlay=document.getElementById('boot-loading'),canvas=document.getElementById('boot-art'),status=document.getElementById('boot-status'),retry=document.getElementById('boot-retry');
 let language='ko';try{language=localStorage.getItem('chiivolley.language')==='en'?'en':'ko'}catch{}
 const getLanguage=()=>language;
 let bootDone=false,bootError=null,friends=null,logo=null,korean=false,progress=.04,frame=0;
 const started=performance.now();overlay.hidden=false;document.body.classList.add('boot-loading-active');
 const write=(...args)=>console.warn(...args);
 const labels={ko:['친구들과 배구할 준비 중이에요','친구들이 코트로 모이고 있어요'],en:['Getting everyone ready for the court','Getting everyone ready for the court']};
 function advance(value){if(bootDone||bootError)return;progress=Math.max(progress,Math.min(1,value));status.textContent=labels[language][progress<.4?0:1];}
 function failure(error){if(bootDone||bootError)return;bootError=String(error?.message||error||'Loading failed');status.textContent=language==='ko'?'게임을 불러오지 못했어요. 다시 시도해 주세요.':'Could not load the game. Please try again.';retry.textContent=language==='ko'?'다시 불러오기':'Reload';retry.hidden=false;retry.focus();console.error(error);}
 const load=src=>new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src});
 const artReady=Promise.all([load('assets/render-cache/loading-friends.png'),load('assets/original-style/'+(language==='en'?'title-logo-en-v10.png':'title-logo-v07.png'))]).then(([f,l])=>{friends=f;logo=l;advance(.12)});
 // Resource timing tracks completed game artwork requests, including cache hits.
 let observer;
 fetch('assets/original-style/characters/manifest.json').then(r=>r.ok?r.json():null).then(meta=>{
  if(!meta||bootDone)return;
  const base='assets/original-style/',files=new Set(Array.from({length:5},(_,i)=>base+'courts/stage-'+(i+1)+'.png'));
  for(const entry of Object.values(meta.characters)){for(const file of [entry.file,entry.portrait,entry.motion?.file,entry.kya,entry.selectionPortrait])if(file)files.add(base+'characters/'+file)}
  const paths=new Set([...files].map(file=>new URL(file,location.href).pathname)),loaded=new Set();
  function update(entries){for(const e of entries)if(e.initiatorType==='img'&&paths.has(new URL(e.name).pathname))loaded.add(new URL(e.name).pathname);advance(.15+.7*loaded.size/paths.size)}
  update(performance.getEntriesByType('resource'));observer=new PerformanceObserver(list=>update(list.getEntries()));observer.observe({type:'resource',buffered:true});if(bootDone)observer.disconnect();
 }).catch(()=>{});
 document.fonts.load('25px PocketKO').then(()=>{korean=true}).catch(()=>{});
 window.gameBoot={advance,failure,async complete(){await Promise.race([artReady,new Promise(r=>setTimeout(r,3000))]);if(bootError)return;advance(1);await new Promise(r=>setTimeout(r,Math.max(120,700-(performance.now()-started))));bootDone=true;observer?.disconnect();cancelAnimationFrame(frame);overlay.hidden=true;document.body.classList.remove('boot-loading-active');window.removeEventListener('error',onError,true);window.removeEventListener('unhandledrejection',onRejection);document.removeEventListener('keydown',guardKeys,true);}};
 function onError(e){if(e.error||e.target?.tagName==='SCRIPT')failure(e.error||'Script load failed')}
 function onRejection(e){failure(e.reason)}
 window.addEventListener('error',onError,true);window.addEventListener('unhandledrejection',onRejection);
 function guardKeys(e){if(e.ctrlKey||e.metaKey||e.altKey)return;if(bootError&&e.target===retry&&['Enter',' '].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation()}
 document.addEventListener('keydown',guardKeys,true);
 retry.onclick=()=>location.reload();advance(.04);frame=requestAnimationFrame(paint);
function pill(c,x,y,w,h,color){c.fillStyle=color;c.beginPath();c.moveTo(x+h/2,y);c.lineTo(x+w-h/2,y);c.quadraticCurveTo(x+w,y,x+w,y+h/2);c.quadraticCurveTo(x+w,y+h,x+w-h/2,y+h);c.lineTo(x+h/2,y+h);c.quadraticCurveTo(x,y+h,x,y+h/2);c.quadraticCurveTo(x,y,x+h/2,y);c.fill();}
function star(c,x,y,r,color){c.fillStyle=color;c.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4-Math.PI/2,d=i%2?r*.35:r;const px=x+Math.cos(a)*d,py=y+Math.sin(a)*d;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();c.fill();}
function fallback(c,x,y,kind){c.save();c.translate(x,y);c.fillStyle=kind===2?'#ffedac':'#fffdf5';c.strokeStyle='#796c63';c.lineWidth=4;
 for(const side of [-1,1]){c.beginPath();c.ellipse(side*35,-62,kind===2?13:19,kind===2?55:24,side*.15,0,Math.PI*2);c.fill();c.stroke();}
 c.beginPath();c.ellipse(0,0,75,67,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle='#574c48';for(const side of [-1,1]){c.beginPath();c.ellipse(side*25,-2,5,8,0,0,Math.PI*2);c.fill();c.fillStyle='#f3b3ad';c.beginPath();c.ellipse(side*48,18,12,6,0,0,Math.PI*2);c.fill();c.fillStyle='#574c48';}c.beginPath();c.moveTo(-8,15);c.quadraticCurveTo(0,25,8,15);c.stroke();c.restore();}
function paint(now=0){if(bootDone)return;try{
 const c=canvas.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight,portrait=h>w,dw=portrait?900:1280,dh=portrait?1000:720,s=Math.min(w/dw,h/dh);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr)}c.setTransform(dpr,0,0,dpr,0,0);c.fillStyle='#fff6e6';c.fillRect(0,0,w,h);c.translate((w-dw*s)/2,(h-dh*s)/2);c.scale(s,s);if(portrait)c.translate(-190,120);c.fillStyle='#fff6e6';c.fillRect(0,0,1280,720);c.fillStyle='#fbe4d9';c.beginPath();c.ellipse(640,740,850,205,0,0,Math.PI*2);c.fill();
 for(let i=0;i<12;i++)star(c,70+(i*103)%1170,90+(i*83)%390,9+i%3*4,i%2?'#f1d49b':'#e8b7bd');
 if(logo){const s=Math.min(650/logo.width,215/logo.height);c.drawImage(logo,640-logo.width*s/2,24,logo.width*s,logo.height*s);}else{c.font='46px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#779c8d';c.fillText('CHI · VOLLEY',640,145);}
 for(let i=0;i<3;i++){const x=380+i*260,bob=Math.sin(now/410+i*1.7)*5;c.fillStyle='#dfc9b94d';c.beginPath();c.ellipse(x,520,86,12,0,0,Math.PI*2);c.fill();if(friends)c.drawImage(friends,i*256,0,256,320,x-128,205+bob,256,320);else fallback(c,x,415+bob,i);}
 pill(c,421,574,438,20,'#e9d7c5');pill(c,425,578,Math.max(18,430*progress),12,'#eaa5ae');const bx=433+414*progress;c.fillStyle='#fffdf5';c.strokeStyle='#a7c7c2';c.lineWidth=2;c.beginPath();c.arc(bx,584,13,0,Math.PI*2);c.fill();c.stroke();c.beginPath();c.moveTo(bx-11,578);c.quadraticCurveTo(bx,589,bx+10,576);c.stroke();
 const ko=korean&&getLanguage()==='ko',message=bootError?(ko?'앗, 준비하다가 문제가 생겼어요':'Oops! Please try again'):ko?(progress<.4?'친구들과 배구할 준비 중이에요':'친구들이 코트로 모이고 있어요'):'Getting everyone ready for the court';c.font=`${portrait?34:25}px ${korean?'PocketKO':'system-ui'}`;c.textAlign='center';c.textBaseline='middle';c.fillStyle='#7f756b';c.fillText(message,640,638);
 if(bootError){c.font=`17px ${korean?'PocketKO':'system-ui'}`;c.fillText(ko?'아래 버튼을 눌러 다시 실행해 주세요':'Please reload the page to try again',640,677);}else for(let i=0;i<3;i++){c.fillStyle=['#b9d7cf','#eeb7be','#ecd18d'][i];c.beginPath();c.arc(620+i*20,682,4+(Math.sin(now/250-i)>.3?2:0),0,Math.PI*2);c.fill();}
}catch(error){write('DIAGNOSTIC_DRAW_FAILED '+String(error));}if(!bootDone)frame=requestAnimationFrame(paint);}

})();
