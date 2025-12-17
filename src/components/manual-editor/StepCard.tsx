import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUpload from "./ImageUpload";
import { Trash2 } from "lucide-react";

interface Step {
  id: string;
  order: number;
  title: string;
  description: string;
  imageUrl?: string;
}

interface StepCardProps {
  step: Step;
  onUpdate: (stepId: string, updates: Partial<Step>) => void;
  onDelete: (stepId: string) => void;
}

export default function StepCard({ step, onUpdate, onDelete }: StepCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
            {step.order}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`step-title-${step.id}`}>Step Title</Label>
              <Input
                id={`step-title-${step.id}`}
                value={step.title}
                onChange={(e) => onUpdate(step.id, { title: e.target.value })}
                placeholder="Enter step title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`step-description-${step.id}`}>Description</Label>
              <textarea
                id={`step-description-${step.id}`}
                value={step.description}
                onChange={(e) => onUpdate(step.id, { description: e.target.value })}
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Enter step description"
              />
            </div>

            <ImageUpload
              imageUrl={step.imageUrl}
              onImageChange={(url) => onUpdate(step.id, { imageUrl: url })}
            />
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(step.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
