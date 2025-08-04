'use client';

import * as React from 'react';
import { MoreHorizontal, Plus, Minus, Trash2, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { Material, User } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EditMaterialDialog } from './edit-material-dialog';

interface MaterialsTableProps {
  materials: Material[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, change: number, updatedBy: string) => void;
  onUpdateMaterial: (material: Material) => Promise<void>;
  currentUser: User | null;
  currentUserRole: string;
}

export function MaterialsTable({
  materials,
  onRemove,
  onUpdateQuantity,
  onUpdateMaterial,
  currentUser,
  currentUserRole,
}: MaterialsTableProps) {
  const canEdit = ['admin', 'owner', 'developer', 'employee'].includes(currentUserRole);
  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = React.useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Materiales</CardTitle>
          <CardDescription>Gestiona el inventario con facilidad desde aquí.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {/* ... encabezados igual */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  {/* ... celdas iguales */}
                  <TableCell>
                    {canEdit && (
                      <DropdownMenu
                        open={menuOpenFor === material.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setMenuOpenFor(material.id);
                            setDeletingMaterialId(null); // limpiar diálogo eliminar
                          } else {
                            setMenuOpenFor(null);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMaterial(material);
                              setMenuOpenFor(null);
                            }}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" /> Editar
                          </DropdownMenuItem>

                          {/* Aquí el truco importante: */}
                          {/* Usamos un div para el AlertDialog para que no cierre el menú */}
                          <AlertDialog
                            open={deletingMaterialId === material.id}
                            onOpenChange={(open) => !open && setDeletingMaterialId(null)}
                          >
                            <AlertDialogTrigger asChild>
                              {/* En vez de DropdownMenuItem directo, ponemos un botón que evita cerrar menú */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // evita que se cierre el dropdown
                                  setDeletingMaterialId(material.id);
                                }}
                                className="text-destructive cursor-pointer flex items-center gap-2 px-3 py-2"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    setDeletingMaterialId(material.id);
                                  }
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Seguro que quieres eliminar?</AlertDialogTitle>
                                <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => {
                                  onRemove(material.id);
                                  setDeletingMaterialId(null);
                                  setMenuOpenFor(null);
                                }}>
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {editingMaterial && (
        <EditMaterialDialog
          material={editingMaterial}
          onSave={onUpdateMaterial}
          onClose={() => setEditingMaterial(null)}
          open={!!editingMaterial}
        />
      )}
    </>
  );
}