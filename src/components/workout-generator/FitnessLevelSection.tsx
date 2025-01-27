import { Activity, User, Dumbbell, BicepsFlexed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "./TooltipWrapper";

interface FitnessLevelSectionProps {
  fitnessLevel: string;
  setFitnessLevel: (value: string) => void;
  isRequired?: boolean;
}

const fitnessLevels = [
  { level: "beginner", label: "Beginner", icon: User },
  { level: "intermediate", label: "Intermediate", icon: Dumbbell },
  { level: "advanced", label: "Advanced", icon: Activity },
  { level: "elite", label: "Elite", icon: BicepsFlexed },
];

export function FitnessLevelSection({
  fitnessLevel,
  setFitnessLevel,
  isRequired = false
}: FitnessLevelSectionProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-primary" />
        <h3 className="font-oswald text-lg">Fitness Level{isRequired && <span className="text-red-500 ml-1">*</span>}</h3>
        <TooltipWrapper content="Select your fitness level to receive appropriately challenging workouts" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {fitnessLevels.map(({ level, label, icon: Icon }) => (
          <Button
            key={level}
            onClick={() => setFitnessLevel(level)}
            variant={fitnessLevel === level ? "default" : "outline"}
            className={cn(
              "w-full transition-all duration-200 flex items-center gap-2 justify-center transform hover:scale-105",
              fitnessLevel === level 
                ? "bg-[#FFD700] text-black hover:bg-[#FFD700]/90" 
                : "bg-black/50 text-white hover:bg-black/70 hover:border-[#FFD700]/50 border-2"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="capitalize">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}