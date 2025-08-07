'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface SelectTablePageProps {
  userRole: string;
}

// Mapa roles → tablas a las que tienen acceso (ajusta aquí)
const accessMap: Record<string, string[]> = {
  admin: ['materials', 'users', 'obras'],
  owner: ['materials', 'users'],
  developer: ['materials'],
  employee: ['materials'],
  jefe_obra: ['obras'],
};

export default function SelectTablePage({ userRole }: SelectTablePageProps) {
  const router = useRouter();
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    // Obtener tablas permitidas para el rol
    const allowed = accessMap[userRole] || [];
    setTables(allowed);

    if (allowed.length === 1) {
      // Redirigir automáticamente si solo hay una tabla
      router.push(`/${allowed[0]}`);
    }
  }, [userRole, router]);

  if (tables.length <= 1) {
    // Mientras redirige o si no hay tablas, mostrar loader o nada
    return <div>Cargando...</div>;
  }

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Selecciona la tabla a gestionar</h1>
      <ul className="space-y-2">
        {tables.map((table) => (
          <li key={table}>
            <button
              onClick={() => router.push(`/${table}`)}
              className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {table.charAt(0).toUpperCase() + table.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
