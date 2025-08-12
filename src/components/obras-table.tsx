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
import { es } from 'date-fns/locale';
import { EditObraDialog } from './edit-obra-dialog';
import { useUser } from '@/hooks/use-user';

interface ObrasTableProps {
  obras: Obra[];
  onRemove: (id: number) => void;
  onUpdateObra: (obra: Obra) => Promise<void>;
  filter?: string;
}

export function ObrasTable({ obras, onRemove, onUpdateObra, filter = '' }: ObrasTableProps) {
  const { user, loading } = useUser();

  const [editingObra, setEditingObra] = React.useState<Obra | null>(null);
  const [deletingObraId, setDeletingObraId] = React.useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);

  if (loading) {
    return <div>Cargando usuario...</div>;
  }

  const role = user?.category?.trim().toLowerCase() ?? '';
  const canEdit = role === 'developer' || role === 'owner';

  const term = (filter || '').trim().toLowerCase();

  const filteredObras = obras.filter((obra) => {
    if (!term) return true;
    return (
      (obra.obra || '').toLowerCase().includes(term) ||
      (obra.provincia || '').toLowerCase().includes(term) ||
      (obra.localidad || '').toLowerCase().includes(term) ||
      (obra.email || '').toLowerCase().includes(term) ||
      (obra.contacto || '').toLowerCase().includes(term) ||
      (obra.observaciones || '').toLowerCase().includes(term) ||
      (obra.importe !== null && obra.importe !== undefined && obra.importe.toString().includes(term))
    );
  });

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardDescription>Gestiona las obras desde aquí.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="relative max-h-[400px] overflow-auto">
              <Table className="min-w-full border-collapse">
                <TableHeader className="sticky top-0 bg-white z-20 shadow-sm">
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell px-6">
                      <span className="sr-only">Imagen</span>
                    </TableHead>
                    <TableHead className="px-6">Obra</TableHead>
                    <TableHead className="px-6">Email</TableHead>
                    <TableHead className="px-6">Provincia</TableHead>
                    <TableHead className="px-6">Localidad</TableHead>
                    <TableHead className="px-6">Importe</TableHead>
                    <TableHead className="px-6">Contacto</TableHead>
                    <TableHead className="px-6">Observaciones</TableHead>
                    <TableHead className="px-6">Creada</TableHead>
                    <TableHead className="px-6">Última Actualización</TableHead>
                    <TableHead className="w-[60px] text-center px-6">
                      <span className="sr-only">Acciones</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredObras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-6 text-muted-foreground px-6">
                        No se encontraron obras que coincidan con la búsqueda.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredObras.map((obra) => (
                      <TableRow key={obra.id}>
                        <TableCell className="hidden sm:table-cell px-6">
                          <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-2xl font-bold text-muted-foreground">
                              {obra.obra?.charAt(0) ?? '?'}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="font-medium px-6">{obra.obra}</TableCell>
                        <TableCell className="px-6">{obra.email}</TableCell>
                        <TableCell className="px-6">{obra.provincia}</TableCell>
                        <TableCell className="px-6">{obra.localidad}</TableCell>
                        <TableCell className="px-6">
                          {obra.importe !== null && obra.importe !== undefined
                            ? `${obra.importe.toFixed(2)} €`
                            : '—'}
                        </TableCell>
                        <TableCell className="px-6">{obra.contacto ?? '—'}</TableCell>
                        <TableCell className="px-6">{obra.observaciones ?? '—'}</TableCell>

                        <TableCell className="text-right px-6">
                          {obra.created_at && !isNaN(Date.parse(obra.created_at))
                            ? formatDistanceToNow(parseISO(obra.created_at), { addSuffix: true, locale: es })
                            : '—'}
                        </TableCell>

                        <TableCell className="text-right px-6">
                          {obra.updated_at && !isNaN(Date.parse(obra.updated_at))
                            ? formatDistanceToNow(parseISO(obra.updated_at), { addSuffix: true, locale: es })
                            : '—'}
                        </TableCell>

                        <TableCell className="text-center px-6">
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

                              <DropdownMenuContent align="end" sideOffset={5} className="bg-white border rounded shadow-md z-[1000]">
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
                    ))
                  )}
                </TableBody>
              </Table>

              <div
                className="absolute bottom-0 left-0 right-0 overflow-x-auto overflow-y-hidden"
                style={{ height: '1.5rem' }}
              >
                <div style={{ width: 'max-content', minWidth: '100%' }} />
              </div>
            </div>
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
      </div>
    </>
  );
}
