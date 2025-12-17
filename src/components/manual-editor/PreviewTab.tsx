import React from 'react';
import { PreviewPane } from './PreviewPane';

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

interface PreviewTabProps {
  manualData: ManualData;
  lang: Lang;
  previewLang: Lang;
  onPreviewLangChange: (lang: Lang) => void;
}

export function PreviewTab({ manualData, lang, previewLang, onPreviewLangChange }: PreviewTabProps) {
  return (
    <div className="space-y-4">
      <PreviewPane
        manualData={manualData}
        lang={lang}
        previewLang={previewLang}
        onPreviewLangChange={onPreviewLangChange}
      />
    </div>
  );
}
