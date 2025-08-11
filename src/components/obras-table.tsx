'use client';

import * as React from 'react';
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
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
import type { Obra } from '@/lib/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { EditObraDialog } from './edit-obra-dialog';
import { es } from 'date-fns/locale';
import { useUser } from '@/hooks/use-user';

interface ObrasTableProps {
  obras: Obra[];
  onRemove: (id: number) => void;
  onUpdateObra: (obra: Obra) => Promise<void>;
}

export function ObrasTable({ obras, onRemove, onUpdateObra }: ObrasTableProps) {
  const { user, loading } = useUser();

  // Mientras carga usuario, opcionalmente muestra algo o nada
  if (loading) {
    return <div>Cargando usuario...</div>;
  }

  const role = user?.category?.trim().toLowerCase() ?? '';
  // Controla permisos de edición según rol
  const canEdit = role === 'developer' || role === 'owner';

  const [editingObra, setEditingObra] = React.useState<Obra | null>(null);
  const [deletingObraId, setDeletingObraId] = React.useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Gestiona las obras desde aquí.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obra</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Provincia</TableHead>
                <TableHead>Localidad</TableHead>
                <TableHead>Importe</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Observaciones</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="w-[60px] text-center">
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {obras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell className="font-medium">{obra.obra}</TableCell>
                  <TableCell>{obra.email}</TableCell>
                  <TableCell>{obra.provincia}</TableCell>
                  <TableCell>{obra.localidad}</TableCell>
                  <TableCell>
                    {obra.importe !== null && obra.importe !== undefined
                      ? `${obra.importe.toFixed(2)} €`
                      : '—'}
                  </TableCell>
                  <TableCell>{obra.contacto || '—'}</TableCell>
                  <TableCell>{obra.observaciones || '—'}</TableCell>
                  <TableCell className="text-right">
                    {obra.updated_at && !isNaN(Date.parse(obra.updated_at))
                      ? formatDistanceToNow(parseISO(obra.updated_at), {
                          addSuffix: true,
                          locale: es,
                        })
                      : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {canEdit && (
                      <DropdownMenu
                        open={menuOpenFor === obra.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setMenuOpenFor(obra.id);
                            setDeletingObraId(null);
                          } else {
                            setMenuOpenFor(null);
                          }
                        }}
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 bg-transparent border border-red-600"
                            aria-label={`Abrir menú de acciones para ${obra.obra}`}
                          >
                            <MoreHorizontal className="h-5 w-5 text-red-700" />
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
                              setEditingObra(obra);
                              setMenuOpenFor(null);
                            }}
                            className="flex items-center gap-2"
                          >
                            <Edit2 className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setDeletingObraId(obra.id);
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
        </CardContent>
      </Card>

      {editingObra && (
        <EditObraDialog
          obra={editingObra}
          onSave={onUpdateObra}
          onClose={() => setEditingObra(null)}
          open={!!editingObra}
        />
      )}

      <AlertDialog
        open={deletingObraId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingObraId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Seguro que quieres eliminar esta obra?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deletingObraId !== null) {
                  onRemove(deletingObraId);
                  setDeletingObraId(null);
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
