-- AI-Adoption-Studio · Storage-Bucket "documents"
-- Privater Bucket für alle hochgeladenen Files (G&V, Personal, KPI, Prozess-Docs).
-- Pfad-Konvention: {company_id}/{document_id}/{filename}

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  52428800,  -- 50 MB pro Datei
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain'
  ]
)
on conflict (id) do nothing;

-- RLS: User darf nur in den Pfad seiner eigenen Companies hochladen + lesen.
create policy "documents_bucket_owner_select" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.companies where owner_id = auth.uid()
    )
  );

create policy "documents_bucket_owner_insert" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.companies where owner_id = auth.uid()
    )
  );

create policy "documents_bucket_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1]::uuid in (
      select id from public.companies where owner_id = auth.uid()
    )
  );
