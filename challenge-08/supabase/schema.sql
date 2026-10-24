-- =========================================================
-- Challenge 08 - Ejecutar completo en Supabase → SQL Editor
-- =========================================================

-- 1. Tabla de tareas
create table if not exists tareas (
  id bigint generated always as identity primary key,
  titulo text not null,
  descripcion text,
  completada boolean default false,
  foto_url text,
  user_id uuid references auth.users default auth.uid(),
  created_at timestamptz default now()
);

-- 2. RLS: cada usuario solo ve y modifica sus propias tareas
alter table tareas enable row level security;

create policy "ver mis tareas" on tareas
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "crear mis tareas" on tareas
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "editar mis tareas" on tareas
  for update to authenticated using ((select auth.uid()) = user_id);
create policy "borrar mis tareas" on tareas
  for delete to authenticated using ((select auth.uid()) = user_id);

-- 3. Realtime en la tabla (lista en vivo)
alter publication supabase_realtime add table tareas;

-- 4. Bucket "avatars" público (las URLs públicas se pueden mostrar en <img>)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 5. Políticas del bucket: cada usuario solo escribe en su carpeta avatars/{uid}/...
create policy "subir a mi carpeta" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "reemplazar mis archivos" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "eliminar mis archivos" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "ver mis archivos" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
