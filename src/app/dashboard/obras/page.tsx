'use client';

import React, { useEffect, useState } from 'react';
import { ObrasTable } from '@/components/obras-table';
import type { User, Obra } from '@/lib/types';
import { AddObraDialog } from '@/components/add-obra-dialog';

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [pendingAddObra, setPendingAddObra] = useState<Omit<Obra, 'id' | 'created_at' | 'updated_at'> | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      try {
        // Usuario actual
        const userRes = await fetch('/api/users/current', { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (!userData.error) {
            setCurrentUser(userData);
            setCurrentUserRole((userData.category || '').toLowerCase());
          } else {
            console.error('Error en usuario actual:', userData.error);
          }
        }

        // Obras
        const obrasRes = await fetch('/api/obras', { headers, cache: 'no-store' });
        if (obrasRes.ok) {
          const obrasData = await obrasRes.json();
          const normalizedObras = Array.isArray(obrasData.obras)
            ? obrasData.obras.map((o: any) => ({
                ...o,
                updated_at: o.updated_at ?? null,
              }))
            : [];
          setObras(normalizedObras);
        } else {
          console.error('No se pudo obtener obras');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const filteredObras = obras
    .filter((obra) => {
      const term = searchTerm.toLowerCase();
      return (
        obra.obra.toLowerCase().includes(term) ||
        obra.email.toLowerCase().includes(term) ||
        obra.provincia.toLowerCase().includes(term) ||
        obra.localidad.toLowerCase().includes(term) ||
        obra.contacto.toLowerCase().includes(term) ||
        obra.observaciones.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => a.obra.localeCompare(b.obra));

  async function handleRemove(id: number) {
    try {
      const res = await fetch('/api/obras', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setObras((prev) => prev.filter((o) => o.id !== id));
      } else {
        console.error('Error al eliminar la obra');
      }
    } catch (error) {
      console.error('Error en handleRemove:', error);
    }
  }

  async function handleUpdateObra(updatedObra: Obra) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const obraToUpdate = {
      ...updatedObra,
      updated_at: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/obras', {
        method: 'PUT',
        headers,
        body: JSON.stringify(obraToUpdate),
      });
      if (res.ok) {
        const updated = await res.json();
        setObras((prev) => prev.map((o) => (o.id === updatedObra.id ? { ...o, ...updated } : o)));
      } else {
        console.error('Error actualizando obra');
      }
    } catch (error) {
      console.error('Error actualizando obra:', error);
    }
  }

  async function handleAddObra(newObraData: Omit<Obra, 'id' | 'created_at' | 'updated_at'>) {
    const duplicate = obras.find(
      (o) =>
        o.obra.trim().toLowerCase() === newObraData.obra.trim().toLowerCase() &&
        o.localidad.trim().toLowerCase() === newObraData.localidad.trim().toLowerCase()
    );

    if (duplicate) {
      setPendingAddObra(newObraData);
      setShowDuplicateDialog(true);
    } else {
      await addNewObra(newObraData);
    }
  }

  async function addNewObra(newObraData: Omit<Obra, 'id' | 'created_at' | 'updated_at'>) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const body = {
      ...newObraData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const res = await fetch('/api/obras', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const addedObra = await res.json();
      setObras((prev) => [...prev, addedObra]);
      setIsAddDialogOpen(false);
    } else {
      console.error('Error agregando obra');
    }
  }

  async function confirmAddDuplicate(overwrite: boolean) {
    if (!pendingAddObra) {
      setShowDuplicateDialog(false);
      return;
    }

    const duplicate = obras.find(
      (o) =>
        o.obra.trim().toLowerCase() === pendingAddObra.obra.trim().toLowerCase() &&
        o.localidad.trim().toLowerCase() === pendingAddObra.localidad.trim().toLowerCase()
    );

    if (!duplicate) {
      await addNewObra(pendingAddObra);
    } else if (overwrite) {
      await handleUpdateObra({ ...duplicate, ...pendingAddObra, updated_at: new Date().toISOString() });
    }

    setPendingAddObra(null);
    setShowDuplicateDialog(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Obras</h1>

      <div className="flex justify-between items-center mb-4 max-w-full">
        <input
          type="text"
          placeholder="Buscar obras..."
          className="p-2 border rounded w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <AddObraDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddObra}
          trigger={
            <button
              className="ml-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded whitespace-nowrap"
              aria-label="Agregar obra"
            >
              + Agregar obra
            </button>
          }
        />
      </div>

      <ObrasTable
        obras={filteredObras}
        currentUserRole={currentUserRole}
        currentUser={currentUser}
        onRemove={handleRemove}
        onUpdateObra={handleUpdateObra}
      />

      {showDuplicateDialog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Obra duplicada</h2>
            <p className="mb-4">
              Ya existe una obra con el mismo nombre y localidad. ¿Deseas sobrescribirla o cancelar?
            </p>
            <div className="flex justify-end space-x-4">
              <button className="btn-secondary" onClick={() => confirmAddDuplicate(false)}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={() => confirmAddDuplicate(true)}>
                Sobrescribir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
