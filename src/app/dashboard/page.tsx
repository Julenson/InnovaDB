// src/app/dashboard/page.tsx
import React, { useEffect, useState } from 'react';
import { MaterialsTable } from '@/components/materials-table';  // Importar con llaves y el nombre correcto
import { Button } from '@/components/ui/button';  // Importar Button también con llaves y con alias correcto
import type { User, Material } from '@lib/types'
export default function DashboardPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        // Obtener usuario actual
        const userRes = await fetch('/api/user', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUser(userData);
          setCurrentUserRole(userData.role || '');
        }

        // Obtener materiales
        const matRes = await fetch('/api/materials', { headers });
        if (matRes.ok) {
          const matData = await matRes.json();
          setMaterials(matData.materials);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  async function handleRemove(materialId: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/materials/${materialId}`, {
      method: 'DELETE',
      headers,
    });
    if (res.ok) {
      setMaterials((prev) => prev.filter((m) => m.id !== materialId));
    }
  }

  async function handleUpdateQuantity(materialId: number, change: number) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/materials/${materialId}/quantity`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ change }),
    });
    if (res.ok) {
      const updatedMaterial = await res.json();
      setMaterials((prev) =>
        prev.map((m) => (m.id === materialId ? updatedMaterial : m))
      );
    }
  }

  async function handleUpdateMaterial(updatedMaterial: Material) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`/api/materials/${updatedMaterial.id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updatedMaterial),
    });
    if (res.ok) {
      const mat = await res.json();
      setMaterials((prev) =>
        prev.map((m) => (m.id === mat.id ? mat : m))
      );
    }
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <MaterialsTable
        materials={materials}
        onRemove={handleRemove}
        onUpdateQuantity={handleUpdateQuantity}
        onUpdateMaterial={handleUpdateMaterial}
        currentUser={currentUser}
        currentUserRole={currentUserRole}
      />
      <Button variant="default">Agregar material</Button>
    </div>
  );
}
