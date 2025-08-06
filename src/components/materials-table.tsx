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
import { es } from 'date-fns/locale';

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
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Imagen</span>
                </TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Ud. Medición</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead>Actualizado Por</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="hidden sm:table-cell">
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {material.name.charAt(0)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    {material.category && <Badge variant="outline">{material.category}</Badge>}
                  </TableCell>
                  <TableCell className="text-center">
                    {canEdit ? (
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            currentUser &&
                            onUpdateQuantity(material.id, -1, currentUser.email)
                          }
                          disabled={material.quantity <= 0 || !currentUser}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span>{Number(material.quantity) % 1 === 0
                          ? material.quantity.toString()
                          : material.quantity.toFixed(2)}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() =>
                            currentUser &&
                            onUpdateQuantity(material.id, 1, currentUser.email)
                          }
                          disabled={!currentUser}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      material.quantity.toFixed(2)
                    )}
                  </TableCell>
                  <TableCell>{material.description}</TableCell>
                  <TableCell className="text-right">
                    {material.lastUpdated && typeof material.lastUpdated === 'string' && !isNaN(Date.parse(material.lastUpdated))
                      ? formatDistanceToNow(parseISO(material.lastUpdated), { addSuffix: true, locale: es })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    {material.updatedBy && material.updatedBy.trim() !== '' ? material.updatedBy : '—'}
                  </TableCell>
                  <TableCell>
                    {canEdit && (
                      <DropdownMenu
                        open={menuOpenFor === material.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setMenuOpenFor(material.id);
                            setDeletingMaterialId(null); 
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
                              setMenuOpenFor(null); // cerrar menú al editar
                            }}
                            className="cursor-pointer flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" /> Editar
                          </DropdownMenuItem>

                          <AlertDialog
                            open={deletingMaterialId === material.id}
                            onOpenChange={(open) => !open && setDeletingMaterialId(null)}
                          >
                            <AlertDialogTrigger asChild>
                              {/* Aquí usamos un div que evita cerrar el menú */}
                              <div
                                onClick={(e) => {
                                  e.stopPropagation(); // evita cerrar menú
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
                                <AlertDialogAction
                                  onClick={() => {
                                    onRemove(material.id);
                                    setDeletingMaterialId(null);
                                    setMenuOpenFor(null);
                                  }}
                                >
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
