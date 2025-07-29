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
} from "@/components/ui/alert-dialog"
import type { Material } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface MaterialsTableProps {
  materials: Material[];
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, change: number) => void;
}

export function MaterialsTable({
  materials,
  onRemove,
  onUpdateQuantity,
}: MaterialsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Materiales</CardTitle>
        <CardDescription>
          Gestiona el inventario con facilidad desde aqui.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead className="text-center">Medicion</TableHead>
              <TableHead className="hidden md:table-cell text-right">Ultima Actualización</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map(material => (
              <TableRow key={material.id}>
                <TableCell className="hidden sm:table-cell">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-2xl font-bold text-muted-foreground">{material.name.charAt(0)}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>
                  {material.category && <Badge variant="outline">{material.category}</Badge>}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(material.id, -1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-mono text-base w-10 text-center">{material.quantity}</span>
                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onUpdateQuantity(material.id, 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-right">
                  {material.lastUpdated ? formatDistanceToNow(parseISO(material.lastUpdated), { addSuffix: true }) : 'N/A'}
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Menu Alternado</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem disabled>Editar</DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Estas seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta accion no se puede deshacer. Esto eliminara de forma permanente el material
                          "{material.name}" de tu inventario.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onRemove(material.id)}>Continuar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
