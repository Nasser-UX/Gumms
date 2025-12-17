import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Lang = 'ar' | 'en';
type BeneficiaryType = 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT_ENTITY';
type StepScope = 'SHARED' | 'BENEFICIARY';

export interface StepImage {
  id: string;
  url: string;
  altTextAr: string;
  altTextEn: string;
}

export interface ManualStep {
  id: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
  scope: StepScope;
  beneficiaryType?: BeneficiaryType;
  order: number;
  images: StepImage[];
}

export interface ManualData {
  titleAr: string;
  titleEn: string;
  overviewAr: string;
  overviewEn: string;
  selectedBeneficiaries: BeneficiaryType[];
  steps: ManualStep[];
}

interface PreviewPaneProps {
  manualData: ManualData;
  lang: Lang;
  previewLang: Lang;
  onPreviewLangChange: (lang: Lang) => void;
}

export function PreviewPane({ manualData, lang, previewLang, onPreviewLangChange }: PreviewPaneProps) {
  const i18n = {
    ar: {
      preview: 'معاينة',
      language: 'اللغة',
      arabic: 'العربية',
      english: 'English',
      overview: 'نظرة عامة',
      steps: 'الخطوات',
      individual: 'فرد',
      business: 'منشأة',
      government: 'جهة حكومية',
      sharedSteps: 'الخطوات المشتركة',
      step: 'خطوة',
      noSteps: 'لا توجد خطوات بعد',
    },
    en: {
      preview: 'Preview',
      language: 'Language',
      arabic: 'العربية',
      english: 'English',
      overview: 'Overview',
      steps: 'Steps',
      individual: 'Individual',
      business: 'Business',
      government: 'Government Entity',
      sharedSteps: 'Shared Steps',
      step: 'Step',
      noSteps: 'No steps yet',
    },
  };

  const t = i18n[lang];

  const title = previewLang === 'ar' ? manualData.titleAr : manualData.titleEn;
  const overview = previewLang === 'ar' ? manualData.overviewAr : manualData.overviewEn;

  const sharedSteps = manualData.steps.filter((s) => s.scope === 'SHARED');
  const individualSteps = manualData.steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'INDIVIDUAL');
  const businessSteps = manualData.steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'BUSINESS');
  const governmentSteps = manualData.steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'GOVERNMENT_ENTITY');

  const renderSteps = (steps: ManualStep[], sectionTitle?: string) => {
    if (steps.length === 0) return null;

    return (
      <div className="space-y-3">
        {sectionTitle && <h3 className="font-semibold text-sm text-muted-foreground">{sectionTitle}</h3>}
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => {
            const stepTitle = previewLang === 'ar' ? step.titleAr : step.titleEn;
            const stepBody = previewLang === 'ar' ? step.bodyAr : step.bodyEn;

            return (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {t.step} {index + 1}
                    </Badge>
                    <span>{stepTitle || 'Untitled'}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <p className="text-sm whitespace-pre-wrap">{stepBody}</p>
                    {step.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {step.images.map((img) => (
                          <div key={img.id} className="space-y-2">
                            <img
                              src={img.url}
                              alt={previewLang === 'ar' ? img.altTextAr : img.altTextEn}
                              className="w-full rounded border"
                            />
                            <p className="text-xs text-muted-foreground">
                              {previewLang === 'ar' ? img.altTextAr : img.altTextEn}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  const renderBeneficiaryContent = (beneficiaryType: BeneficiaryType) => {
    let beneficiarySteps: ManualStep[] = [];
    
    switch (beneficiaryType) {
      case 'INDIVIDUAL':
        beneficiarySteps = individualSteps;
        break;
      case 'BUSINESS':
        beneficiarySteps = businessSteps;
        break;
      case 'GOVERNMENT_ENTITY':
        beneficiarySteps = governmentSteps;
        break;
    }

    const allSteps = [...sharedSteps, ...beneficiarySteps];

    return (
      <div className="space-y-6" dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
        <div>
          <h2 className="text-xl font-bold mb-2">{title || 'Untitled Manual'}</h2>
          <div className="text-sm text-muted-foreground mb-4">{t.overview}</div>
          <p className="text-sm whitespace-pre-wrap">{overview}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">{t.steps}</h3>
          {allSteps.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.noSteps}</p>
          ) : (
            <>
              {sharedSteps.length > 0 && renderSteps(sharedSteps, t.sharedSteps)}
              {beneficiarySteps.length > 0 && (
                <div className="mt-6">
                  {renderSteps(beneficiarySteps)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t.preview}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t.language}:</span>
            <Button
              variant={previewLang === 'ar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewLangChange('ar')}
            >
              {t.arabic}
            </Button>
            <Button
              variant={previewLang === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPreviewLangChange('en')}
            >
              {t.english}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 rounded-lg p-6 max-h-[600px] overflow-auto">
          {manualData.selectedBeneficiaries.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {lang === 'ar'
                ? 'الرجاء تحديد نوع مستفيد واحد على الأقل لمعاينة الدليل'
                : 'Please select at least one beneficiary type to preview the manual'}
            </p>
          ) : manualData.selectedBeneficiaries.length === 1 ? (
            renderBeneficiaryContent(manualData.selectedBeneficiaries[0])
          ) : (
            <Tabs defaultValue={manualData.selectedBeneficiaries[0]} className="w-full">
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${manualData.selectedBeneficiaries.length}, 1fr)` }}>
                {manualData.selectedBeneficiaries.map((beneficiary) => (
                  <TabsTrigger key={beneficiary} value={beneficiary}>
                    {t[beneficiary.toLowerCase() as 'individual' | 'business' | 'government']}
                  </TabsTrigger>
                ))}
              </TabsList>
              {manualData.selectedBeneficiaries.map((beneficiary) => (
                <TabsContent key={beneficiary} value={beneficiary} className="mt-6">
                  {renderBeneficiaryContent(beneficiary)}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
