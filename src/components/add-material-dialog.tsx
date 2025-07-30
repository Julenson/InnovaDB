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
import { Button } from '@/components/ui/button'; // Asumo que este es tu botón estilizado

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Nombre
            </label>
            <input
              id="name"
              {...register('name', { required: 'El nombre es obligatorio' })}
              className="input"
              autoFocus
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block font-medium mb-1">
              Categoría
            </label>
            <input
              id="category"
              {...register('category', { required: 'La categoría es obligatoria' })}
              className="input"
            />
            {errors.category && (
              <p className="text-red-600 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block font-medium mb-1">
              Cantidad
            </label>
            <input
              id="quantity"
              type="number"
              {...register('quantity', {
                required: 'La cantidad es obligatoria',
                valueAsNumber: true,
                min: { value: 0, message: 'Cantidad mínima 0' },
              })}
              className="input"
            />
            {errors.quantity && (
              <p className="text-red-600 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Descripción
            </label>
            <input
              id="description"
              {...register('description', { required: 'La descripción es obligatoria' })}
              className="input"
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancelar
            </button>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
