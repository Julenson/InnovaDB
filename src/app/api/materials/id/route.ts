// Este archivo maneja: /api/materials/[id]

import { NextRequest, NextResponse } from 'next/server';
import { updateMaterial, deleteMaterial } from '@db/managedb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { quantity, lastUpdated, updatedBy, description, name, category } = await request.json();
    const id = parseInt(params.id, 10);

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'ID and quantity are required' }, { status: 400 });
    }

    const updatedMaterial = await updateMaterial({
      id,
      name,
      category,
      quantity,
      updatedBy,
      lastUpdated,
      description,
    });

    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error('Error actualizando material:', error);
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteMaterial(id);
    return NextResponse.json({ message: 'Material deleted' });
  } catch (error) {
    console.error('Error eliminando material:', error);
    return NextResponse.json({ error: 'Error deleting material' }, { status: 500 });
  }
}
