import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Material } from "@/lib/types";

interface Props {
  material: Material;
  onSave: (updated: Material) => Promise<void>;
  trigger: React.ReactNode;
  onClose: () => void;
}

export function EditMaterialDialog({ material, onSave, trigger }: Props) {
  const [form, setForm] = React.useState({
    name: material.name || '',
    category: material.category || '',
    quantity: material.quantity,
    description: material.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value === '' ? null : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = () => {
    onSave({
      id: material.id,
      ...form,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Material</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input name="name" value={form.name ?? ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Categoría</Label>
            <Input name="category" value={form.category ?? ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Cantidad</Label>
            <Input name="quantity" type="number" value={form.quantity ?? ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea name="description" value={form.description ?? ''} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
