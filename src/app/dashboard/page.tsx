// src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { PlusCircle, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddMaterialDialog } from '@/components/add-material-dialog';
import { PredictReorderDialog } from '@/components/predict-reorder-dialog';
import { MaterialsTable } from '@/components/materials-table';
import type { Material } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch materials from API route
  useEffect(() => {
    async function fetchMaterials() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/materials');
        if (!res.ok) throw new Error('Error fetching materials');
        const data = await res.json();
        setMaterials(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error al cargar los materiales. Por favor vuelve a intentarlo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchMaterials();
  }, [toast]);

  // Add material using API
  const handleAddMaterial = async (newMaterialData: Omit<Material, 'id' | 'lastUpdated'>) => {
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMaterialData),
      });
      if (!res.ok) throw new Error('Error adding material');
      const addedMaterial = await res.json();
      setMaterials(prev => [addedMaterial, ...prev]);
      toast({
        title: "Material Añadido",
        description: `${addedMaterial.name} ha sido añadido al inventario.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al añadir el material. Por favor vuelve a intentarlo.",
        variant: "destructive",
      });
    }
  };

  // Delete material using API
  const handleRemoveMaterial = async (materialId: number) => {
    try {
      const res = await fetch('/api/materials', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: materialId }),
      });
      if (!res.ok) throw new Error('Error deleting material');
      setMaterials(prev => prev.filter(m => m.id !== materialId));
      toast({
        title: "Material Eliminado",
        description: `Material eliminado.`,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el material. Por favor vuelve a intentarlo.",
        variant: "destructive",
      });
    }
  };

  // Update quantity using API
  const handleUpdateQuantity = async (materialId: number, change: number) => {
    const materialToUpdate = materials.find(m => m.id === materialId);
    if (!materialToUpdate) return;
    const newQuantity = Math.max(0, materialToUpdate.quantity + change);

    try {
      const res = await fetch('/api/materials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: materialId, quantity: newQuantity }),
      });
      if (!res.ok) throw new Error('Error updating material');
      const updatedMaterial = await res.json();
      setMaterials(prev => prev.map(m => (m.id === materialId ? updatedMaterial : m)));
      toast({
        title: "Material Actualizado",
        description: `La cantidad de ${updatedMaterial.name} ha sido actualizada a ${updatedMaterial.quantity}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar la cantidad del material. Por favor vuelve a intentarlo.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><p>Cargando inventario...</p></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          Inventario
        </h1>
        <div className="flex gap-2">
          <PredictReorderDialog />
          <AddMaterialDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddMaterial={handleAddMaterial}
          />
        </div>
      </div>

      <MaterialsTable
        materials={materials}
        onRemove={handleRemoveMaterial}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </>
  );
}
