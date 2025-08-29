'use client'

import * as React from 'react'
import { MoreHorizontal, Trash2, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Obra, User } from '@/lib/types'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { EditObraDialog } from './edit-obra-dialog'

interface ObrasTableProps {
  obras: Obra[]
  onRemove: (id: number) => void
  onUpdateObra: (obra: Obra) => Promise<void>
  currentUser: User | null
  currentUserRole: string
}

// 🔹 Formateador de importes estilo español (puntos para miles, coma para decimales)
const formatImporte = (value: number | string) => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '—'
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function ObrasTable({
  obras,
  onRemove,
  onUpdateObra,
  currentUser,
  currentUserRole,
}: ObrasTableProps) {
  const role = currentUserRole?.trim().toLowerCase()
  const canEdit = true

  const [editingObra, setEditingObra] = React.useState<Obra | null>(null)
  const [deletingObraId, setDeletingObraId] = React.useState<number | null>(null)
  const [menuOpenFor, setMenuOpenFor] = React.useState<number | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardDescription>Gestiona las obras desde aquí.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[400px] overflow-auto pb 2">
            <Table className="min-w-full border-collapse text-sm">
              <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Comercial</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Localidad</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Creado</TableHead>
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
                      {obra.importe !== undefined && obra.importe !== null
                        ? `${formatImporte(obra.importe)} €`
                        : '—'}
                    </TableCell>
                    <TableCell>{obra.contacto}</TableCell>
                    <TableCell>{obra.observaciones}</TableCell>
                    <TableCell>
                      {obra.created_at && !isNaN(Date.parse(obra.created_at))
                        ? formatDistanceToNow(parseISO(obra.created_at), { addSuffix: true, locale: es })
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {obra.updated_at && !isNaN(Date.parse(obra.updated_at))
                        ? formatDistanceToNow(parseISO(obra.updated_at), { addSuffix: true, locale: es })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-center">
                      {canEdit && (
                        <DropdownMenu
                          open={menuOpenFor === obra.id}
                          onOpenChange={(open) => {
                            if (open) {
                              setMenuOpenFor(obra.id)
                              setDeletingObraId(null)
                            } else {
                              setMenuOpenFor(null)
                            }
                          }}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-primary hover:bg-primary/10"
                              aria-label={`Abrir menú de acciones para ${obra.obra}`}
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
                                setEditingObra(obra)
                                setMenuOpenFor(null)
                              }}
                              className="flex items-center gap-2"
                            >
                              <Edit2 className="h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setDeletingObraId(obra.id)
                                setMenuOpenFor(null)
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
          if (!open) setDeletingObraId(null)
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
                if (deletingObraId !== null) {
                  onRemove(deletingObraId)
                  setDeletingObraId(null)
                  setMenuOpenFor(null)
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
  )
}
