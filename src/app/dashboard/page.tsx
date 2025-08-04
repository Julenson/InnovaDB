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
          console.log('[DEBUG] Usuario actual:', userData); // 👈
          setCurrentUser(userData);
          setCurrentUserRole(userData.role || '');
        }

        const matRes = await fetch('/api/materials', { headers, cache: 'no-store' }); // 🔥 evitar caché
        if (matRes.ok) {
          const matData = await matRes.json();
          console.log('[DEBUG] Materiales obtenidos:', matData.materials); // 👈
          setMaterials(Array.isArray(matData.materials) ? matData.materials : []);
        } else {
          console.error('[ERROR] No se pudo obtener materiales');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleAddMaterial(newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const body = {
      ...newMaterialData,
      updatedBy: currentUser?.email || 'Desconocido',
      lastUpdated: new Date().toISOString(),
    };

    console.log('[DEBUG] Enviando nuevo material:', body); // 👈

    const res = await fetch(`/api/materials`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const addedMaterial = await res.json();
      console.log('[DEBUG] Material agregado desde backend:', addedMaterial); // 👈
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
        onRemove={(id: number) => {
          throw new Error('Function not implemented.');
        }}
        onUpdateQuantity={(id: number, change: number) => {
          throw new Error('Function not implemented.');
        }}
        onUpdateMaterial={async (material: Material) => {
          throw new Error('Function not implemented.');
        }}
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
