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

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const role = (payload.category || '').trim().toLowerCase();
  if (!['admin', 'developer'].includes(role)) {
    return NextResponse.json({ error: 'No tienes permiso para crear usuarios' }, { status: 403 });
  }

  const { email, password, category } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    await connectClient();
    await client.query('INSERT INTO users (email, password, category) VALUES ($1, $2, $3)', [email, password, category]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error al crear usuario:', err);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const role = (payload.category || '').trim().toLowerCase();
  if (!['admin', 'developer'].includes(role)) {
    return NextResponse.json({ error: 'No tienes permiso para editar usuarios' }, { status: 403 });
  }

  const { id, email, password, category } = await request.json();
  if (!id || !email || !password) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    await connectClient();
    await client.query('UPDATE users SET email = $1, password = $2, category = $3 WHERE id = $4', [email, password, category, id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  const role = (payload.category || '').trim().toLowerCase();
  if (!['admin', 'developer'].includes(role)) {
    return NextResponse.json({ error: 'No tienes permiso para eliminar usuarios' }, { status: 403 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
  }

  try {
    await connectClient();
    await client.query('DELETE FROM users WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
