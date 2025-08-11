"use client";

import * as React from "react";
import { MoreHorizontal, Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  
  // Ejemplo de fetch de datos
  React.useEffect(() => {
    fetch("/api/obras")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Listado de Obras</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Nueva Obra
        </Button>
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
            {data.map((obra) => (
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
