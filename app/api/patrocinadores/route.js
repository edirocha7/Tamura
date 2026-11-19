import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdmin } from '../../../lib/auth';
import { saveSponsor, updateSponsor, removeSponsor } from '../../../lib/sponsors';
const isUrl = (u) => /^https?:\/\//i.test(u || '');
const clean = (b) => ({ name: String(b.name || '').trim().slice(0, 80), link: String(b.link || '').trim().slice(0, 300) });
const bad = (c) => !c.name || (c.link && !isUrl(c.link));
const no = () => NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
const inv = () => NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
export async function POST(req) {
  if (!isAdmin()) return no();
  const b = await req.json(); const c = clean(b);
  if (bad(c) || !isUrl(b.logo)) return inv();
  await saveSponsor({ id: crypto.randomUUID(), ...c, logo: b.logo, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
export async function PATCH(req) {
  if (!isAdmin()) return no();
  const b = await req.json(); const c = clean(b);
  if (!b.id || bad(c)) return inv();
  const ok = await updateSponsor(b.id, isUrl(b.logo) ? { ...c, logo: b.logo } : c);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Patrocinador não encontrado' }, { status: 404 });
}
export async function DELETE(req) {
  if (!isAdmin()) return no();
  await removeSponsor(new URL(req.url).searchParams.get('id') || '');
  return NextResponse.json({ ok: true });
}
