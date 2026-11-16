import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdmin } from '../../../lib/auth';
import { saveItem, removeItem, renameItem } from '../../../lib/store';
export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { title, kind, url } = await req.json();
  if (!title?.trim() || !['pdf', 'jpg', 'html', 'link'].includes(kind) || !/^https?:\/\//i.test(url || '')) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  await saveItem({ id: crypto.randomUUID(), title: title.trim().slice(0, 120), kind, url, createdAt: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
export async function DELETE(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  await removeItem(new URL(req.url).searchParams.get('id') || '');
  return NextResponse.json({ ok: true });
}
export async function PATCH(req) {
  if (!isAdmin()) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const { id, title } = await req.json();
  if (!id || !title?.trim()) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  const ok = await renameItem(id, title.trim().slice(0, 120));
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: 'Conteúdo não encontrado' }, { status: 404 });
}
