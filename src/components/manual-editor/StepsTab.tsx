import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { StepCardComponent } from './StepCardComponent';

type BeneficiaryType = 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT_ENTITY';
type StepScope = 'SHARED' | 'BENEFICIARY';
type Lang = 'ar' | 'en';

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

interface StepsTabProps {
  selectedBeneficiaries: BeneficiaryType[];
  onBeneficiaryToggle: (type: BeneficiaryType) => void;
  steps: ManualStep[];
  onAddStep: (scope: StepScope, beneficiaryType?: BeneficiaryType) => void;
  onUpdateStep: (stepId: string, updates: Partial<ManualStep>) => void;
  onDeleteStep: (stepId: string) => void;
  onReorderSteps: (stepId: string, direction: 'up' | 'down') => void;
  lang: Lang;
}

export function StepsTab({
  selectedBeneficiaries,
  onBeneficiaryToggle,
  steps,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onReorderSteps,
  lang,
}: StepsTabProps) {
  const i18n = {
    ar: {
      beneficiaries: 'المستفيدون',
      individual: 'فرد',
      business: 'منشأة',
      government: 'جهة حكومية',
      sharedSteps: 'الخطوات المشتركة',
      addSharedStep: 'إضافة خطوة مشتركة',
      individualSteps: 'خطوات الأفراد',
      addIndividualStep: 'إضافة خطوة للأفراد',
      businessSteps: 'خطوات المنشآت',
      addBusinessStep: 'إضافة خطوة للمنشآت',
      governmentSteps: 'خطوات الجهات الحكومية',
      addGovernmentStep: 'إضافة خطوة للجهات الحكومية',
      noSteps: 'لا توجد خطوات بعد',
    },
    en: {
      beneficiaries: 'Beneficiaries',
      individual: 'Individual',
      business: 'Business',
      government: 'Government Entity',
      sharedSteps: 'Shared Steps',
      addSharedStep: 'Add Shared Step',
      individualSteps: 'Individual Steps',
      addIndividualStep: 'Add Individual Step',
      businessSteps: 'Business Steps',
      addBusinessStep: 'Add Business Step',
      governmentSteps: 'Government Entity Steps',
      addGovernmentStep: 'Add Government Step',
      noSteps: 'No steps yet',
    },
  };

  const t = i18n[lang];

  const sharedSteps = steps.filter((s) => s.scope === 'SHARED');
  const individualSteps = steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'INDIVIDUAL');
  const businessSteps = steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'BUSINESS');
  const governmentSteps = steps.filter((s) => s.scope === 'BENEFICIARY' && s.beneficiaryType === 'GOVERNMENT_ENTITY');

  const renderStepList = (stepsList: ManualStep[], title: string, onAdd: () => void, addButtonLabel: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={onAdd} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {addButtonLabel}
        </Button>
      </div>
      {stepsList.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.noSteps}</p>
      ) : (
        <div className="space-y-3">
          {stepsList.map((step, index) => (
            <StepCardComponent
              key={step.id}
              step={step}
              index={index}
              total={stepsList.length}
              onEdit={(updates) => onUpdateStep(step.id, updates)}
              onDelete={() => onDeleteStep(step.id)}
              onMoveUp={() => onReorderSteps(step.id, 'up')}
              onMoveDown={() => onReorderSteps(step.id, 'down')}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <Label className="text-base font-semibold">{t.beneficiaries}</Label>
        <div className="mt-3 space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="individual"
              checked={selectedBeneficiaries.includes('INDIVIDUAL')}
              onCheckedChange={() => onBeneficiaryToggle('INDIVIDUAL')}
            />
            <label htmlFor="individual" className="text-sm font-medium cursor-pointer">
              {t.individual}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="business"
              checked={selectedBeneficiaries.includes('BUSINESS')}
              onCheckedChange={() => onBeneficiaryToggle('BUSINESS')}
            />
            <label htmlFor="business" className="text-sm font-medium cursor-pointer">
              {t.business}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="government"
              checked={selectedBeneficiaries.includes('GOVERNMENT_ENTITY')}
              onCheckedChange={() => onBeneficiaryToggle('GOVERNMENT_ENTITY')}
            />
            <label htmlFor="government" className="text-sm font-medium cursor-pointer">
              {t.government}
            </label>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        {renderStepList(sharedSteps, t.sharedSteps, () => onAddStep('SHARED'), t.addSharedStep)}
      </div>

      {selectedBeneficiaries.includes('INDIVIDUAL') && (
        <div className="border-t pt-6">
          {renderStepList(
            individualSteps,
            t.individualSteps,
            () => onAddStep('BENEFICIARY', 'INDIVIDUAL'),
            t.addIndividualStep
          )}
        </div>
      )}

      {selectedBeneficiaries.includes('BUSINESS') && (
        <div className="border-t pt-6">
          {renderStepList(
            businessSteps,
            t.businessSteps,
            () => onAddStep('BENEFICIARY', 'BUSINESS'),
            t.addBusinessStep
          )}
        </div>
      )}

      {selectedBeneficiaries.includes('GOVERNMENT_ENTITY') && (
        <div className="border-t pt-6">
          {renderStepList(
            governmentSteps,
            t.governmentSteps,
            () => onAddStep('BENEFICIARY', 'GOVERNMENT_ENTITY'),
            t.addGovernmentStep
          )}
        </div>
      )}
    </div>
  );
}
