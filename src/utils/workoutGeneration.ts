import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { triggerConfetti } from "@/utils/confetti";
import type { Exercise } from "@/components/exercise-search/types";

interface WorkoutDay {
  description: string;
  warmup: string;
  workout: string;
  strength: string;
  notes?: string;
}

export type WeeklyWorkouts = Record<string, WorkoutDay>;

interface GenerateWorkoutParams {
  prompt: string;
  weatherPrompt: string;
  selectedExercises: Exercise[];
  fitnessLevel: string;
  prescribedExercises: string;
  numberOfDays: number;
}

export const generateWorkout = async (params: GenerateWorkoutParams): Promise<WeeklyWorkouts> => {
  console.log("Starting workout generation with params:", params);

  const { data, error } = await supabase.functions.invoke<WeeklyWorkouts>('generate-weekly-workouts', {
    body: params
  });

  console.log("Edge Function response:", { data, error });

  if (error) {
    console.error("Edge Function error:", error);
    throw new Error(error.message || 'Failed to generate workouts');
  }

  if (!data) {
    console.error("No data received from Edge Function");
    throw new Error("No workout data received");
  }

  return data;
};

export const saveWorkoutNoAuth = async (workouts: WeeklyWorkouts) => {
  console.log("Saving workouts without auth:", workouts);
  
  const workoutPromises = Object.entries(workouts).map(([day, workout]) => {
    return supabase.from('workouts').insert({
      day,
      warmup: workout.warmup,
      workout: workout.workout,
      notes: workout.notes,
      strength: workout.strength,
      description: workout.description,
      user_id: '00000000-0000-0000-0000-000000000000' // Default user ID for non-authenticated workouts
    });
  });

  try {
    await Promise.all(workoutPromises);
    console.log("Successfully saved all workouts");
    return true;
  } catch (error) {
    console.error("Error saving workouts:", error);
    return false;
  }
};