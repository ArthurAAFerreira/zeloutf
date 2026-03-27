begin;

create schema if not exists zeloutf;

grant usage on schema zeloutf to anon, authenticated, service_role;

do $$
begin
  if to_regclass('public.ocorrencias') is not null and to_regclass('zeloutf.ocorrencias') is null then
    execute 'alter table public.ocorrencias set schema zeloutf';
  end if;
end
$$;

create table if not exists zeloutf.ocorrencias (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone null default now(),
  device_id text null,
  ambiente text null,
  categoria text null,
  descricao text null,
  status text null default 'pendente'::text,
  foto_url text null,
  descricao_detalhada text null,
  tipo text null default 'Reclamação'::text,
  unidade text null,
  sede text null,
  bloco text null,
  local text null,
  categoria_grupo text null,
  problema text null,
  reforcos integer null default 0,
  resolvido_por text null,
  resolvido_em timestamp with time zone null,
  id_curto serial not null,
  identificacao_usuario text null,
  complemento_admin text null,
  foto_conclusao_url text null,
  ultimo_reforco_em timestamp with time zone null,
  atualizado_em timestamp with time zone null default now(),
  gerenciado_por text null,
  solicitacao_resolucao_por text null,
  comunidade_email text null,
  comunidade_descricao text null,
  comunidade_foto_url text null,
  comunidade_sugere_conclusao boolean null default false,
  constraint ocorrencias_pkey primary key (id)
);

do $$
begin
  if to_regclass('public.ocorrencias_id_curto_seq') is not null and to_regclass('zeloutf.ocorrencias_id_curto_seq') is null then
    execute 'alter sequence public.ocorrencias_id_curto_seq set schema zeloutf';
  end if;
end
$$;

alter table zeloutf.ocorrencias
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  alter column status set default 'pendente',
  alter column tipo set default 'Reclamação',
  alter column reforcos set default 0,
  alter column atualizado_em set default now();

do $$
begin
  if to_regclass('zeloutf.ocorrencias_id_curto_seq') is not null then
    execute 'alter table zeloutf.ocorrencias alter column id_curto set default nextval(''zeloutf.ocorrencias_id_curto_seq''::regclass)';
  end if;
end
$$;

update zeloutf.ocorrencias
set
  status = coalesce(nullif(trim(status), ''), 'pendente'),
  tipo = coalesce(nullif(trim(tipo), ''), 'Reclamação'),
  reforcos = coalesce(reforcos, 0),
  created_at = coalesce(created_at, now()),
  atualizado_em = coalesce(atualizado_em, now()),
  comunidade_sugere_conclusao = coalesce(comunidade_sugere_conclusao, false);

alter table zeloutf.ocorrencias
  alter column id set not null,
  alter column id_curto set not null,
  alter column created_at set not null,
  alter column atualizado_em set not null,
  alter column status set not null,
  alter column tipo set not null,
  alter column reforcos set not null,
  alter column comunidade_sugere_conclusao set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'ocorrencias_id_curto_key'
      and conrelid = 'zeloutf.ocorrencias'::regclass
  ) then
    alter table zeloutf.ocorrencias
      add constraint ocorrencias_id_curto_key unique (id_curto);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'ocorrencias_status_check'
      and conrelid = 'zeloutf.ocorrencias'::regclass
  ) then
    alter table zeloutf.ocorrencias
      add constraint ocorrencias_status_check
      check (status in ('pendente', 'em_verificacao', 'resolvido'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'ocorrencias_tipo_check'
      and conrelid = 'zeloutf.ocorrencias'::regclass
  ) then
    alter table zeloutf.ocorrencias
      add constraint ocorrencias_tipo_check
      check (tipo in ('Reclamação', 'Melhoria'));
  end if;
end
$$;

create or replace function zeloutf.update_modified_column()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists update_ocorrencias_modtime on zeloutf.ocorrencias;

create trigger update_ocorrencias_modtime
before update on zeloutf.ocorrencias
for each row
execute function zeloutf.update_modified_column();

create index if not exists idx_ocorrencias_status_created_at
  on zeloutf.ocorrencias (status, created_at desc);

create index if not exists idx_ocorrencias_filtro_abertos
  on zeloutf.ocorrencias (unidade, sede, bloco, local, categoria_grupo, status, reforcos desc);

create index if not exists idx_ocorrencias_filtro_resolvidos
  on zeloutf.ocorrencias (unidade, sede, bloco, local, categoria_grupo, resolvido_em desc)
  where status = 'resolvido';

create index if not exists idx_ocorrencias_validacao_comunidade
  on zeloutf.ocorrencias (unidade, sede, bloco, created_at desc)
  where comunidade_sugere_conclusao = true and status <> 'resolvido';

create or replace view zeloutf.vw_ocorrencias_feed as
select
  o.id,
  o.id_curto,
  o.created_at,
  o.atualizado_em,
  o.status,
  case
    when o.status = 'pendente' then 'Aberto'
    when o.status = 'em_verificacao' then 'Em Verificação'
    when o.status = 'resolvido' then 'Resolvido'
    else o.status
  end as status_label,
  o.tipo,
  o.unidade,
  o.sede,
  o.bloco,
  o.local,
  o.ambiente,
  coalesce(nullif(trim(o.ambiente), ''), o.local) as local_exato,
  o.categoria,
  o.categoria_grupo,
  coalesce(nullif(trim(o.categoria_grupo), ''), o.categoria) as categoria_exibicao,
  o.problema,
  o.descricao,
  o.descricao_detalhada,
  o.identificacao_usuario,
  o.device_id,
  o.foto_url,
  o.foto_conclusao_url,
  o.reforcos,
  o.ultimo_reforco_em,
  o.complemento_admin,
  o.gerenciado_por,
  o.resolvido_por,
  o.resolvido_em,
  o.comunidade_sugere_conclusao,
  o.comunidade_email,
  o.comunidade_descricao,
  o.comunidade_foto_url,
  o.solicitacao_resolucao_por
from zeloutf.ocorrencias o;

grant select on zeloutf.vw_ocorrencias_feed to anon, authenticated, service_role;

grant select, insert, update on zeloutf.ocorrencias to anon, authenticated, service_role;
grant usage, select on all sequences in schema zeloutf to anon, authenticated, service_role;

drop view if exists public.ocorrencias;
create view public.ocorrencias as
select * from zeloutf.ocorrencias;

grant select, insert, update on public.ocorrencias to anon, authenticated, service_role;

commit;

