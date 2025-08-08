// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import client, { connectClient } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_a_cambiar';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');

  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log('Usuario autenticado: ', payload);
    console.log('Consultando usuarios desde DB...');
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  // Si el usuario solo quiere info propia
  const onlyCurrent = request.nextUrl.searchParams.get('current');
  if (onlyCurrent === 'true') {
    return NextResponse.json(payload);
  }

  const role = (payload.category || '').trim().toLowerCase();
  if (!['admin', 'developer'].includes(role)) {
    return NextResponse.json({ error: 'No tienes permiso para ver usuarios' }, { status: 403 });
  }

  try {
    await connectClient();
    const result = await client.query('SELECT id, email, password, category FROM users ORDER BY id');
    console.log('Usuarios desde la DB:', result.rows);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error('Error al consultar usuarios:', err);
    return NextResponse.json({ error: 'Error consultando usuarios' }, { status: 500 });
  }
}
