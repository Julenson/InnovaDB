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
import type { Obra } from "@/lib/types";
import { useUser } from "@/hooks/use-user";

interface Props {
  obra: Obra;
  onSave: (updated: Obra) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

export function EditObraDialog({ obra, onSave, onClose, open }: Props) {
  const [form, setForm] = React.useState({
    obra: obra.obra || '',
    email: obra.email || '',
    provincia: obra.provincia || '',
    localidad: obra.localidad || '',
    importe: obra.importe ?? 0,
    contacto: obra.contacto || '',
    observaciones: obra.observaciones || '',
  });

  const { user: currentUser, loading } = useUser();

  React.useEffect(() => {
    setForm({
      obra: obra.obra || '',
      email: obra.email || '',
      provincia: obra.provincia || '',
      localidad: obra.localidad || '',
      importe: obra.importe ?? 0,
      contacto: obra.contacto || '',
      observaciones: obra.observaciones || '',
    });
  }, [obra]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (name === 'importe') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }

    setForm((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async () => {
    await onSave({
      id: obra.id,
      obra: form.obra,
      email: form.email,
      provincia: form.provincia,
      localidad: form.localidad,
      importe: form.importe,
      contacto: form.contacto,
      observaciones: form.observaciones,
      updated_at: new Date().toISOString(),
      created_at: obra.created_at, // mantenemos creada la fecha original
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Obra</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Obra</Label>
            <Input name="obra" value={form.obra} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Provincia</Label>
            <Input name="provincia" value={form.provincia} onChange={handleChange} />
          </div>
          <div>
            <Label>Localidad</Label>
            <Input name="localidad" value={form.localidad} onChange={handleChange} />
          </div>
          <div>
            <Label>Importe (€)</Label>
            <Input
              name="importe"
              type="number"
              step="0.01"
              value={form.importe ?? ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Contacto</Label>
            <Input name="contacto" value={form.contacto} onChange={handleChange} />
          </div>
          <div>
            <Label>Observaciones</Label>
            <Textarea name="observaciones" value={form.observaciones} onChange={handleChange} />
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
