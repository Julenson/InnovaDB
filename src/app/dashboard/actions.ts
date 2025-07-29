'use server';

import {
  predictReorderPoints,
  type PredictReorderPointsInput,
  type PredictReorderPointsOutput,
} from '@/ai/flows/predict-reorder-points';

export async function handlePredictReorder(
  input: PredictReorderPointsInput
): Promise<PredictReorderPointsOutput | { error: string }> {
  try {
    const result = await predictReorderPoints(input);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unknown error occurred.' };
  }
}
