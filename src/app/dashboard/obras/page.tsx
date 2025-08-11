'use client';

import * as React from "react";
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AddObraDialog } from "@/components/add-obra-dialog"; 
import { EditObraDialog } from "@/components/edit-obra-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { Obra } from "@/lib/types";
import Header from "@/components/header";

export default function ObrasPage() {
  const [data, setData] = React.useState<Obra[]>([]);
  const [search, setSearch] = React.useState("");
  const [openAddObra, setOpenAddObra] = React.useState(false);
  const [editingObra, setEditingObra] = React.useState<Obra | null>(null);
  const [deletingObra, setDeletingObra] = React.useState<Obra | null>(null);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/obras")
      .then((res) => res.json())
      .then((data) => setData(data.obras))
      .catch((err) => console.error(err));
  }, []);

  const filteredData = data.filter((obra) => {
    const lowerSearch = search.toLowerCase();
    return (
      obra.obra.toLowerCase().includes(lowerSearch) ||
      obra.email.toLowerCase().includes(lowerSearch) ||
      obra.provincia.toLowerCase().includes(lowerSearch) ||
      obra.localidad.toLowerCase().includes(lowerSearch) ||
      obra.contacto.toLowerCase().includes(lowerSearch)
    );
  });

  const handleAddObra = async (newObra: Omit<Obra, "id">) => {
    try {
      const res = await fetch("/api/obras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newObra),
      });
      if (!res.ok) throw new Error("Error al guardar obra");
      const json = await res.json();
      setData((prev) => [...prev, json.obra]);
      setOpenAddObra(false);
    } catch (error) {
      console.error(error);
      alert("Error al agregar obra");
    }
  };

  const handleUpdateObra = async (updatedObra: Obra) => {
    try {
      const res = await fetch("/api/obras", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedObra),
      });
      if (!res.ok) throw new Error("Error al actualizar obra");
      const json = await res.json();
      setData((prev) =>
        prev.map((obra) => (obra.id === json.obra.id ? json.obra : obra))
      );
      setEditingObra(null);
    } catch (error) {
      console.error(error);
      alert("Error al actualizar obra");
    }
  };

  const handleDelete = async () => {
    if (!deletingObra) return;

    try {
      const res = await fetch("/api/obras", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deletingObra.id }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al eliminar obra");
      }
      setData((prev) => prev.filter((obra) => obra.id !== deletingObra.id));
      setDeletingObra(null);
      setDeleteError(null);
    } catch (error: any) {
      console.error(error);
      setDeleteError(error.message || "Error al eliminar obra");
    }
  };

  return (
    <>
      <Header />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardDescription>Gestiona las obras desde aquí.</CardDescription>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Buscar obra, email, provincia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow rounded border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
              aria-label="Buscar obra"
            />

            <AddObraDialog
              open={openAddObra}
              onOpenChange={setOpenAddObra}
              onAdd={handleAddObra}
              trigger={
                <Button className="whitespace-nowrap" variant="default">
                  + Nueva Obra
                </Button>
              }
            />
          </div>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No se encontraron obras que coincidan con la búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((obra) => (
                  <TableRow key={obra.id}>
                    <TableCell>{obra.id}</TableCell>
                    <TableCell>{obra.obra}</TableCell>
                    <TableCell>{obra.email}</TableCell>
                    <TableCell>{obra.provincia}</TableCell>
                    <TableCell>{obra.localidad}</TableCell>
                    <TableCell>{obra.importe}</TableCell>
                    <TableCell>{obra.contacto}</TableCell>
                    <TableCell>{obra.observaciones}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`Acciones para obra ${obra.obra}`}>
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => setEditingObra(obra)}
                          >
                            <Edit2 size={14} /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => {
                              setDeletingObra(obra);
                              setDeleteError(null);
                            }}
                          >
                            <Trash2 size={14} /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Diálogo para editar obra */}
      {editingObra && (
        <EditObraDialog
          open={!!editingObra}
          obra={editingObra}
          onClose={() => setEditingObra(null)}
          onSave={handleUpdateObra}
        />
      )}

      {/* Diálogo para confirmar eliminar */}
      <AlertDialog
        open={deletingObra !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingObra(null);
            setDeleteError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Seguro que quieres eliminar la obra "{deletingObra?.obra}"? Esta acción no se puede deshacer.
            </AlertDialogDescription>
            {deleteError && (
              <p className="text-red-600 mt-2 font-semibold">{deleteError}</p>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
