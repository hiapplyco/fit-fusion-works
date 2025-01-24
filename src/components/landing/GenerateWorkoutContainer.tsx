import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { triggerConfetti } from "@/utils/confetti";
import { GenerateWorkoutInput } from "../GenerateWorkoutInput";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { generateWorkout, saveWorkoutNoAuth } from "@/utils/workoutGeneration";
import { ContactDialog } from "./ContactDialog";
import type { WeeklyWorkouts } from "@/utils/workoutGeneration";
import type { Exercise } from "../exercise-search/types";

interface GenerateWorkoutContainerProps {
  setWorkouts: (workouts: WeeklyWorkouts | null) => void;
}

export function GenerateWorkoutContainer({ setWorkouts }: GenerateWorkoutContainerProps) {
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [numberOfDays, setNumberOfDays] = useState(7);
  const [showGenerateInput, setShowGenerateInput] = useState(true);
  const { toast } = useToast();

  const handleGenerateWorkout = async (params: {
    prompt: string;
    weatherPrompt: string;
    selectedExercises: Exercise[];
    fitnessLevel: string;
    prescribedExercises: string;
  }) => {
    try {
      setIsGenerating(true);
      console.log("Starting workout generation with params:", params);
      
      const workouts = await generateWorkout({
        ...params,
        numberOfDays,
      });

      console.log("Generated workouts:", workouts);
      setWorkouts(workouts);
      
      // Save workouts without authentication
      const saved = await saveWorkoutNoAuth(workouts);
      
      toast({
        title: "Success",
        description: saved 
          ? "Your workout plan has been generated and saved!"
          : "Your workout plan has been generated! (Note: Unable to save to database)",
      });
      
      triggerConfetti();

    } catch (error: any) {
      console.error('Error in handleGenerateWorkout:', error);
      const errorMessage = error.message || "Failed to generate workouts. Please try again.";
      
      console.error('Detailed error:', {
        message: errorMessage,
        originalError: error
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="generate-workout">
      <GenerateWorkoutInput
        generatePrompt={generatePrompt}
        setGeneratePrompt={setGeneratePrompt}
        handleGenerateWorkout={handleGenerateWorkout}
        isGenerating={isGenerating}
        numberOfDays={numberOfDays}
        setNumberOfDays={setNumberOfDays}
        setShowGenerateInput={setShowGenerateInput}
      />
      <div className="mt-8 flex justify-center">
        <ContactDialog buttonText="Get Enterprise Access" variant="secondary" />
      </div>
      {isGenerating && <LoadingIndicator />}
    </div>
  );
}