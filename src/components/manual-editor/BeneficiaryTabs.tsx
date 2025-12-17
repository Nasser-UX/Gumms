import * as React from "react";
import { Button } from "@/components/ui/button";

interface BeneficiaryTabsProps {
  activeTab: "individual" | "business";
  onTabChange: (tab: "individual" | "business") => void;
}

export default function BeneficiaryTabs({ activeTab, onTabChange }: BeneficiaryTabsProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      <Button
        variant={activeTab === "individual" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("individual")}
      >
        Individual
      </Button>
      <Button
        variant={activeTab === "business" ? "default" : "ghost"}
        size="sm"
        onClick={() => onTabChange("business")}
      >
        Business
      </Button>
    </div>
  );
}
