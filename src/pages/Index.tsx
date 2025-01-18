import { Button } from "@/components/ui/button";
import { ExerciseSearch } from "@/components/ExerciseSearch";
import { Link } from "react-router-dom";
import { useState } from "react";
import { 
  GraduationCap, 
  Trophy, 
  BookOpen,
  Users,
  BarChart,
  Globe,
  Star,
  ChevronRight
} from "lucide-react";
import { GenerateWorkoutInput } from "@/components/GenerateWorkoutInput";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [generatePrompt, setGeneratePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateInput, setShowGenerateInput] = useState(true);
  const { toast } = useToast();

  const handleGenerateWorkout = async () => {
    if (!generatePrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for workout generation",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-weekly-workouts', {
        body: { prompt: generatePrompt }
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Workouts generated successfully! Check your dashboard to view them.",
        });
        // You might want to redirect to the dashboard or display the workouts here
      }
    } catch (error) {
      console.error('Error generating workouts:', error);
      toast({
        title: "Error",
        description: "Failed to generate workouts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in bg-background min-h-screen">
      <ExerciseSearch />
      
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-8 pt-12 pb-20">
        <h1 className="text-6xl md:text-7xl font-oswald uppercase tracking-tight text-primary text-center max-w-4xl">
          Build Stronger, Train Smarter
        </h1>
        <p className="text-xl md:text-2xl text-destructive font-semibold text-center max-w-2xl">
          Empower your athletes with collegiate-level training tools that build consistency, adaptability, and growth.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
          <GenerateWorkoutInput
            generatePrompt={generatePrompt}
            setGeneratePrompt={setGeneratePrompt}
            handleGenerateWorkout={handleGenerateWorkout}
            isGenerating={isGenerating}
            setShowGenerateInput={setShowGenerateInput}
          />
        </div>
      </section>

      <section className="py-20 bg-card rounded-3xl px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald text-primary mb-4">
            Train Smarter, Not Harder
          </h2>
          <p className="text-lg text-destructive">
            From customized programming to tracking progress, Apply Strong is the toolset you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <GraduationCap className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-2xl font-oswald text-primary">Adaptive Programming</h3>
            <p className="text-white">Precision-crafted plans tailored to your athletes' goals.</p>
          </div>
          <div className="text-center space-y-4">
            <Trophy className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-2xl font-oswald text-primary">Performance Analytics</h3>
            <p className="text-white">Data-driven insights to drive smarter decisions.</p>
          </div>
          <div className="text-center space-y-4">
            <BookOpen className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-2xl font-oswald text-primary">Strategic Progression</h3>
            <p className="text-white">Build lasting results through structured periodization.</p>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald text-primary mb-4">
            The Ultimate Platform for Coaches
          </h2>
          <p className="text-lg text-destructive">
            Apply Your Strength combines the science of periodization with the flexibility of a modern coaching platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-card p-8 rounded-xl space-y-4">
            <Users className="w-12 h-12 text-primary" />
            <h3 className="text-2xl font-oswald text-primary">Connect with Athletes</h3>
            <p className="text-white">Real-time chat, form review, and leaderboards to engage clients.</p>
          </div>
          <div className="bg-card p-8 rounded-xl space-y-4">
            <BarChart className="w-12 h-12 text-primary" />
            <h3 className="text-2xl font-oswald text-primary">Build Your Program</h3>
            <p className="text-white">Design scalable training plans and save time with reusable templates.</p>
          </div>
          <div className="bg-card p-8 rounded-xl space-y-4">
            <Globe className="w-12 h-12 text-primary" />
            <h3 className="text-2xl font-oswald text-primary">Grow Anywhere</h3>
            <p className="text-white">Sell your programs online or coach remotely from anywhere in the world.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card rounded-3xl px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-oswald text-primary text-center mb-16">
          What Coaches Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-muted p-8 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              {[1,2,3,4,5].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-current" />
              ))}
            </div>
            <p className="text-white mb-4">"Apply Your Strength changed how I coach my athletes—streamlined, efficient, and easy to use!"</p>
            <p className="text-primary font-oswald">– Jane D.</p>
          </div>
          <div className="bg-muted p-8 rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              {[1,2,3,4,5].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-current" />
              ))}
            </div>
            <p className="text-white mb-4">"The analytics give me the edge I need to refine my programming and keep my clients progressing."</p>
            <p className="text-primary font-oswald">– John S.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-oswald text-primary mb-8">
          Join a Community of Excellence
        </h2>
        <div className="w-full max-w-3xl mx-auto">
          <GenerateWorkoutInput
            generatePrompt={generatePrompt}
            setGeneratePrompt={setGeneratePrompt}
            handleGenerateWorkout={handleGenerateWorkout}
            isGenerating={isGenerating}
            setShowGenerateInput={setShowGenerateInput}
          />
        </div>
      </section>

      {/* CrossFit Link */}
      <div className="fixed top-4 right-4 max-w-md text-right">
        <Link to="/best-app-of-day" className="text-primary hover:underline font-bold inline-flex items-center">
          Check out our CrossFit focused builder→
        </Link>
        <p className="text-sm text-muted-foreground mt-2">
          CrossFit's unique blend of complex movements and intense metrics inspired our journey.
        </p>
      </div>
    </div>
  );
}

export default Index;
