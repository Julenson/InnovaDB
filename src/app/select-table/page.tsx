'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';

export default function SelectTablePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // espera a que cargue el usuario

    const userRole = user?.category?.toLowerCase() || '';
    if (!user || (userRole !== 'admin' && userRole !== 'developer')) {
      router.replace('/login'); // o la ruta que uses para login
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Selecciona una tabla para gestionar</h1>
      <div className="flex flex-col gap-4 max-w-xs">
        <Button onClick={() => router.push('/dashboard/users')}>Usuarios</Button>
        <Button onClick={() => router.push('/dashboard/materials')}>Materiales</Button>
        {/* Añade más botones si hay otras tablas */}
      </div>
    </div>
  );
}
