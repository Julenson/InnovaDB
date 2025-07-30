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
          setCurrentUserRole(userData.role || '');
        }

        const matRes = await fetch('/api/materials', { headers });
        if (matRes.ok) {
          const matData = await matRes.json();
          setMaterials(Array.isArray(matData.materials) ? matData.materials : []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleAddMaterial(newMaterial: Omit<Material, 'id' | 'lastUpdated'>) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/materials`, {
      method: 'POST',
      headers,
      body: JSON.stringify(newMaterial),
    });

    if (res.ok) {
      const addedMaterial = await res.json();
      setMaterials((prev) => [...prev, addedMaterial]);
      setIsAddDialogOpen(false);
    } else {
      console.error('Error agregando material');
    }
  }

  // Aquí puedes poner las funciones para eliminar y actualizar si quieres...

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Materiales</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Agregar material
        </button>
      </div>

      <MaterialsTable
        materials={materials}
        currentUser={currentUser}
        currentUserRole={currentUserRole} onRemove={function (id: number): void {
          throw new Error('Function not implemented.');
        } } onUpdateQuantity={function (id: number, change: number): void {
          throw new Error('Function not implemented.');
        } } onUpdateMaterial={function (material: Material): Promise<void> {
          throw new Error('Function not implemented.');
        } }        // Pasa otras props necesarias para editar, eliminar, etc.
      />

      <AddMaterialDialog
        trigger={null} // No usamos trigger porque abrimos el diálogo desde el botón arriba
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddMaterial}
      />
    </div>
  );
}
