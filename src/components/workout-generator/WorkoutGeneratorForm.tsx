import { WorkoutPresets } from "./WorkoutPresets";
import { WeatherSection } from "./WeatherSection";
import { ExerciseSection } from "./ExerciseSection";
import { FitnessLevelSection } from "./FitnessLevelSection";
import { PrescribedExercisesSection } from "./PrescribedExercisesSection";
import { InjuriesSection } from "./InjuriesSection";
import { GenerateSection } from "./GenerateSection";
import { DaysSelection } from "./DaysSelection";
import { TooltipWrapper } from "./TooltipWrapper";
import type { Exercise } from "../exercise-search/types";
import type { WeatherData } from "@/types/weather";

interface WorkoutGeneratorFormProps {
  weatherData: WeatherData | null;
  onWeatherUpdate: (weatherData: WeatherData | null, weatherPrompt: string) => void;
  selectedExercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
  fitnessLevel: string;
  setFitnessLevel: (value: string) => void;
  prescribedExercises: string;
  setPrescribedExercises: (value: string) => void;
  isAnalyzingPrescribed: boolean;
  handlePrescribedFileSelect: (file: File) => Promise<void>;
  injuries: string;
  setInjuries: (value: string) => void;
  isAnalyzingInjuries: boolean;
  handleInjuriesFileSelect: (file: File) => Promise<void>;
  numberOfDays: number;
  setNumberOfDays: (value: number) => void;
  onGenerate: () => void;
  onClear: () => void;
  isGenerating: boolean;
  isValid: boolean;
}

export function WorkoutGeneratorForm({
  weatherData,
  onWeatherUpdate,
  selectedExercises,
  onExerciseSelect,
  fitnessLevel,
  setFitnessLevel,
  prescribedExercises,
  setPrescribedExercises,
  isAnalyzingPrescribed,
  handlePrescribedFileSelect,
  injuries,
  setInjuries,
  isAnalyzingInjuries,
  handleInjuriesFileSelect,
  numberOfDays,
  setNumberOfDays,
  onGenerate,
  onClear,
  isGenerating,
  isValid
}: WorkoutGeneratorFormProps) {
  const renderTooltip = (content: string) => (
    <TooltipWrapper content={content} />
  );

  const handlePresetSelect = (preset: {
    title: string;
    prescribedExercises: string;
    fitnessLevel: string;
    numberOfDays: number;
  }) => {
    console.log('Preset selected in form:', preset);
    setPrescribedExercises(preset.prescribedExercises);
    setFitnessLevel(preset.fitnessLevel);
    setNumberOfDays(preset.numberOfDays);
  };

  return (
    <div className={`relative bg-card rounded-xl border-[6px] border-black shadow-[inset_0px_0px_0px_2px_rgba(255,255,255,1),8px_8px_0px_0px_rgba(255,0,0,1),12px_12px_0px_0px_#C4A052] hover:shadow-[inset_0px_0px_0px_2px_rgba(255,255,255,1),4px_4px_0px_0px_rgba(255,0,0,1),8px_8px_0px_0px_#C4A052] transition-all duration-200 p-8 space-y-8 ${isGenerating ? 'before:absolute before:inset-0 before:rounded-lg before:border-4 before:border-primary before:animate-[gradient_3s_ease_infinite] before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent' : ''}`}>
      <WorkoutPresets 
        onSelectPreset={handlePresetSelect}
      />
      
      <DaysSelection
        numberOfDays={numberOfDays}
        setNumberOfDays={setNumberOfDays}
        renderTooltip={() => renderTooltip("Choose how many days you want to train in your program")}
      />

      <PrescribedExercisesSection
        prescribedExercises={prescribedExercises}
        setPrescribedExercises={setPrescribedExercises}
        isAnalyzingPrescribed={isAnalyzingPrescribed}
        handlePrescribedFileSelect={handlePrescribedFileSelect}
      />

      <WeatherSection 
        weatherData={weatherData}
        onWeatherUpdate={onWeatherUpdate}
        renderTooltip={() => renderTooltip("Add your location to get weather-optimized workouts")}
      />
      
      <ExerciseSection
        selectedExercises={selectedExercises}
        onExerciseSelect={onExerciseSelect}
        renderTooltip={() => renderTooltip("Select specific exercises and equipment you have access to for personalized workouts")}
      />

      <FitnessLevelSection
        fitnessLevel={fitnessLevel}
        setFitnessLevel={setFitnessLevel}
      />

      <InjuriesSection
        injuries={injuries}
        setInjuries={setInjuries}
        isAnalyzingInjuries={isAnalyzingInjuries}
        handleInjuriesFileSelect={handleInjuriesFileSelect}
      />

      <GenerateSection
        onGenerate={onGenerate}
        onClear={onClear}
        isGenerating={isGenerating}
        isValid={isValid}
        renderTooltip={() => renderTooltip("Review your selections and generate your personalized program")}
      />
    </div>
  );
}