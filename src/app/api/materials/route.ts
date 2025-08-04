// src/app/api/materials/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, addMaterial, updateMaterial } from '@db/managedb';

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

export async function PUT(request: NextRequest) {
  try {
    const { id, name, category, quantity, description, updatedBy, lastUpdated } = await request.json();

    if (!id || !updatedBy) {
      return NextResponse.json({ error: 'ID and updatedBy are required' }, { status: 400 });
    }

    const updatedMaterial = await updateMaterial({
      id,
      name,
      category,
      quantity,
      description,
      updatedBy,
      lastUpdated,
    });

    return NextResponse.json(updatedMaterial, { status: 200 });
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

