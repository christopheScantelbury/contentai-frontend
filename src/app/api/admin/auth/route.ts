import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }));

  if (!password || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', password, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24h
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('admin_token', '', { maxAge: 0, path: '/' });
  return res;
}
