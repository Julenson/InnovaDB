"use client";

import * as React from "react";
import { MoreHorizontal, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export interface Obra {
  id: number;
  obra: string; 
  email: string;
  provincia: string;
  localidad: string;
  importe: number; 
  contacto: string; 
  observaciones: string;
  updatedBy: string;
  lastUpdated: string; 
}

export default function ObrasPage() {
  const [data, setData] = React.useState<Obra[]>([]);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    fetch("/api/obras")
      .then((res) => res.json())
      .then((data) => setData(data.obras))
      .catch((err) => console.error(err));
  }, []);

  // Filtrar obras según búsqueda
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

  return (
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
          <Button
            className="whitespace-nowrap"
            onClick={() => {
              /* Acción para nueva obra */
            }}
          >
            <Plus size={16} />
            Nueva Obra
          </Button>
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
              <TableHead>Actualizado por</TableHead>
              <TableHead>Última actualización</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
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
                  <TableCell>{obra.updatedBy}</TableCell>
                  <TableCell>{obra.lastUpdated}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="flex items-center gap-2">
                          <Edit2 size={14} /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 text-red-600">
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
  );
}
