import {getLanguage} from './i18n.js?v=0.54';
export function installCreatorCredits(){
 const apply=()=>document.querySelectorAll('[data-creator]').forEach(el=>{el.textContent=getLanguage()==='ko'?'2026 파워덕질':'2026 PowerOtaking';});
 document.addEventListener('languagechange',apply);apply();
}
