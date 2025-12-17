import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OverviewTab } from "@/components/manual-editor/OverviewTab";
import { StepsTab } from "@/components/manual-editor/StepsTab";
import { PreviewTab } from "@/components/manual-editor/PreviewTab";
import ExportPdfButton from "@/components/manual-editor/ExportPdfButton";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type BeneficiaryType = "INDIVIDUAL" | "BUSINESS" | "GOVERNMENT_ENTITY";
export type StepScope = "SHARED" | "BENEFICIARY";
export type Lang = "ar" | "en";

export interface StepImage {
  id: string;
  url: string;
  altAr?: string;
  altEn?: string;
}

export interface ManualStep {
  id: string;
  scope: StepScope;
  beneficiaryType: BeneficiaryType | null;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  orderIndex: number;
  images: StepImage[];
}

export interface ManualData {
  id?: string;
  titleAr: string;
  titleEn: string;
  overviewAr: string;
  overviewEn: string;
  selectedBeneficiaries: BeneficiaryType[];
  steps: ManualStep[];
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
  version: string;
}

const I18N = {
  ar: {
    manualEditor: "محرر الدليل",
    newManual: "دليل جديد",
    back: "رجوع",
    save: "حفظ",
    preview: "معاينة",
    saving: "جاري الحفظ...",
    overview: "نظرة عامة",
    steps: "الخطوات",
    previewTab: "معاينة",
    status: {
      DRAFT: "مسودة",
      REVIEW: "قيد المراجعة",
      PUBLISHED: "منشور",
    },
    manualTitle: "عنوان الدليل",
    version: "الإصدار",
    draftSaved: "تم حفظ المسودة تلقائياً",
    draftLoaded: "تم تحميل المسودة المحفوظة",
  },
  en: {
    manualEditor: "Manual Editor",
    newManual: "New Manual",
    back: "Back",
    save: "Save",
    preview: "Preview",
    saving: "Saving...",
    overview: "Overview",
    steps: "Steps",
    previewTab: "Preview",
    status: {
      DRAFT: "Draft",
      REVIEW: "Under Review",
      PUBLISHED: "Published",
    },
    manualTitle: "Manual Title",
    version: "Version",
    draftSaved: "Draft auto-saved",
    draftLoaded: "Draft loaded from auto-save",
  },
} as const;

const DRAFT_KEY = "manual-draft";

