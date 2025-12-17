import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { StepEditorModal } from './StepEditorModal';

type Lang = 'ar' | 'en';
type StepScope = 'SHARED' | 'BENEFICIARY';
type BeneficiaryType = 'INDIVIDUAL' | 'BUSINESS' | 'GOVERNMENT_ENTITY';

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

interface StepCardComponentProps {
  step: ManualStep;
  index: number;
  total: number;
  onEdit: (updates: Partial<ManualStep>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  lang: Lang;
}

export function StepCardComponent({
  step,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  lang,
}: StepCardComponentProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const i18n = {
    ar: {
      step: 'خطوة',
      shared: 'مشتركة',
      individual: 'فرد',
      business: 'منشأة',
      government: 'جهة حكومية',
      edit: 'تعديل',
      delete: 'حذف',
      moveUp: 'تحريك لأعلى',
      moveDown: 'تحريك لأسفل',
      images: 'صور',
    },
    en: {
      step: 'Step',
      shared: 'Shared',
      individual: 'Individual',
      business: 'Business',
      government: 'Government',
      edit: 'Edit',
      delete: 'Delete',
      moveUp: 'Move Up',
      moveDown: 'Move Down',
      images: 'images',
    },
  };

  const t = i18n[lang];

  const getBeneficiaryLabel = () => {
    if (step.scope === 'SHARED') return t.shared;
    switch (step.beneficiaryType) {
      case 'INDIVIDUAL':
        return t.individual;
      case 'BUSINESS':
        return t.business;
      case 'GOVERNMENT_ENTITY':
        return t.government;
      default:
        return '';
    }
  };

  const title = lang === 'ar' ? step.titleAr : step.titleEn;
  const body = lang === 'ar' ? step.bodyAr : step.bodyEn;

  return (
    <>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {t.step} {index + 1}
              </Badge>
              <Badge variant="secondary">{getBeneficiaryLabel()}</Badge>
              {step.images.length > 0 && (
                <Badge variant="outline" className="gap-1">
                  <ImageIcon className="h-3 w-3" />
                  {step.images.length} {t.images}
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-sm mb-1 truncate">{title || 'Untitled'}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{body}</p>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsEditModalOpen(true)} title={t.edit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} title={t.delete}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveUp}
                disabled={index === 0}
                title={t.moveUp}
                className="h-6 w-6 p-0"
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveDown}
                disabled={index === total - 1}
                title={t.moveDown}
                className="h-6 w-6 p-0"
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <StepEditorModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        step={step}
        onSave={(updates) => {
          onEdit(updates);
          setIsEditModalOpen(false);
        }}
        lang={lang}
      />
    </>
  );
}
