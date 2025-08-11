'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';

export default function SelectTablePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Si no hay usuario, redirige a login
    if (!user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  }

  // Normaliza rol
  const role = user?.category?.toLowerCase() || '';

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow-lg flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Selecciona una tabla para gestionar</h1>

        {/* Mostrar botón Usuarios SOLO para owner o developer */}
        {(role === 'owner' || role === 'developer') && (
          <Button className="w-48" onClick={() => router.push('/dashboard/users')}>
            Usuarios
          </Button>
        )}

        {/* Siempre mostramos materiales */}
        <Button className="w-48" onClick={() => router.push('/dashboard/materials')}>
          Materiales
        </Button>

        {/* Añadido botón para obras */}
        <Button className="w-48" onClick={() => router.push('/dashboard/obras')}>
          Obras
        </Button>
      </div>
    </div>
  );
}
