// /app/api/materials/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { updateMaterial, deleteMaterial } from '@db/managedb';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const { quantity, updatedBy, lastUpdated, description, name, category } = await request.json();

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'ID and quantity are required' }, { status: 400 });
    }

    const updated = await updateMaterial({
      id,
      quantity,
      updatedBy,
      lastUpdated,
      description,
      name,
      category,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error actualizando material:', error);
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await deleteMaterial(id);
    return NextResponse.json({ message: 'Material deleted' });
  } catch (error) {
    console.error('Error eliminando material:', error);
    return NextResponse.json({ error: 'Error deleting material' }, { status: 500 });
  }
}
