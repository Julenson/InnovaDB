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
import type { Obra } from '@/lib/types';

interface AddObraDialogProps {
  trigger: React.ReactNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: Omit<Obra, 'id'>) => Promise<void> | void;
}

export function AddObraDialog({ trigger, open, onOpenChange, onAdd }: AddObraDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Obra, 'id'>>();

  const onSubmit = async (data: Omit<Obra, 'id'>) => {
    await onAdd(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar nueva obra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="obra" className="block text-sm font-medium leading-6 text-foreground">
              Obra
            </label>
            <input
              id="obra"
              {...register('obra', { required: 'El nombre de la obra es obligatorio' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              autoFocus
            />
            {errors.obra && <p className="mt-1 text-xs text-destructive">{errors.obra.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'El email es obligatorio' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="provincia" className="block text-sm font-medium leading-6 text-foreground">
              Provincia
            </label>
            <input
              id="provincia"
              {...register('provincia', { required: 'La provincia es obligatoria' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.provincia && <p className="mt-1 text-xs text-destructive">{errors.provincia.message}</p>}
          </div>

          <div>
            <label htmlFor="localidad" className="block text-sm font-medium leading-6 text-foreground">
              Localidad
            </label>
            <input
              id="localidad"
              {...register('localidad', { required: 'La localidad es obligatoria' })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.localidad && <p className="mt-1 text-xs text-destructive">{errors.localidad.message}</p>}
          </div>

          <div>
            <label htmlFor="importe" className="block text-sm font-medium leading-6 text-foreground">
              Importe (€)
            </label>
            <input
              id="importe"
              type="number"
              step="0.01"
              {...register('importe', {
                required: 'El importe es obligatorio',
                valueAsNumber: true,
                min: { value: 0, message: 'El importe no puede ser negativo' },
                validate: (value) => {
                  const decimals = value.toString().split('.')[1];
                  return !decimals || decimals.length <= 2 || 'Máximo 2 decimales permitidos';
                },
              })}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.importe && <p className="mt-1 text-xs text-destructive">{errors.importe.message}</p>}
          </div>

          <div>
            <label htmlFor="contacto" className="block text-sm font-medium leading-6 text-foreground">
              Contacto
            </label>
            <input
              id="contacto"
              {...register('contacto')}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.contacto && <p className="mt-1 text-xs text-destructive">{errors.contacto.message}</p>}
          </div>

          <div>
            <label htmlFor="observaciones" className="block text-sm font-medium leading-6 text-foreground">
              Observaciones
            </label>
            <textarea
              id="observaciones"
              {...register('observaciones')}
              className="mt-2 block w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
            />
            {errors.observaciones && <p className="mt-1 text-xs text-destructive">{errors.observaciones.message}</p>}
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
