export function updateChargeMeter(el,charge,armed,side){
 if(!el.firstElementChild){el.innerHTML='<div class="charge-caption"><b>POWER</b><span class="charge-count"></span></div><div class="charge-track"><div class="charge-fill"></div><div class="charge-segments"></div></div><div class="charge-state"></div>';el.setAttribute('role','progressbar');el.setAttribute('aria-valuemin','0');el.setAttribute('aria-valuemax','10')}
 el.className='meter charge-meter'+(charge===10?' ready':'');el.style.setProperty('--charge',`${charge*10}%`);el.style.setProperty('--charge-color',side?'#f9a4a1':'#8ce1ff');el.setAttribute('aria-valuenow',String(charge));el.setAttribute('aria-label',`${side+1}P 초필살기 충전 ${charge}/10${charge===10?' 맥시멈':''}`);
 el.querySelector('.charge-count').textContent=`${charge} / 10`;el.querySelector('.charge-state').textContent=charge===10?'MAXIMUM · 상단 스파이크로 발동':'공을 튕겨 POWER 충전';
}
export function chargeTone(ctx,full=false){
 if(!ctx||ctx.state!=='running')return;
 const time=ctx.currentTime,notes=full?[523.25,659.25,783.99,1046.5]:[660,880];
 notes.forEach((hz,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),at=time+i*(full?.075:.035);o.type='triangle';o.frequency.setValueAtTime(hz,at);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(full?.055:.025,at+.008);g.gain.exponentialRampToValueAtTime(.001,at+(full?.28:.09));o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+(full?.3:.1))});
}
