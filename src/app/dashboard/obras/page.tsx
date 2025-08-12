'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import type { Obra } from '@/lib/types';
import { ObrasTable } from '@/components/obras-table';
import { AddObraDialog } from '@/components/add-obra-dialog';

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Fetch inicial
  useEffect(() => {
    async function fetchObras() {
      try {
        const res = await fetch('/api/obras');
        if (res.ok) {
          const json = await res.json();
          setObras(json.obras);
        } else {
          console.error('Error al obtener obras');
        }
      } catch (error) {
        console.error('Error fetching obras:', error);
      }
    }
    fetchObras();
  }, []);

  // Función eliminar obra
  async function handleRemove(id: number) {
    try {
      const res = await fetch('/api/obras', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Error al eliminar obra');
      setObras((prev) => prev.filter((obra) => obra.id !== id));
    } catch (error) {
      console.error(error);
      alert('Error eliminando obra');
    }
  }

  // Función actualizar obra
  async function handleUpdateObra(updatedObra: Obra) {
    try {
      const res = await fetch('/api/obras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedObra),
      });
      if (!res.ok) throw new Error('Error al actualizar obra');
      const json = await res.json();
      setObras((prev) =>
        prev.map((obra) => (obra.id === json.obra.id ? json.obra : obra))
      );
    } catch (error) {
      console.error(error);
      alert('Error al actualizar obra');
    }
  }

  // Función añadir obra
  async function handleAddObra(newObra: Omit<Obra, 'id'>) {
    try {
      const res = await fetch('/api/obras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObra),
      });
      if (!res.ok) throw new Error('Error al agregar obra');
      const json = await res.json();
      setObras((prev) => [...prev, json.obra]);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
      alert('Error al agregar obra');
    }
  }

  return (
    <>
      <Header />
      <main className="p-4 max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gestión de Obras</h1>
          <AddObraDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAdd={handleAddObra}
            trigger={
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              >
                Añadir Obra
              </button>
            }
          />
        </div>

        <ObrasTable obras={obras} onRemove={handleRemove} onUpdateObra={handleUpdateObra} />
      </main>
    </>
  );
}
