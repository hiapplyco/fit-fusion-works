import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface GenerateWorkoutButtonProps {
  setShowGenerateInput: (value: boolean) => void;
  isGenerating?: boolean;
}

export function GenerateWorkoutButton({ setShowGenerateInput, isGenerating }: GenerateWorkoutButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button 
        onClick={() => setShowGenerateInput(true)}
        disabled={isGenerating}
        className={`border-2 border-destructive bg-destructive text-black font-collegiate text-xl uppercase tracking-tight transition-all hover:bg-destructiveSecondary hover:border-destructiveSecondary transform hover:-translate-y-1 hover:shadow-lg px-8 py-6 ${isGenerating ? 'opacity-75' : ''}`}
      >
        {isGenerating ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <Plus className="mr-2 h-6 w-6" />
        )}
        {isGenerating ? 'Generating...' : 'Generate Free Workout'}
      </Button>
    </motion.div>
  );
}