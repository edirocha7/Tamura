import { list, put, del } from '@vercel/blob';
// Cada etapa = um JSON em agenda/<id>-<timestamp>.json (o banner JPG fica no Blob também)
const read = (url) => fetch(url, { cache: 'no-store' }).then((r) => r.json());
export async function getEvents() {
  const { blobs } = await list({ prefix: 'agenda/' });
  const ev = await Promise.all(blobs.map((b) => read(b.url).catch(() => null)));
  return ev.filter(Boolean).sort((a, b) => (a.date + (a.time || '')).localeCompare(b.date + (b.time || '')));
}
export const saveEvent = (e) => put('agenda/' + e.id + '-' + Date.now() + '.json', JSON.stringify(e), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
export async function updateEvent(id, fields) {
  const { blobs } = await list({ prefix: 'agenda/' + id }); if (!blobs.length) return false;
  const old = await read(blobs[0].url);
  await saveEvent({ ...old, ...fields });
  await del(blobs.map((b) => b.url));
  if (fields.banner && old.banner && fields.banner !== old.banner) await del(old.banner).catch(() => {});
  return true;
}
export async function removeEvent(id) {
  const { blobs } = await list({ prefix: 'agenda/' + id }); if (!blobs.length) return;
  const old = await read(blobs[0].url).catch(() => null);
  if (old?.banner) await del(old.banner).catch(() => {});
  await del(blobs.map((b) => b.url));
}
