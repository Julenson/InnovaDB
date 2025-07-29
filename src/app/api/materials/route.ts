// src/app/api/materials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, addMaterial, updateMaterialQuantity, deleteMaterial } from '@db/managedb';

export async function GET() {
  try {
    const materials = await getAllMaterials();
    return NextResponse.json(materials);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching materials' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, category, quantity } = await request.json();
    const newMaterial = await addMaterial(name, quantity,category );
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error adding material' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, quantity } = await request.json();
    const updatedMaterial = await updateMaterialQuantity(id, quantity);
    return NextResponse.json(updatedMaterial);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await deleteMaterial(id);
    return NextResponse.json({ message: 'Material deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting material' }, { status: 500 });
  }
}