export default function ManualEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lang, setLang] = React.useState<Lang>("ar");
  const [previewLang, setPreviewLang] = React.useState<Lang>("ar");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const t = I18N[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  // Manual data state
  const [manualData, setManualData] = React.useState<ManualData>({
    titleAr: "",
    titleEn: "",
    overviewAr: "",
    overviewEn: "",
    selectedBeneficiaries: [],
    steps: [],
    status: "DRAFT",
    version: "1.0",
  });

  // Load draft from localStorage on mount
  React.useEffect(() => {
    if (!id) {
      // Only load draft for new manuals (not when editing existing ones)
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          setManualData(draft);
          toast({
            title: t.draftLoaded,
            description: `${lang === "ar" ? "آخر تحديث" : "Last updated"}: ${new Date(
              draft.updatedAt
            ).toLocaleString(lang === "ar" ? "ar-SA" : "en-US")}`,
          });
        } catch (error) {
          console.error("Failed to load draft:", error);
          localStorage.removeItem(DRAFT_KEY);
        }
      }
    }
    setIsInitialized(true);
  }, [id]);

  // Auto-save draft to localStorage
  React.useEffect(() => {
    if (!isInitialized || id) return; // Don't auto-save when editing existing manual

    const timeoutId = setTimeout(() => {
      const draft = {
        ...manualData,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    }, 1000); // Debounce by 1 second

    return () => clearTimeout(timeoutId);
  }, [
    manualData.titleAr,
    manualData.titleEn,
    manualData.overviewAr,
    manualData.overviewEn,
    manualData.selectedBeneficiaries,
    manualData.steps,
    isInitialized,
    id,
  ]);

  // Load manual data if editing
  React.useEffect(() => {
    if (id) {
      // TODO: Fetch manual data from API
      console.log("Loading manual:", id);
    }
  }, [id]);

  // Update manual data
  const updateManualData = (updates: Partial<ManualData>) => {
    setManualData((prev) => ({ ...prev, ...updates }));
  };

  // Update specific step
  const updateStep = (stepId: string, updates: Partial<ManualStep>) => {
    setManualData((prev) => ({
      ...prev,
      steps: prev.steps.map((step) =>
        step.id === stepId ? { ...step, ...updates } : step
      ),
    }));
  };

  // Add new step
  const addStep = (scope: StepScope, beneficiaryType: BeneficiaryType | null) => {
    const newStep: ManualStep = {
      id: Date.now().toString(),
      scope,
      beneficiaryType,
      titleAr: "",
      titleEn: "",
      bodyAr: "",
      bodyEn: "",
      orderIndex: manualData.steps.filter(
        (s) => s.scope === scope && s.beneficiaryType === beneficiaryType
      ).length,
      images: [],
    };
    setManualData((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
    }));
  };

  // Delete step
  const deleteStep = (stepId: string) => {
    setManualData((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
    }));
  };

  // Reorder steps
  const reorderSteps = (
    scope: StepScope,
    beneficiaryType: BeneficiaryType | null,
    newOrder: string[]
  ) => {
    setManualData((prev) => {
      const updatedSteps = prev.steps.map((step) => {
        if (step.scope === scope && step.beneficiaryType === beneficiaryType) {
          const newIndex = newOrder.indexOf(step.id);
          return newIndex !== -1 ? { ...step, orderIndex: newIndex } : step;
        }
        return step;
      });
      return { ...prev, steps: updatedSteps };
    });
  };

  // Handle save
  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Save to API
      console.log("Saving manual:", manualData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Clear auto-saved draft after successful save
      if (!id) {
        localStorage.removeItem(DRAFT_KEY);
      }
      
      toast({
        title: lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully",
        description: lang === "ar" ? "تم حفظ الدليل بنجاح" : "Manual saved successfully",
      });
    } catch (error) {
      console.error("Failed to save manual:", error);
      toast({
        variant: "destructive",
        title: lang === "ar" ? "فشل الحفظ" : "Save failed",
        description: lang === "ar" ? "حدث خطأ أثناء حفظ الدليل" : "Failed to save manual",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div dir={dir} className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/manuals")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.back}
            </Button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>
                  {id ? `${t.manualEditor} #${id}` : t.newManual}
                </CardTitle>
                <Badge
                  variant={
                    manualData.status === "PUBLISHED"
                      ? "default"
                      : manualData.status === "REVIEW"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {t.status[manualData.status]}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {t.version}: {manualData.version}
              </div>
            </div>

            <div className="flex gap-2">
              <ExportPdfButton
                manualData={manualData}
                lang={lang}
                previewLang={previewLang}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="h-4 w-4 mr-2" />
                {t.preview}
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? t.saving : t.save}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Manual Title Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titleAr">{t.manualTitle} (عربي)</Label>
              <Input
                id="titleAr"
                dir="rtl"
                value={manualData.titleAr}
                onChange={(e) => updateManualData({ titleAr: e.target.value })}
                placeholder="عنوان الدليل"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleEn">{t.manualTitle} (English)</Label>
              <Input
                id="titleEn"
                value={manualData.titleEn}
                onChange={(e) => updateManualData({ titleEn: e.target.value })}
                placeholder="Manual Title"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="steps">{t.steps}</TabsTrigger>
          <TabsTrigger value="preview">{t.previewTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <OverviewTab
            overviewAr={manualData.overviewAr}
            overviewEn={manualData.overviewEn}
            onUpdate={(overviewAr, overviewEn) =>
              updateManualData({ overviewAr, overviewEn })
            }
            lang={lang}
            onLangChange={setLang}
          />
        </TabsContent>

        <TabsContent value="steps" className="mt-4">
          <StepsTab
            selectedBeneficiaries={manualData.selectedBeneficiaries}
            steps={manualData.steps}
            onBeneficiaryToggle={(type) => {
              const isSelected = manualData.selectedBeneficiaries.includes(type);
              const newBeneficiaries = isSelected
                ? manualData.selectedBeneficiaries.filter((b) => b !== type)
                : [...manualData.selectedBeneficiaries, type];
              updateManualData({ selectedBeneficiaries: newBeneficiaries });
            }}
            onAddStep={addStep}
            onUpdateStep={updateStep}
            onDeleteStep={deleteStep}
            onReorderSteps={(stepId, direction) => {
              const stepIndex = manualData.steps.findIndex((s) => s.id === stepId);
              if (stepIndex === -1) return;
              
              const step = manualData.steps[stepIndex];
              const sameGroupSteps = manualData.steps.filter(
                (s) => s.scope === step.scope && s.beneficiaryType === step.beneficiaryType
              );
              const groupIndex = sameGroupSteps.findIndex((s) => s.id === stepId);
              
              if (
                (direction === 'up' && groupIndex === 0) ||
                (direction === 'down' && groupIndex === sameGroupSteps.length - 1)
              ) {
                return;
              }
              
              const newSteps = [...manualData.steps];
              const targetIndex = direction === 'up' 
                ? manualData.steps.indexOf(sameGroupSteps[groupIndex - 1])
                : manualData.steps.indexOf(sameGroupSteps[groupIndex + 1]);
              
              [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
              updateManualData({ steps: newSteps });
            }}
            lang={lang}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <PreviewTab
            manualData={manualData}
            lang={lang}
            onLangChange={(newLang) => {
              setLang(newLang);
              setPreviewLang(newLang);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
