import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StepCard from "./StepCard";
import { Plus } from "lucide-react";

interface StepsSectionProps {
  beneficiaryType: "individual" | "business";
}

interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
}

export default function StepsSection({ beneficiaryType }: StepsSectionProps) {
  const [steps, setSteps] = React.useState<Step[]>([
    {
      id: "1",
      order: 1,
      title: "Step 1",
      description: "",
    },
  ]);

  const handleAddStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      order: steps.length + 1,
      title: `Step ${steps.length + 1}`,
      description: "",
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (stepId: string) => {
    setSteps(steps.filter((step) => step.id !== stepId));
  };

  const handleUpdateStep = (stepId: string, updates: Partial<Step>) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Steps - {beneficiaryType === "individual" ? "Individual" : "Business"}
        </CardTitle>
        <Button size="sm" onClick={handleAddStep}>
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step) => (
          <StepCard
            key={step.id}
            step={step}
            onUpdate={handleUpdateStep}
            onDelete={handleDeleteStep}
          />
        ))}
      </CardContent>
    </Card>
  );
}
