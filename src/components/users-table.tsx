'use client';

import * as React from 'react';
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { User } from '@/lib/types';

interface UsersTableProps {
  users: User[];
  onRemove: (id: number) => Promise<void> | void;
  onEdit: (user: User) => Promise<void> | void;
  currentUser: User | null;
  currentUserRole: string;
}

export function UsersTable({
  users,
  onRemove,
  onEdit,
  currentUser,
  currentUserRole,
}: UsersTableProps) {
  const canEdit = ['admin', 'owner'].includes(currentUserRole);
  const [deletingUserId, setDeletingUserId] = React.useState<number | null>(null);
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Gestión de usuarios registrados en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Correo</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead><span className="sr-only">Acciones</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.email}</TableCell>
                <TableCell>
                  {user.category && <Badge variant="outline">{user.category}</Badge>}
                </TableCell>
                <TableCell>
                  {canEdit && (
                    <DropdownMenu
                      open={menuOpenFor === user.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setMenuOpenFor(user.id);
                          setDeletingUserId(null);
                        } else {
                          setMenuOpenFor(null);
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label={`Abrir menú de acciones para ${user.email}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            onEdit(user);
                            setMenuOpenFor(null);
                          }}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Edit2 className="h-4 w-4" /> Editar
                        </DropdownMenuItem>

                        <AlertDialog
                          open={deletingUserId === user.id}
                          onOpenChange={(open) => !open && setDeletingUserId(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeletingUserId(user.id);
                              }}
                              className="text-destructive cursor-pointer flex items-center gap-2 px-3 py-2"
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  setDeletingUserId(user.id);
                                }
                              }}
                              aria-label={`Eliminar usuario ${user.email}`}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </div>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Seguro que quieres eliminar este usuario?</AlertDialogTitle>
                              <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  onRemove(user.id);
                                  setDeletingUserId(null);
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
  );
}
