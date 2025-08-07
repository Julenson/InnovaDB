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

    const userRole = user?.category?.toLowerCase() || '';
    if (!user || (userRole !== 'admin' && userRole !== 'developer')) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow-lg flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Selecciona una tabla para gestionar</h1>
        <Button className="w-48" onClick={() => router.push('/dashboard/users')}>Usuarios</Button>
        <Button className="w-48" onClick={() => router.push('/dashboard/materials')}>Materiales</Button>
        {/* Agrega más botones si hay otras tablas */}
      </div>
    </div>
  );
}
