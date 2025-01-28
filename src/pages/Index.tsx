import { useState, useCallback } from "react";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SolutionsSection } from "@/components/landing/SolutionsSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { WorkoutDisplay } from "@/components/landing/WorkoutDisplay";
import { HeaderSection } from "@/components/landing/HeaderSection";
import { GeneratorSection } from "@/components/landing/GeneratorSection";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { triggerConfetti } from "@/utils/confetti";
import type { WeeklyWorkouts } from "@/types/fitness";

const DEFAULT_DAYS = 7;

const Index = () => {
  const [workouts, setWorkouts] = useState<WeeklyWorkouts | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateInput, setShowGenerateInput] = useState(true);
  const [numberOfDays, setNumberOfDays] = useState(DEFAULT_DAYS);
  const { toast } = useToast();

  const resetWorkouts = useCallback(() => {
    setWorkouts(null);
    setShowGenerateInput(true);
  }, []);

  const handleGenerateWorkout = useCallback(async (params: {
    prompt: string;
    weatherPrompt: string;
    selectedExercises: any[];
    fitnessLevel: string;
    prescribedExercises: string;
  }) => {
    setIsGenerating(true);
    const startTime = performance.now();

    try {
      const { error: sessionError } = await supabase.from('session_io').insert({
        weather_prompt: params.weatherPrompt,
        selected_exercises: params.selectedExercises,
        fitness_level: params.fitnessLevel,
        prescribed_exercises: params.prescribedExercises,
        number_of_days: numberOfDays,
        session_duration_ms: 0,
        success: false
      });

      if (sessionError) {
        console.error('Error storing session:', sessionError);
      }

      const { data, error } = await supabase.functions.invoke('generate-weekly-workouts', {
        body: {
          ...params,
          numberOfDays
        }
      });

      if (error) {
        console.error('Error generating workout:', error);
        toast({
          title: "Error",
          description: "Failed to generate workout. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const sessionDuration = Math.round(performance.now() - startTime);
      const { error: updateError } = await supabase
        .from('session_io')
        .update({
          generated_workouts: data,
          session_duration_ms: sessionDuration,
          success: true
        })
        .eq('session_duration_ms', 0)
        .eq('success', false);

      if (updateError) {
        console.error('Error updating session:', updateError);
      }

      setWorkouts(data);
      setShowGenerateInput(false);
      triggerConfetti();
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Error",
        description: "Failed to generate workout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [numberOfDays, toast]);

  if (workouts) {
    return (
      <WorkoutDisplay
        workouts={workouts}
        resetWorkouts={resetWorkouts}
        isExporting={isExporting}
        setIsExporting={setIsExporting}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <HeaderSection />

      <div 
        className="relative bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: 'url("/lovable-uploads/08e5da43-23c6-459a-bea3-16ae71e6ceb5.png")',
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        <div className="relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <HeroSection>
              <GeneratorSection
                generatePrompt={generatePrompt}
                setGeneratePrompt={setGeneratePrompt}
                handleGenerateWorkout={handleGenerateWorkout}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
                showGenerateInput={showGenerateInput}
                setShowGenerateInput={setShowGenerateInput}
                numberOfDays={numberOfDays}
                setNumberOfDays={setNumberOfDays}
              />
            </HeroSection>
          </div>
        </div>

        <div className="relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <FeaturesSection />
          </div>
        </div>

        <div className="relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <SolutionsSection />
          </div>
        </div>

        <div className="relative">
          <div className="container mx-auto px-4 max-w-[1200px]">
            <TestimonialsSection />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Index;