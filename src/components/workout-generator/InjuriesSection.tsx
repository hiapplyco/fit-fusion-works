import { HeartPulse, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadSection } from "./FileUploadSection";
import { TooltipWrapper } from "./TooltipWrapper";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface InjuriesSectionProps {
  injuries: string;
  setInjuries: (value: string) => void;
  isAnalyzingInjuries: boolean;
  handleInjuriesFileSelect: (file: File) => Promise<void>;
}

export function InjuriesSection({
  injuries,
  setInjuries,
  isAnalyzingInjuries,
  handleInjuriesFileSelect
}: InjuriesSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = () => {
    setInjuries("");
  };

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen} 
      className="collapsible-section"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-primary" />
          <h3 className="font-oswald text-lg">Any Injuries or Health Considerations?</h3>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="hover:bg-transparent hover:underline p-2"
            >
              <span className="sr-only">Toggle Injuries Section</span>
            </Button>
          </CollapsibleTrigger>
          <TooltipWrapper content="Share any injuries, medical conditions, or movement limitations that may affect your workout" />
        </div>
        {injuries && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CollapsibleContent className="space-y-4 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <Textarea
              placeholder="List any injuries, medical conditions, or movement limitations"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              className="min-h-[100px] base-input"
            />
          </div>
          <div className="col-span-1">
            <FileUploadSection
              title="Upload Medical Information"
              isAnalyzing={isAnalyzingInjuries}
              content={injuries}
              onFileSelect={handleInjuriesFileSelect}
              analysisSteps={["Processing file", "Extracting information", "Analyzing content"]}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}