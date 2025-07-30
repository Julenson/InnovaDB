'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Material } from '@/lib/types';

const newMaterialSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  quantity: z.coerce.number().min(0, 'Quantity cannot be negative.'),
  category: z.string().min(2, 'Category is required.'),
  description: z.string().optional().or(z.literal('')), // descripción opcional
});

type NewMaterialForm = z.infer<typeof newMaterialSchema>;

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMaterial: (data: Omit<Material, 'id' | 'lastUpdated'>) => void;
}

export function AddMaterialDialog({ open, onOpenChange, onAddMaterial }: AddMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewMaterialForm>({
    resolver: zodResolver(newMaterialSchema),
  });

  const onSubmit: SubmitHandler<NewMaterialForm> = data => {
    onAddMaterial(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Añadir Material
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Material</DialogTitle>
            <DialogDescription>
              Rellena la información para añadir un nuevo material.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3">
                <Input id="name" {...register('name')} />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Cantidad
              </Label>
              <div className="col-span-3">
                <Input id="quantity" type="number" {...register('quantity')} />
                {errors.quantity && <p className="text-xs text-destructive mt-1">{errors.quantity.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <div className="col-span-3">
                <Input id="category" {...register('category')} />
                {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <div className="col-span-3">
                <Input id="description" {...register('description')} />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar Material</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
