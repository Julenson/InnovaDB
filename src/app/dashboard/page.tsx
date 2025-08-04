'use client';

import React, { useEffect, useState } from 'react';
import { MaterialsTable } from '@/components/materials-table';
import type { User, Material } from '@/lib/types';
import { AddMaterialDialog } from '@/components/add-material-dialog';

export default function DashboardPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const userRes = await fetch('/api/user', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData);
          setCurrentUserRole((userData.category || '').toLowerCase());
        }

        const matRes = await fetch('/api/materials', { headers, cache: 'no-store' });
        if (matRes.ok) {
          const matData = await matRes.json();
          const normalizedMaterials = Array.isArray(matData.materials)
            ? matData.materials.map((m: any) => ({
                ...m,
                updatedBy: m.updatedby ?? m.updatedBy ?? null,
                lastUpdated: m.lastupdated ?? m.lastUpdated ?? null,
              }))
            : [];

          setMaterials(normalizedMaterials);
        } else {
          console.error('No se pudo obtener materiales');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleRemove(id: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/materials`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        console.error('Error eliminando material');
      }
    } catch (error) {
      console.error('Error eliminando material:', error);
    }
  }

  async function handleUpdateQuantity(id: number, change: number, updatedBy: string) {
    const material = materials.find((m) => m.id === id);
    if (!material) return;

    const newQuantity = material.quantity + change;
    if (newQuantity < 0) return;

    const updatedMaterial = {
      id,
      quantity: newQuantity,
      updatedBy,
      lastUpdated: new Date().toISOString(),
    };

    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`/api/materials`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedMaterial),
      });

      if (res.ok) {
        const updated = await res.json();
        setMaterials((prev) =>
          prev.map((m) => (m.id === id ? { ...m, quantity: updated.quantity, updatedBy: updated.updatedBy, lastUpdated: updated.lastUpdated } : m))
        );
      } else {
        console.error('Error actualizando cantidad');
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
    }
  }

  async function handleUpdateMaterial(material: Material): Promise<void> {
    console.log('Intentando actualizar material: ', material);
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const updatedMaterial = {
      id: material.id,
      quantity: material.quantity,
      description: material.description,
      updatedBy: currentUser?.email || 'Desconocido',
      lastUpdated: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/materials`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedMaterial),
      });
      console.log('Respuesta del servidor: ', res.status);
      if (res.ok) {
        const updated = await res.json();
        setMaterials((prev) =>
          prev.map((m) => (m.id === material.id ? { ...m, ...updated } : m))
        );
      } else {
        console.error('Error actualizando material');
      }
    } catch (error) {
      console.error('Error actualizando material:', error);
    }
  }

  async function handleAddMaterial(newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const body = {
      ...newMaterialData,
      updatedBy: currentUser?.email || 'Desconocido',
      lastUpdated: new Date().toISOString(),
    };

    const res = await fetch(`/api/materials`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const addedMaterial = await res.json();
      setMaterials((prev) => [...prev, addedMaterial]);
      setIsAddDialogOpen(false);
    } else {
      console.error('Error agregando material');
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materiales</h1>
        <button
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Agregar material
        </button>
      </div>

      <MaterialsTable
        materials={materials}
        currentUser={currentUser}
        currentUserRole={currentUserRole}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateMaterial={handleUpdateMaterial}
      />

      <AddMaterialDialog
        trigger={null}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddMaterial}
      />
    </div>
  );
}
