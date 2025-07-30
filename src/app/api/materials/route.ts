// src/app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, addMaterial, updateMaterialQuantity, deleteMaterial } from '@db/managedb';

export async function GET() {
  try {
    const materials = await getAllMaterials();
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error en getAllMaterials:', error);
    return NextResponse.json({ error: 'Error fetching materials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, quantity, lastUpdated, updatedBy, description } = await request.json();

    if (!name || quantity === undefined) {
      return NextResponse.json({ error: 'Name and quantity are required' }, { status: 400 });
    }

    const newMaterial = await addMaterial(name, quantity, category, lastUpdated, updatedBy, description);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error añadiendo material:', error);
    return NextResponse.json({ error: 'Error adding material' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, quantity, lastUpdated, updatedBy, description } = await request.json();

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: 'ID and quantity are required' }, { status: 400 });
    }

    // Si quieres actualizar más campos, tu función updateMaterialQuantity debería soportarlo
    const updatedMaterial = await updateMaterialQuantity(id, quantity, lastUpdated, updatedBy, description);
    return NextResponse.json(updatedMaterial);
  } catch (error) {
    console.error('Error actualizando material:', error);
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

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
