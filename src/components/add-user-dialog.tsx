'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import type { User } from '@/lib/types';

interface AddUserDialogProps {
  trigger: React.ReactNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<User, 'id'>) => Promise<void> | void;
}

export function AddUserDialog({ trigger, open, onOpenChange, onAdd }: AddUserDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<User, 'id'>>();

  const onSubmit = async (data: Omit<User, 'id'>) => {
    await onAdd(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'El correo es obligatorio' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              autoFocus
            />
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-foreground">
              Categoría
            </label>
            <input
              id="category"
              {...register('category')}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            >
              Agregar
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
