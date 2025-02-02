import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WORKOUT_PROGRAMS = {
  CrossFit_Programs: {
    Fran: "A high-intensity benchmark WOD combining thrusters and pull-ups for time.",
    Murph: "A grueling hero WOD featuring a 1-mile run, 100 pull-ups, 200 push-ups, 300 squats, and another 1-mile run, often done with a weighted vest.",
    Cindy: "A 20-minute AMRAP (as many rounds as possible) of 5 pull-ups, 10 push-ups, and 15 air squats.",
    Diane: "A fast-paced WOD of deadlifts and handstand push-ups, completed for time.",
    Grace: "A sprint-style WOD consisting of 30 clean and jerks at 135 lbs (95 lbs for women)."
  },
  Military_Programs: {
    SealFit: "A Navy SEAL-inspired program blending endurance, strength, and mental toughness training.",
    Ranger_School_PT_Program: "A rigorous physical training regimen designed to prepare soldiers for the intense demands of Ranger School.",
    Army_Combat_Fitness_Test_ACFT: "The current U.S. Army fitness test, including deadlifts, sprint-drag-carry drills, and a two-mile run.",
    Recon_Ron_Pull_Up_Program: "A structured pull-up progression plan used by military personnel to build upper-body strength.",
    Operator_Ugly: "A brutal fitness test designed for special forces, incorporating strength, endurance, and tactical readiness elements."
  },
  Bodybuilding_Programs: {
    Arnold_Blueprint_to_Mass: "A high-volume program based on Arnold Schwarzenegger's legendary training routine.",
    Dorian_Yates_Blood_and_Guts: "An intense, low-volume, high-intensity training method focused on reaching muscle failure.",
    German_Volume_Training_GVT: "A hypertrophy program centered around 10 sets of 10 reps for maximal muscle growth.",
    Push_Pull_Legs_PPL: "A widely used split routine that targets pushing muscles, pulling muscles, and legs separately.",
    Jim_Wendlers_5_3_1: "A strength-focused program emphasizing progressive overload with squats, deadlifts, bench press, and overhead press."
  }
} as const;

const PRESET_CONFIGS = {
  // CrossFit Programs
  Fran: {
    title: "CrossFit - Fran",
    prescribedExercises: "21-15-9 reps for time:\nThrusters (95/65 lb)\nPull-ups",
    fitnessLevel: "advanced",
    numberOfDays: 1
  },
  Murph: {
    title: "CrossFit - Murph",
    prescribedExercises: "For time:\n1 mile Run\n100 Pull-ups\n200 Push-ups\n300 Squats\n1 mile Run",
    fitnessLevel: "advanced",
    numberOfDays: 1
  },
  Cindy: {
    title: "CrossFit - Cindy",
    prescribedExercises: "20 minute AMRAP:\n5 Pull-ups\n10 Push-ups\n15 Air Squats",
    fitnessLevel: "intermediate",
    numberOfDays: 1
  },
  Diane: {
    title: "CrossFit - Diane",
    prescribedExercises: "21-15-9 reps for time:\nDeadlifts (225/155 lb)\nHandstand Push-ups",
    fitnessLevel: "advanced",
    numberOfDays: 1
  },
  Grace: {
    title: "CrossFit - Grace",
    prescribedExercises: "For time:\n30 Clean and Jerks (135/95 lb)",
    fitnessLevel: "advanced",
    numberOfDays: 1
  },
  // Military Programs
  SealFit: {
    title: "Military - SealFit",
    prescribedExercises: "Warm-up:\n400m run\n25 push-ups\n25 air squats\n\nMain workout:\n5 rounds for time:\n400m run\n25 pull-ups\n50 push-ups\n75 squats",
    fitnessLevel: "advanced",
    numberOfDays: 5
  },
  Ranger_School_PT_Program: {
    title: "Military - Ranger School PT",
    prescribedExercises: "5 mile run\n100 push-ups\n100 sit-ups\n20 pull-ups\n12 mile ruck march with 35lb pack",
    fitnessLevel: "advanced",
    numberOfDays: 6
  },
  Army_Combat_Fitness_Test_ACFT: {
    title: "Military - ACFT",
    prescribedExercises: "3 Rep Max Deadlift\nStanding Power Throw\nHand Release Push-ups\nSprint-Drag-Carry\nLeg Tuck\n2 Mile Run",
    fitnessLevel: "intermediate",
    numberOfDays: 3
  },
  Recon_Ron_Pull_Up_Program: {
    title: "Military - Recon Ron",
    prescribedExercises: "Progressive Pull-up Program:\nSet 1: Max Reps\nSet 2: 75% of Max\nSet 3-5: 50% of Max\nRest 90 seconds between sets",
    fitnessLevel: "intermediate",
    numberOfDays: 3
  },
  Operator_Ugly: {
    title: "Military - Operator Ugly",
    prescribedExercises: "For time:\n1 mile run\n100 burpees\n100 pull-ups\n100 push-ups\n100 sit-ups\n1 mile run",
    fitnessLevel: "advanced",
    numberOfDays: 1
  },
  // Bodybuilding Programs
  Arnold_Blueprint_to_Mass: {
    title: "Bodybuilding - Arnold Blueprint",
    prescribedExercises: "Chest & Back:\nBench Press: 5x8-12\nWide-Grip Pull-Ups: 5x failure\nIncline Bench: 4x8-12\nBarbell Rows: 4x8-12",
    fitnessLevel: "intermediate",
    numberOfDays: 6
  },
  Dorian_Yates_Blood_and_Guts: {
    title: "Bodybuilding - Blood and Guts",
    prescribedExercises: "Back:\nDeadlifts: 1x6-8\nBarbell Rows: 1x6-8\nPull-downs: 1x6-8\nSeated Rows: 1x6-8",
    fitnessLevel: "advanced",
    numberOfDays: 4
  },
  German_Volume_Training_GVT: {
    title: "Bodybuilding - GVT",
    prescribedExercises: "Day 1 - Chest & Back:\nBench Press: 10x10\nBent Over Rows: 10x10\nIncline DB Press: 3x10\nPull-downs: 3x10",
    fitnessLevel: "intermediate",
    numberOfDays: 5
  },
  Push_Pull_Legs_PPL: {
    title: "Bodybuilding - PPL",
    prescribedExercises: "Push Day:\nBench Press: 4x8-12\nOHP: 4x8-12\nIncline DB Press: 3x10-15\nLateral Raises: 3x12-15",
    fitnessLevel: "intermediate",
    numberOfDays: 6
  },
  Jim_Wendlers_5_3_1: {
    title: "Bodybuilding - 5/3/1",
    prescribedExercises: "Week 1:\nSet 1: 65% x 5\nSet 2: 75% x 5\nSet 3: 85% x 5+\nBBB: 5x10 at 50%",
    fitnessLevel: "intermediate",
    numberOfDays: 4
  }
} as const;

