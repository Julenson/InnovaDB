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
import type { Material } from '@/lib/types';

interface AddMaterialDialogProps {
  trigger: React.ReactNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<Material, 'id' | 'lastUpdated'>) => Promise<void> | void;
}

export function AddMaterialDialog({ trigger, open, onOpenChange, onAdd }: AddMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Material, 'id' | 'lastUpdated'>>();

  const onSubmit = async (data: Omit<Material, 'id' | 'lastUpdated'>) => {
    await onAdd(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nuevo material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-foreground">
              Nombre
            </label>
            <input
              id="name"
              {...register('name', { required: 'El nombre es obligatorio' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium leading-6 text-foreground">
              Ud. Medición
            </label>
            <input
              id="category"
              {...register('category', { required: 'La categoría es obligatoria' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.category && (
              <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-foreground">
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              step="0.01"
              {...register('quantity', {
                required: 'La cantidad es obligatoria',
                valueAsNumber: true,
                min: { value: 0, message: 'Cantidad mínima 0' },
                validate: (value) => {
                  const decimals = value.toString().split('.')[1];
                  return !decimals || decimals.length <= 2 || 'Máximo 2 decimales permitidos';
                },
              })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.quantity && (
              <p className="mt-1 text-xs text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-foreground">
              Descripción
            </label>
            <input
              id="description"
              {...register('description')} /* ← aquí ya no es obligatorio */
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
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
