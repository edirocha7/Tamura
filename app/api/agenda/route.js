import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdmin } from '../../../lib/auth';
import { saveEvent, updateEvent, removeEvent } from '../../../lib/agenda';
const clean = (b) => ({ event: String(b.event || '').trim().slice(0, 100), stage: String(b.stage || '').trim().slice(0, 100), location: String(b.location || '').trim().slice(0, 160), date: String(b.date || ''), time: String(b.time || '') });
const bad = (c) => !c.event || !c.stage || !c.location || !/^\d{4}-\d{2}-\d{2}$/.test(c.date) || (c.time && !/^\d{2}:\d{2}$/.test(c.time));
const isUrl = (u) => /^https?:\/\//i.test(u || '');
const no = () => NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
const inv = () => NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
export async function POST(req) {
  if (!isAdmin()) return no();
  const b = await req.json(); const c = clean(b);
  if (bad(c) || !isUrl(b.banner)) return inv();
  await saveEvent({ id: crypto.randomUUID(), ...c, banner: b.banner, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
export async function PATCH(req) {
  if (!isAdmin()) return no();
  const b = await req.json(); const c = clean(b);
  if (!b.id || bad(c)) return inv();
  const ok = await updateEvent(b.id, isUrl(b.banner) ? { ...c, banner: b.banner } : c);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Etapa não encontrada' }, { status: 404 });
}
export async function DELETE(req) {
  if (!isAdmin()) return no();
  await removeEvent(new URL(req.url).searchParams.get('id') || '');
  return NextResponse.json({ ok: true });
}
