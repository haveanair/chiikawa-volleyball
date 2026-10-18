create table if not exists public.chiivolley_rooms (
 code text primary key check(code ~ '^[0-9]{4}$'), channel uuid not null default gen_random_uuid(),
 host_token uuid not null default gen_random_uuid(), guest_token uuid,
 creator text not null, created_at timestamptz not null default now(), expires_at timestamptz not null default(now()+interval '45 minutes')
);
create table if not exists public.chiivolley_rate (key text primary key, hits int not null default 1, window_start timestamptz not null default now());
alter table public.chiivolley_rooms enable row level security;
alter table public.chiivolley_rate enable row level security;
revoke all on public.chiivolley_rooms,public.chiivolley_rate from anon,authenticated;
grant all on public.chiivolley_rooms,public.chiivolley_rate to service_role;
create or replace function public.chiivolley_room_api(p_action text,p_client text,p_code text default null,p_token uuid default null,p_rate_key text default '') returns jsonb
language plpgsql security invoker set search_path='' as $$
declare r public.chiivolley_rooms; n int; c text; tries int; bucket text;
begin
 if p_action not in ('create','join','leave') then raise exception 'INVALID_ACTION'; end if;
 if p_client is null or length(p_client)>100 then raise exception 'INVALID_CLIENT';end if;
 if p_action in ('create','join') then
  bucket:=p_action||':'||p_rate_key;
  insert into public.chiivolley_rate(key) values(bucket) on conflict(key) do update set hits=case when public.chiivolley_rate.window_start<now()-interval '1 minute' then 1 else public.chiivolley_rate.hits+1 end,window_start=case when public.chiivolley_rate.window_start<now()-interval '1 minute' then now() else public.chiivolley_rate.window_start end returning hits into n;
  if n>(case when p_action='create' then 6 else 30 end) then raise exception 'RATE_LIMIT';end if;
 end if;
 if p_action='create' then
  delete from public.chiivolley_rooms where expires_at<now();
  delete from public.chiivolley_rate where window_start<now()-interval '1 hour';
  if (select count(*) from public.chiivolley_rooms)>=100 then raise exception 'SERVER_BUSY';end if;
  delete from public.chiivolley_rooms where creator=p_client;
  for tries in 1..30 loop
   c:=lpad(floor(random()*10000)::int::text,4,'0');
   insert into public.chiivolley_rooms(code,creator) values(c,p_client) on conflict do nothing returning * into r;
   if found then return jsonb_build_object('code',r.code,'channel',r.channel,'token',r.host_token,'role','host','expiresAt',r.expires_at);end if;
  end loop;
  raise exception 'SERVER_BUSY';
 end if;
 if p_code is null or p_code !~ '^[0-9]{4}$' then raise exception 'INVALID_CODE';end if;
 select * into r from public.chiivolley_rooms where code=p_code and expires_at>now() for update;
 if not found then raise exception 'ROOM_NOT_FOUND';end if;
 if p_action='join' then
  if r.guest_token is not null then raise exception 'ROOM_FULL';end if;
  if r.creator=p_client then raise exception 'OWN_ROOM';end if;
  update public.chiivolley_rooms set guest_token=gen_random_uuid() where code=p_code returning * into r;
  return jsonb_build_object('code',r.code,'channel',r.channel,'token',r.guest_token,'role','guest','expiresAt',r.expires_at);
 end if;
 if p_token is null or (p_token<>r.host_token and p_token is distinct from r.guest_token) then raise exception 'INVALID_TOKEN';end if;
 delete from public.chiivolley_rooms where code=p_code;
 return jsonb_build_object('closed',true);
end; $$;
revoke all on function public.chiivolley_room_api(text,text,text,uuid,text) from public,anon,authenticated;
grant execute on function public.chiivolley_room_api(text,text,text,uuid,text) to service_role;
