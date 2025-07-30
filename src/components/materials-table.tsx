'use client';

import * as React from 'react';
import { MoreHorizontal, Plus, Minus, Trash2 } from 'lucide-react';
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
import type { Material } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EditMaterialDialog } from './edit-material-dialog';

interface MaterialsTableProps {
  materials: Material[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdateMaterial: (material: Partial<Material>) => void;
  currentUser: string;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiales</CardTitle>
        <CardDescription>
          Gestiona el inventario con facilidad desde aquí.
        </CardDescription>
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
              <TableHead className="hidden md:table-cell text-right">
                Última Actualización
              </TableHead>
              <TableHead className="hidden md:table-cell text-right">
                Actualizado Por
              </TableHead>
              <TableHead>
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
                  {material.category && (
                    <Badge variant="outline">{material.category}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {canEdit ? (
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(material.id, -1)}
                        disabled={material.quantity <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{material.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onUpdateQuantity(material.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    material.quantity
                  )}
                </TableCell>
                <TableCell>{material.description}</TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {material.lastUpdated
                    ? formatDistanceToNow(parseISO(material.lastUpdated), {
                        addSuffix: true,
                      })
                    : '—'}
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {material.updatedBy ?? '—'}
                </TableCell>
                <TableCell>
                  {canEdit && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <EditMaterialDialog
                          material={material}
                          onUpdate={onUpdateMaterial}
                        />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive cursor-pointer">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                ¿Seguro que quieres eliminar?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onRemove(material.id)}
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
  );
}
