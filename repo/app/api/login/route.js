import { NextResponse } from 'next/server';
import { checkPw, makeToken } from '../../../lib/auth';
export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!checkPw(password)) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set('adm', makeToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 604800 });
  return res;
}
export async function DELETE() { const res = NextResponse.json({ ok: true }); res.cookies.delete('adm'); return res; }
