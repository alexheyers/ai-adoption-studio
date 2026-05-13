-- Storage-Bucket "deliverables" für generierte Pitch-Decks, ROI-Excel und PDF-Reports.
-- Pfad-Konvention: {run_id}/{type}.{ext}
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'deliverables',
  'deliverables',
  false,
  20971520,  -- 20 MB
  array[
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

create policy "deliverables_bucket_owner_select" on storage.objects
  for select using (
    bucket_id = 'deliverables'
    and (storage.foldername(name))[1]::uuid in (
      select r.id from public.runs r
      join public.companies c on c.id = r.company_id
      where c.owner_id = auth.uid()
    )
  );
