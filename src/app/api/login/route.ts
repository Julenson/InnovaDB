// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import client, { connectClient } from '@lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido en las variables de entorno');
}

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

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const user = result.rows[0];

    // Aquí usamos el "!" para asegurar a TS que JWT_SECRET no es undefined
    const token = jwt.sign(
      { id: user.id, email: user.email, category: user.category },
      JWT_SECRET!,
      { expiresIn: '8h' }
    );

    return NextResponse.json({
      message: 'Login correcto',
      user: {
        id: user.id,
        email: user.email,
        category: user.category,
        name: user.name || '',
      },
      token,
    });
  } catch (error) {
    console.error('❌ ERROR EN /api/login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
