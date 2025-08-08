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
import type { User } from "@/lib/types";

interface Props {
  user: User;
  onSave: (updated: User) => Promise<void>;
  onClose: () => void;
  open: boolean;
}

export function EditUserDialog({ user, onSave, onClose, open }: Props) {
  const [form, setForm] = React.useState({
    email: user.email || '',
    password: '', // No se rellena por seguridad
    category: user.category || '',
  });

  // Sincronizar estado cuando cambie el usuario
  React.useEffect(() => {
    setForm({
      email: user.email || '',
      password: '', // Siempre vacío al abrir
      category: user.category || '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  const updatedUser: Partial<User> = {
    id: user.id,
    email: form.email,
    category: form.category,
  };
  if (form.password.trim() !== '') {
    updatedUser.password = form.password;
  }
  await onSave(updatedUser as User);
  onClose();
};

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Correo electrónico</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Contraseña (dejar en blanco para no cambiar)</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label>Categoría</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
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
