// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import client, { connectClient } from '@lib/db';

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();

    if (!bodyText) {
      return NextResponse.json({ error: 'Body vacío' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Faltan campos email o password' }, { status: 400 });
    }

    await connectClient();

    const result = await client.query(
      'SELECT * FROM users WHERE mail = $1 AND password = $2',
      [email, password]
    );

    console.log('🧪 Resultado de consulta:', result.rows);

    if (result.rowCount === 0) {
      console.log('❌ Usuario no encontrado');
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Login correcto', user: result.rows[0] });
  } catch (error) {
    console.error('❌ ERROR EN /api/login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
