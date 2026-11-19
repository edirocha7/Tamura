import { list, put, del } from '@vercel/blob';
// Cada patrocinador = um JSON em patrocinadores/<id>-<timestamp>.json (a logo fica no Blob também)
const read = (url) => fetch(url, { cache: 'no-store' }).then((r) => r.json());
export async function getSponsors() {
  const { blobs } = await list({ prefix: 'patrocinadores/' });
  const it = await Promise.all(blobs.map((b) => read(b.url).catch(() => null)));
  return it.filter(Boolean).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
export const saveSponsor = (s) => put('patrocinadores/' + s.id + '-' + Date.now() + '.json', JSON.stringify(s), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
export async function updateSponsor(id, fields) {
  const { blobs } = await list({ prefix: 'patrocinadores/' + id }); if (!blobs.length) return false;
  const old = await read(blobs[0].url);
  await saveSponsor({ ...old, ...fields });
  await del(blobs.map((b) => b.url));
  if (fields.logo && old.logo && fields.logo !== old.logo) await del(old.logo).catch(() => {});
  return true;
}
export async function removeSponsor(id) {
  const { blobs } = await list({ prefix: 'patrocinadores/' + id }); if (!blobs.length) return;
  const old = await read(blobs[0].url).catch(() => null);
  if (old?.logo) await del(old.logo).catch(() => {});
  await del(blobs.map((b) => b.url));
}
