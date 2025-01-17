import { Button } from "@/components/ui/button";
import { WorkoutCard } from "@/components/WorkoutCard";
import { Check, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutDetails {
  [key: string]: {
    warmup: string;
    wod: string;
    notes: string;
    description?: string;
  };
}

const Index = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateInput, setShowGenerateInput] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutDetails>({});
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState([
    {
      title: "Sunday",
      description: "Rest and recovery day with mobility work and light stretching.",
      duration: "30 minutes",
    },
    {
      title: "Monday",
      description: "Strength focus with compound movements and accessory work.",
      duration: "60 minutes",
    },
    {
      title: "Tuesday",
      description: "High-intensity cardio and bodyweight exercises.",
      duration: "45 minutes",
    },
    {
      title: "Wednesday",
      description: "Olympic weightlifting technique and skill work.",
      duration: "60 minutes",
    },
    {
      title: "Thursday",
      description: "Endurance-based workout with mixed modal activities.",
      duration: "50 minutes",
    },
    {
      title: "Friday",
      description: "Strength and power development with heavy lifts.",
      duration: "60 minutes",
    },
    {
      title: "Saturday",
      description: "Team workout with partner exercises and fun challenges.",
      duration: "45 minutes",
    },
  ]);

  const handleGenerateWorkout = async () => {
    if (!generatePrompt.trim() && showGenerateInput) {
      toast({
        title: "Error",
        description: "Please enter some context for the workout generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Calling generate-weekly-workouts with prompt:', generatePrompt);
      const { data, error } = await supabase.functions.invoke('generate-weekly-workouts', {
        body: { prompt: generatePrompt },
      });

      if (error) {
        console.error('Error generating workouts:', error);
        throw error;
      }

      if (data) {
        console.log('Received workout data:', data);
        setWorkoutDetails(data);
        
        const updatedWorkouts = workouts.map(workout => ({
          ...workout,
          description: data[workout.title]?.description || workout.description
        }));
        setWorkouts(updatedWorkouts);

        toast({
          title: "Success",
          description: "Weekly workouts have been generated!",
        });

        setShowGenerateInput(false);
        setGeneratePrompt("");
      }
    } catch (error) {
      console.error('Error generating workouts:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate workouts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWorkoutUpdate = (day: string, updates: { warmup: string; wod: string; notes: string; }) => {
    setWorkoutDetails(prev => ({
      ...prev,
      [day]: updates
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in bg-background">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-4xl font-collegiate uppercase tracking-tight text-foreground">Your Workouts</h1>
            <p className="text-muted-foreground mt-2">Stay consistent with your fitness journey</p>
          </div>
          
          <div className="flex items-center gap-4 w-full">
            {showGenerateInput ? (
              <>
                <Input
                  placeholder="Enter context for workout generation (e.g., 'Focus on gymnastics this week' or 'Prepare for upcoming competition')"
                  value={generatePrompt}
                  onChange={(e) => setGeneratePrompt(e.target.value)}
                  className="flex-1 border-2 border-primary bg-background text-foreground"
                />
                <Button 
                  onClick={handleGenerateWorkout} 
                  disabled={isGenerating}
                  className="border-2 border-primary bg-card text-primary font-bold uppercase tracking-tight transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-50 whitespace-nowrap"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => setShowGenerateInput(false)}
                  variant="outline"
                  className="border-2 border-primary text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setShowGenerateInput(true)}
                className="border-2 border-primary bg-card text-primary font-bold uppercase tracking-tight transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Generate All Workouts
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-8 md:gap-12 grid-cols-1">
          {workouts.map((workout) => (
            <WorkoutCard 
              key={workout.title} 
              {...workout} 
              allWorkouts={workoutDetails}
              onUpdate={(updates) => handleWorkoutUpdate(workout.title, updates)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;