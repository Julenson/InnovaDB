// src/app/api/materials/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAllMaterials, addMaterial, updateMaterial, deleteMaterial } from '@db/managedb';

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
    const {
      name,
      category,
      quantity,
      valor,
      factura,
      lastUpdated,
      updatedBy,
      description,
      lastDestiny,
    } = await request.json();

    if (!name || quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: 'Name and non-negative quantity are required' },
        { status: 400 }
      );
    }

    if (valor === undefined || valor < 0) {
      return NextResponse.json(
        { error: 'Valor (price) is required and must be non-negative' },
        { status: 400 }
      );
    }

    const newMaterial = await addMaterial(
      name,
      quantity,
      valor,
      factura || null,
      category || null,
      description || null,
      updatedBy || 'Desconocido',
      lastUpdated,
      lastDestiny || null
    );
    return NextResponse.json(newMaterial, { status: 201 });
  } catch (error) {
    console.error('Error añadiendo material:', error);
    return NextResponse.json({ error: 'Error adding material' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      name,
      category,
      quantity,
      valor,
      factura,
      description,
      updatedBy,
      lastUpdated,
      lastDestiny,
    } = await request.json();

    if (!id || !updatedBy) {
      return NextResponse.json(
        { error: 'ID and updatedBy are required' },
        { status: 400 }
      );
    }

    if (quantity !== undefined && quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    if (valor !== undefined && valor < 0) {
      return NextResponse.json(
        { error: 'Valor (price) cannot be negative' },
        { status: 400 }
      );
    }

    const updatedMaterial = await updateMaterial({
      id,
      name: name ?? null,
      category: category ?? null,
      quantity: quantity ?? null,
      valor: valor ?? null,
      factura: factura ?? null,
      description: description ?? null,
      updatedBy,
      lastUpdated,
      lastDestiny: lastDestiny ?? null,
    });

    return NextResponse.json(updatedMaterial, { status: 200 });
  } catch (error) {
    console.error('Error updating material:', error);
    return NextResponse.json({ error: 'Error updating material' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await deleteMaterial(Number(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar material:', error);
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
  }
}
