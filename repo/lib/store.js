import { list, put, del } from '@vercel/blob';
// Cada conteúdo = um JSON em meta/<id>.json (o arquivo em si fica no Blob também)
export async function getItems() {
  const { blobs } = await list({ prefix: 'meta/' });
  const items = await Promise.all(blobs.map((b) => fetch(b.url, { cache: 'no-store' }).then((r) => r.json()).catch(() => null)));
  return items.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export const saveItem = (it) => put('meta/' + it.id + '.json', JSON.stringify(it), { access: 'public', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
export async function removeItem(id) {
  const it = (await getItems()).find((i) => i.id === id); if (!it) return;
  if (it.kind !== 'link') await del(it.url);
  const { blobs } = await list({ prefix: 'meta/' + id + '.json' });
  if (blobs.length) await del(blobs.map((b) => b.url));
}
