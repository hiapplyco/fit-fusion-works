import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useVideoProcessing } from "@/hooks/useVideoProcessing";
import { Teleprompter } from "./Teleprompter";
import { useLocation } from "react-router-dom";
import VideoRecorder from "./VideoRecorder";
import { Camera, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VideoAnalysis = () => {
  const location = useLocation();
  const [movement, setMovement] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [teleprompterPosition, setTeleprompterPosition] = useState(0);
  const [workoutScript, setWorkoutScript] = useState("");
  const [showRecorder, setShowRecorder] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const { toast } = useToast();
  const {
    selectedFile,
    isAnalyzing,
    setIsAnalyzing,
    handleFileSelect,
  } = useVideoProcessing();

  useEffect(() => {
    if (location.state?.workoutScript) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = location.state.workoutScript;
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      setWorkoutScript(plainText);
    }
  }, [location.state]);

  const handleAnalyzeVideo = async (videoUrl: string) => {
    try {
      setIsAnalyzing(true);
      const { data, error } = await supabase.functions.invoke('analyze-video', {
        body: {
          videoUrl,
          movement: movement || "exercise",
        }
      });

      if (error) throw error;

      setAnalysisResult(data.result);
      toast({
        title: "Analysis Complete",
        description: "Your video has been successfully analyzed",
      });
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!showRecorder && !showTeleprompter) {
    return (
      <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: 'url("/lovable-uploads/842b2afa-8591-4d83-b092-99399dbeaa94.png")',
        }}>
        <div className="min-h-screen bg-gradient-to-b from-transparent via-black/75 to-black/75 backdrop-blur-sm">
          <div className="container mx-auto px-4 pt-16">
            <h1 className="text-4xl font-bold text-white mb-16 text-center">Video Analysis</h1>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Button
                  onClick={() => setShowRecorder(true)}
                  className="h-64 bg-accent hover:bg-accent/90 flex flex-col items-center justify-center gap-4 p-8 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Camera className="h-24 w-24" />
                  <span className="text-2xl font-semibold">Start Recording</span>
                </Button>

                <Button
                  onClick={() => setShowTeleprompter(true)}
                  className="h-64 bg-accent hover:bg-accent/90 flex flex-col items-center justify-center gap-4 p-8 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <Tv className="h-24 w-24" />
                  <span className="text-2xl font-semibold">Start Teleprompter</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: 'url("/lovable-uploads/842b2afa-8591-4d83-b092-99399dbeaa94.png")',
      }}>
      <div className="min-h-screen bg-gradient-to-b from-transparent via-black/75 to-black/75 backdrop-blur-sm">
        <div className="container mx-auto px-4 pt-16">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">Video Analysis</h1>
          
          <div className="max-w-7xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {showRecorder && (
                  <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Record Your Video</h2>
                    <div className="flex-grow">
                      <VideoRecorder onAnalyzeVideo={handleAnalyzeVideo} />
                    </div>
                  </div>
                )}

                {showTeleprompter && (
                  <div className="flex flex-col space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Workout Script</h2>
                    <div className="flex-grow">
                      <Teleprompter 
                        script={workoutScript || "No workout script available. Please generate a workout first."}
                        onPositionChange={setTeleprompterPosition}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analysisResult && (
              <div className="bg-black/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold text-white mb-4">Analysis Results</h2>
                <div className="text-white whitespace-pre-wrap">
                  {analysisResult}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};