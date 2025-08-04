// Este archivo maneja: /api/materials

import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, addMaterial } from '@db/managedb';

export async function GET() {
  try {
    const materials = await getAllMaterials();
    return NextResponse.json({ materials });
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

    const newMaterial = await addMaterial(name, quantity, category, description, updatedBy, lastUpdated);
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error añadiendo material:', error);
    return NextResponse.json({ error: 'Error adding material' }, { status: 500 });
  }
}
