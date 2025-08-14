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
} from '@/components/ui/alert-dialog';
import type { Material, User } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EditMaterialDialog } from './edit-material-dialog';
import { es } from 'date-fns/locale';

interface MaterialsTableProps {
  materials: Material[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (
    id: number,
    change: number,
    updatedBy: string
  ) => Promise<'ok' | 'zero' | 'error'>;
  onUpdateMaterial: (material: Material) => Promise<void>;
  currentUser: User | null;
  currentUserRole: string;
}

function formatQuantity(qty: number | string) {
  const n = Number(qty);
  return Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(2)).toString();
}

export function MaterialsTable({
  materials,
  onRemove,
  onUpdateQuantity,
  onUpdateMaterial,
  currentUser,
  currentUserRole,
}: MaterialsTableProps) {
  const role = currentUserRole?.trim().toLowerCase();
  const canEdit = true;

  const [editingMaterial, setEditingMaterial] = React.useState<Material | null>(null);
  const [deletingMaterialId, setDeletingMaterialId] = React.useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);

  const handleSubtract = async (material: Material) => {
    if (!currentUser) return;
    const result = await onUpdateQuantity(material.id, -1, currentUser.email);
    if (result === 'zero') {
      setDeletingMaterialId(material.id);
    }
  };

  const handleAdd = async (material: Material) => {
    if (!currentUser) return;
    await onUpdateQuantity(material.id, 1, currentUser.email);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Gestiona el inventario con facilidad desde aquí.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] overflow-auto pb 2">
            <Table className="min-w-full border-collapse">
              <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Imagen</span>
                  </TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ud. Medición</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Último Destino</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead>Actualizado Por</TableHead>
                  <TableHead className="w-[60px] text-center">
                    <span className="sr-only">Acciones</span>
                  </TableHead>
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
                            onClick={() => handleSubtract(material)}
                            disabled={material.quantity <= 0 || !currentUser}
                            aria-label={`Restar cantidad de ${material.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{formatQuantity(material.quantity)}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleAdd(material)}
                            disabled={!currentUser}
                            aria-label={`Sumar cantidad de ${material.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span>{formatQuantity(material.quantity)}</span>
                      )}
                    </TableCell>
                    <TableCell>{material.description}</TableCell>
                    <TableCell>{material.valor !== null ? `${material.valor} €` : '—'}</TableCell>
                    <TableCell>{material.factura ?? '—'}</TableCell>
                    <TableCell>{material.lastDestiny ?? '—'}</TableCell>
                    <TableCell className="text-right">
                      {material.lastUpdated && typeof material.lastUpdated === 'string' && !isNaN(Date.parse(material.lastUpdated))
                        ? formatDistanceToNow(parseISO(material.lastUpdated), { addSuffix: true, locale: es })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      {material.updatedBy && material.updatedBy.trim() !== '' ? material.updatedBy : '—'}
                    </TableCell>
                    <TableCell className="text-center">
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
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                              aria-label={`Abrir menú de acciones para ${material.name}`}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            sideOffset={5}
                            className="bg-white border rounded shadow-md z-[1000]"
                          >
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingMaterial(material);
                                setMenuOpenFor(null);
                              }}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingMaterialId(material.id);
                                setMenuOpenFor(null);
                              }}
                              className="text-destructive flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

      <AlertDialog
        open={deletingMaterialId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingMaterialId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que quieres eliminar?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingMaterialId !== null) {
                  onRemove(deletingMaterialId);
                  setDeletingMaterialId(null);
                  setMenuOpenFor(null);
                }
              }}
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
