'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/header';
import type { Obra } from '@/lib/types';
import { ObrasTable } from '@/components/obras-table';

export default function ObrasPage() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchObras() {
      try {
        const res = await fetch('/api/obras');
        if (res.ok) {
          const json = await res.json();
          setObras(Array.isArray(json.obras) ? json.obras : []);
        } else {
          console.error('Error al obtener obras');
        }
      } catch (error) {
        console.error('Error fetching obras:', error);
      }
    }
    fetchObras();
  }, []);

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

  async function handleUpdateObra(updatedObra: Obra) {
    try {
      const res = await fetch('/api/obras', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedObra),
      });
      if (!res.ok) throw new Error('Error al actualizar obra');
      const json = await res.json();
      setObras((prev) => prev.map((obra) => (obra.id === json.obra.id ? json.obra : obra)));
    } catch (error) {
      console.error(error);
      alert('Error al actualizar obra');
    }
  }

  return (
    <>
      <Header />
      <main className="p-6">
        <h1 className="text-3xl font-bold mb-6">Gestión de Obras</h1>

        <div className="flex justify-between items-center mb-4 max-w-full">
          <input
            type="text"
            placeholder="Buscar obras..."
            className="p-2 border rounded w-full max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ObrasTable
          obras={obras}
          filter={searchTerm}
          onRemove={handleRemove}
          onUpdateObra={handleUpdateObra}
        />
      </main>
    </>
  );
}
