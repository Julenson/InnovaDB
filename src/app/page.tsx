'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/assets/logo.svg';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = (formData.get('email') as string).toLowerCase();
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error desconocido');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch {
      setError('Error en la conexión');
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-10">
        <div className="flex items-center text-primary-foreground">
          <div className="w-48 h-auto">
            <Logo className="w-full h-auto" aria-label="Logo Innova-Sport" />
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="mt-2 text-lg text-primary-foreground/80">
            Manejo de Inventario
          </p>
        </div>
        <p className="mt-auto text-sm text-primary-foreground/60">
          &copy; 2024 Innova-Sport. All Rights Reserved.
        </p>
      </div>

      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-primary">Bienvenido</h1>
            <p className="text-balance text-muted-foreground">
              Introduce tu email y tu contraseña para acceder a tu inventario.
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            {error && (
              <p className="text-destructive text-sm font-medium">{error}</p>
            )}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