interface WorkoutPreset {
  title: string;
  prescribedExercises: string;
  fitnessLevel: string;
  numberOfDays: number;
}

interface WorkoutPresetsProps {
  onSelectPreset: (preset: WorkoutPreset) => void;
}

export function WorkoutPresets({ onSelectPreset }: WorkoutPresetsProps) {
  const [selectedWorkouts, setSelectedWorkouts] = useState<Record<string, string>>({});

  const handleWorkoutSelect = (category: string, workoutName: string) => {
    const preset = PRESET_CONFIGS[workoutName as keyof typeof PRESET_CONFIGS];
    
    if (preset) {
      // Clear previous selections in all categories
      setSelectedWorkouts({
        [category]: workoutName
      });
      
      // Find the workout description
      const categoryKey = Object.keys(WORKOUT_PROGRAMS).find(cat => 
        Object.keys(WORKOUT_PROGRAMS[cat as keyof typeof WORKOUT_PROGRAMS]).includes(workoutName)
      ) as keyof typeof WORKOUT_PROGRAMS | undefined;
      
      if (categoryKey) {
        const workoutDescription = WORKOUT_PROGRAMS[categoryKey][workoutName as keyof (typeof WORKOUT_PROGRAMS)[typeof categoryKey]];
        
        const formattedPreset: WorkoutPreset = {
          title: preset.title,
          prescribedExercises: `${preset.title}\n\nDescription:\n${workoutDescription}\n\nWorkout Details:\n${preset.prescribedExercises}`,
          fitnessLevel: preset.fitnessLevel,
          numberOfDays: preset.numberOfDays
        };
        
        console.log('Sending preset to parent:', formattedPreset);
        onSelectPreset(formattedPreset);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">What exercise would you like to do?</h3>
        <p className="text-sm text-gray-300">
          Drawing from our database of thousands of user-submitted and expert-curated workouts, we've handpicked some 
          popular training templates to help you get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(WORKOUT_PROGRAMS).map(([category, workouts]) => (
          <Card 
            key={category}
            className="p-4 bg-black/50 border-2 border-primary/20"
          >
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white text-center">
                {category.replace(/_/g, ' ')}
              </h4>
              
              <Select
                value={selectedWorkouts[category] || ''}
                onValueChange={(value) => handleWorkoutSelect(category, value)}
              >
                <SelectTrigger className="w-full bg-black/60 text-white border-primary">
                  <SelectValue placeholder="Select a workout" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 border-primary">
                  {Object.entries(workouts).map(([name, description]) => (
                    <TooltipProvider key={name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SelectItem 
                            value={name}
                            className="text-white hover:bg-primary/20 cursor-pointer"
                          >
                            {name.replace(/_/g, ' ')}
                          </SelectItem>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="right"
                          className="max-w-[300px] bg-black/90 text-white p-3 border-primary"
                        >
                          <p>{description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
