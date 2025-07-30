'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import type { Material } from '@/lib/types';

interface AddMaterialDialogProps {
  trigger: React.ReactNode;
  onAdd: (data: Omit<Material, 'id' | 'lastUpdated'>) => Promise<void> | void;
}

export function AddMaterialDialog({ trigger, onAdd }: AddMaterialDialogProps) {
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Material, 'id' | 'lastUpdated'>>();

  const onSubmit = async (data: Omit<Material, 'id' | 'lastUpdated'>) => {
    await onAdd(data);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nuevo material</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              {...register('name', { required: 'El nombre es obligatorio' })}
              autoFocus
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              {...register('description', { required: 'La descripción es obligatoria' })}
            />
            {errors.description && (
              <p className="text-red-600 text-sm">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="quantity">Cantidad</Label>
            <Input
              id="quantity"
              type="number"
              {...register('quantity', {
                required: 'La cantidad es obligatoria',
                valueAsNumber: true,
                min: { value: 0, message: 'Cantidad mínima 0' },
              })}
            />
            {errors.quantity && (
              <p className="text-red-600 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
