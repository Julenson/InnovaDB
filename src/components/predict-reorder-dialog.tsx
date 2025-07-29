'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader2, Wand2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handlePredictReorder } from '@/app/dashboard/actions';
import type { PredictReorderPointsOutput } from '@/ai/flows/predict-reorder-points';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ScrollArea } from './ui/scroll-area';

const predictionSchema = z.object({
  historicalUsageData: z.string().min(20, 'Please provide more detailed usage data.'),
  leadTimeDays: z.coerce.number().min(1, 'Lead time must be at least 1 day.'),
  desiredStockLevelDays: z.coerce.number().min(1, 'Desired stock level must be at least 1 day.'),
});

type PredictionForm = z.infer<typeof predictionSchema>;

const exampleUsageData = `Material: Balón de Fútbol T5, Date: 2024-05-01, Quantity Used: 10
Material: Balón de Fútbol T5, Date: 2024-05-08, Quantity Used: 15
Material: Zapatillas Running Pro, Date: 2024-05-03, Quantity Used: 5
Material: Zapatillas Running Pro, Date: 2024-05-10, Quantity Used: 8`;

export function PredictReorderDialog() {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [predictionResult, setPredictionResult] = React.useState<PredictReorderPointsOutput | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PredictionForm>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      historicalUsageData: exampleUsageData,
      leadTimeDays: 7,
      desiredStockLevelDays: 14,
    }
  });

  const onSubmit: SubmitHandler<PredictionForm> = async data => {
    setLoading(true);
    setPredictionResult(null);
    const result = await handlePredictReorder(data);
    setLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: result.error,
      });
    } else {
      setPredictionResult(result);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setPredictionResult(null);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <BrainCircuit className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Predecir Reabastecimiento
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Puntos de Prediccion de Reabastecimiento</DialogTitle>
            <DialogDescription>
              Utiliza IA para analizar datos históricos y sugerir puntos de reabastecimiento óptimos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="historicalUsageData">Datos de uso históricos</Label>
              <Textarea
                id="historicalUsageData"
                rows={5}
                placeholder="Enter historical data, e.g., 'Material: Name, Date: YYYY-MM-DD, Quantity Used: X'"
                {...register('historicalUsageData')}
              />
              {errors.historicalUsageData && <p className="text-xs text-destructive mt-1">{errors.historicalUsageData.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="leadTimeDays">Plazo de entrega (días)</Label>
                <Input id="leadTimeDays" type="number" {...register('leadTimeDays')} />
                {errors.leadTimeDays && <p className="text-xs text-destructive mt-1">{errors.leadTimeDays.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desiredStockLevelDays">Nivel de stock deseado (días)</Label>
                <Input id="desiredStockLevelDays" type="number" {...register('desiredStockLevelDays')} />
                {errors.desiredStockLevelDays && <p className="text-xs text-destructive mt-1">{errors.desiredStockLevelDays.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Generar sugerencias
                </>
              )}
            </Button>
          </DialogFooter>
        </form>

        {predictionResult && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Sugerencias de Reabastecimiento</h3>
            <ScrollArea className="h-[250px] w-full pr-4">
              <div className="space-y-4">
                {predictionResult.reorderSuggestions.map((item, index) => (
                  <Card key={index}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-base flex justify-between items-center">
                        {item.materialName}
                        <span className="text-primary font-bold text-lg">{item.reorderPoint} unidades</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-muted-foreground">{item.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
