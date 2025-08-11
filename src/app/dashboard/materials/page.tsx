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
  const [searchTerm, setSearchTerm] = useState('');

  const [pendingAddMaterial, setPendingAddMaterial] = useState<
    Omit<Material, 'id' | 'lastUpdated'> | null
  >(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        const userRes = await fetch('/api/users', { headers });
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

  const filteredMaterials = materials
    .filter((material) => {
      const term = searchTerm.toLowerCase();
      return (
        material.name.toLowerCase().includes(term) ||
        material.category?.toLowerCase().includes(term) ||
        material.description?.toLowerCase().includes(term) ||
        material.updatedBy?.toLowerCase().includes(term) ||
        material.quantity.toString().includes(term) ||
        (material.valor !== undefined && material.valor !== null && material.valor.toString().includes(term)) ||
        (material.factura ?? '').toLowerCase().includes(term)
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  async function handleRemove(id: number) {
    try {
      const res = await fetch('/api/materials', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMaterials((prev) => prev.filter((m) => m.id !== id));
      } else {
        console.error('Error al eliminar el material');
      }
    } catch (error) {
      console.error('Error en handleRemove:', error);
    }
  }

  async function handleUpdateQuantity(
    id: number,
    change: number,
    updatedBy: string
  ): Promise<'ok' | 'zero' | 'error'> {
    const material = materials.find((m) => m.id === id);
    if (!material) return 'error';

    const newQuantity = material.quantity + change;
    if (newQuantity < 0) return 'error';

    const updatedMaterial = {
      id,
      quantity: newQuantity,
      updatedBy,
      lastUpdated: new Date().toISOString(),
      valor: material.valor,
      factura: material.factura,
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
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  quantity: updated.quantity,
                  updatedBy: updated.updatedBy,
                  lastUpdated: updated.lastUpdated,
                  valor: updated.valor,
                  factura: updated.factura,
                }
              : m
          )
        );

        if (updated.quantity === 0) return 'zero';
        return 'ok';
      } else {
        console.error('Error actualizando cantidad');
        return 'error';
      }
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
      return 'error';
    }
  }

  async function handleUpdateMaterial(material: Material): Promise<void> {
    console.log('Usuario al actualizar: ', currentUser);
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const updatedMaterial = {
      id: material.id,
      name: material.name,
      quantity: material.quantity,
      category: material.category,
      description: material.description,
      valor: material.valor,
      factura: material.factura,
      updatedBy: currentUser?.email || 'Desconocido',
      lastUpdated: new Date().toISOString(),
    };

    try {
      const res = await fetch(`/api/materials`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedMaterial),
      });
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
    const duplicate = materials.find(
      (m) =>
        m.name.trim().toLowerCase() === newMaterialData.name.trim().toLowerCase() &&
        (m.description ?? '').trim().toLowerCase() === (newMaterialData.description ?? '').trim().toLowerCase()
    );

    if (duplicate) {
      setPendingAddMaterial(newMaterialData);
      setShowDuplicateDialog(true);
    } else {
      await addNewMaterial(newMaterialData);
    }
  }

  async function addNewMaterial(newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) {
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

  async function confirmAddDuplicate(sumQuantity: boolean) {
    if (!pendingAddMaterial) {
      setShowDuplicateDialog(false);
      return;
    }

    const duplicate = materials.find(
      (m) =>
        m.name.trim().toLowerCase() === pendingAddMaterial.name.trim().toLowerCase() &&
        (m.description ?? '').trim().toLowerCase() === (pendingAddMaterial.description ?? '').trim().toLowerCase()
    );

    if (!duplicate) {
      await addNewMaterial(pendingAddMaterial);
    } else {
      if (sumQuantity) {
        const newQuantity = duplicate.quantity + pendingAddMaterial.quantity;
        await handleUpdateMaterial({
          ...duplicate,
          quantity: newQuantity,
          updatedBy: currentUser?.email || 'Desconocido',
          lastUpdated: new Date().toISOString(),
          valor: pendingAddMaterial.valor ?? duplicate.valor,
          factura: pendingAddMaterial.factura ?? duplicate.factura,
        });
        setIsAddDialogOpen(false);
      }
    }

    setPendingAddMaterial(null);
    setShowDuplicateDialog(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Inventario de materiales</h1>

      {/* Contenedor para buscador y botón */}
      <div className="flex justify-between items-center mb-4 max-w-full">
        <input
          type="text"
          placeholder="Buscar materiales..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <AddMaterialDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddMaterial}
          trigger={
            <button
              className="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded whitespace-nowrap"
              aria-label="Agregar material"
            >
              + Agregar material
            </button>
          }
        />
      </div>

      <MaterialsTable
        materials={filteredMaterials}
        currentUserRole={currentUserRole}
        currentUser={currentUser}
        onRemove={handleRemove}
        onUpdateQuantity={async (id, change) => {
          const result = await handleUpdateQuantity(id, change, currentUser?.email || 'Desconocido');
          return result;
        }}
        onUpdateMaterial={handleUpdateMaterial}
      />

      {showDuplicateDialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Material duplicado</h2>
            <p className="mb-4">
              Ya existe un material con el mismo nombre y descripción. ¿Quieres sumar la cantidad al material existente o cancelar?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="btn-secondary"
                onClick={() => confirmAddDuplicate(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-primary"
                onClick={() => confirmAddDuplicate(true)}
              >
                Sumar cantidad
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
