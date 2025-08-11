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
import { useUser } from "@/hooks/use-user";

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
    valor: material.valor ?? null,
    factura: material.factura || '',
    lastDestiny: material.lastDestiny || '',
  });

  const { user: currentUser, loading } = useUser();

  React.useEffect(() => {
    setForm({
      name: material.name || '',
      category: material.category || '',
      quantity: material.quantity,
      description: material.description || '',
      valor: material.valor ?? null,
      factura: material.factura || '',
      lastDestiny: material.lastDestiny || '',
    });
  }, [material]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'quantity' || name === 'valor') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    await onSave({
      id: material.id,
      updatedBy: currentUser?.email ?? 'unknown',
      lastUpdated: new Date().toISOString(),
      ...form,
    });
    onClose();
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
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Ud. Medición</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div>
            <Label>Cantidad</Label>
            <Input
              name="quantity"
              type="number"
              step="0.01"
              value={form.quantity}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <Label>Valor (€)</Label>
            <Input
              name="valor"
              type="number"
              step="0.01"
              value={form.valor ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Nº de factura</Label>
            <Input
              name="factura"
              value={form.factura}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Último Destino</Label>
            <Input
              name="lastDestiny"
              value={form.lastDestiny}
              onChange={handleChange}
            />
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
