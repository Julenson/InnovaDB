// src/app/api/obras/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllObras, addObra, updateObra, deleteObra } from '@db/managedb';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const idStr = url.searchParams.get('id');

    if (idStr) {
      // Opcional: implementar get obra por id si quieres
      // Ahora devolvemos error para simplificar
      return NextResponse.json({ error: 'GET por id no implementado' }, { status: 400 });
    }

    const obras = await getAllObras();
    return NextResponse.json({ obras });
  } catch (error) {
    console.error('Error fetching obras:', error);
    return NextResponse.json({ error: 'Error fetching obras' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      obra,
      email,
      provincia,
      localidad,
      importe,
      contacto,
      observaciones,
      updatedBy,
      lastUpdated,
    } = await request.json();

    if (!obra || !email) {
      return NextResponse.json(
        { error: 'Campos "obra" y "email" son obligatorios' },
        { status: 400 }
      );
    }

    if (importe === undefined || importe < 0) {
      return NextResponse.json(
        { error: 'El campo "importe" es obligatorio y no puede ser negativo' },
        { status: 400 }
      );
    }

    const newObra = await addObra(
      obra,
      email,
      provincia || null,
      localidad || null,
      importe,
      contacto || null,
      observaciones || null,
      updatedBy || 'Desconocido',
      lastUpdated
    );

    return NextResponse.json({ obra: newObra }, { status: 201 });
  } catch (error) {
    console.error('Error adding obra:', error);
    return NextResponse.json({ error: 'Error adding obra' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      obra,
      email,
      provincia,
      localidad,
      importe,
      contacto,
      observaciones,
      updatedBy,
      lastUpdated,
    } = await request.json();

    if (!id || !updatedBy) {
      return NextResponse.json(
        { error: 'Los campos "id" y "updatedBy" son obligatorios' },
        { status: 400 }
      );
    }

    if (importe !== undefined && importe < 0) {
      return NextResponse.json(
        { error: 'El campo "importe" no puede ser negativo' },
        { status: 400 }
      );
    }

    const updated = await updateObra({
      id,
      obra: obra ?? null,
      email: email ?? null,
      provincia: provincia ?? null,
      localidad: localidad ?? null,
      importe: importe ?? null,
      contacto: contacto ?? null,
      observaciones: observaciones ?? null,
      updatedBy,
      lastUpdated,
    });

    return NextResponse.json({ obra: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating obra:', error);
    return NextResponse.json({ error: 'Error updating obra' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'El campo "id" es obligatorio' }, { status: 400 });
    }

    await deleteObra(Number(id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting obra:', error);
    return NextResponse.json({ error: 'Error deleting obra' }, { status: 500 });
  }
}
