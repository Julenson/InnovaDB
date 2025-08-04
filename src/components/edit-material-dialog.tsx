import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Material } from "@/lib/types";
import { useSession } from "next-auth/react";

interface Props {
  material: Material;
  onSave: (updated: Material) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

export function EditMaterialDialog({ material, onSave, onClose, open }: Props) {
  const [form, setForm] = React.useState({
    name: material.name || '',
    category: material.category || '',
    quantity: material.quantity,
    description: material.description || '',
  });

  const { data: session } = useSession();
  const currentUser = session?.user;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const parsedValue = name ==='quantity' ? parseInt(value, 10) || 0 : value;
    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    await onSave({
      id: material.id,
      updatedBy: currentUser?.email ?? 'unknown',
      lastUpdated: new Date().toISOString(),
      ...form,
    });
    onClose(); // cerrar después de guardar
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
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
