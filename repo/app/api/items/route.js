import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { isAdmin } from '../../../lib/auth';
import { saveItem, removeItem } from '../../../lib/store';
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
