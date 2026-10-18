const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json','Cache-Control':'no-store'};
const messages:Record<string,string>={INVALID_ACTION:'요청을 확인해 주세요.',INVALID_CODE:'숫자 4자리를 입력해 주세요.',ROOM_NOT_FOUND:'방을 찾을 수 없거나 만료되었습니다.',ROOM_FULL:'이미 두 명이 참가한 방입니다.',OWN_ROOM:'다른 기기에서 방 번호를 입력해 주세요.',INVALID_TOKEN:'방 참가 정보가 유효하지 않습니다.',RATE_LIMIT:'잠시 후 다시 시도해 주세요.',SERVER_BUSY:'서버가 혼잡합니다. 잠시 후 다시 시도해 주세요.'};
Deno.serve(async(req:Request)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers});
 if(req.method!=='POST')return new Response(JSON.stringify({error:'METHOD'}),{status:405,headers});
 try{
  const body=await req.text();if(body.length>1200)return new Response(JSON.stringify({error:'TOO_LARGE'}),{status:413,headers});
  const data=JSON.parse(body);if(!['create','join','leave'].includes(data.action)||!/^[-a-zA-Z0-9]{16,100}$/.test(data.clientId||''))throw Error('INVALID_ACTION');
  const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,url=Deno.env.get('SUPABASE_URL')!;
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0].trim()||data.clientId;
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(service+':chiivolley:'+ip)))).map(v=>v.toString(16).padStart(2,'0')).join('');
  const response=await fetch(url+'/rest/v1/rpc/chiivolley_room_api',{method:'POST',headers:{apikey:service,Authorization:'Bearer '+service,'Content-Type':'application/json'},body:JSON.stringify({p_action:data.action,p_client:data.clientId,p_code:data.code||null,p_token:data.token||null,p_rate_key:hash})});
  const result=await response.json();if(!response.ok){const key=Object.keys(messages).find(k=>String(result.message).includes(k))||'SERVER_BUSY';return new Response(JSON.stringify({error:key,message:messages[key]}),{status:key==='RATE_LIMIT'?429:400,headers});}
  return new Response(JSON.stringify(result),{headers});
 }catch(e){const key=e instanceof Error&&e.message in messages?e.message:'INVALID_ACTION';return new Response(JSON.stringify({error:key,message:messages[key]}),{status:400,headers});}
});
