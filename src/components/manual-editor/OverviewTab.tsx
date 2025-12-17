import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Lang = 'ar' | 'en';

interface OverviewTabProps {
  titleAr: string;
  titleEn: string;
  overviewAr: string;
  overviewEn: string;
  onUpdate: (field: 'titleAr' | 'titleEn' | 'overviewAr' | 'overviewEn', value: string) => void;
  lang: Lang;
}

export function OverviewTab({ titleAr, titleEn, overviewAr, overviewEn, onUpdate, lang }: OverviewTabProps) {
  const i18n = {
    ar: {
      arabic: 'العربية',
      english: 'الإنجليزية',
      title: 'عنوان الدليل',
      overview: 'نظرة عامة',
    },
    en: {
      arabic: 'Arabic',
      english: 'English',
      title: 'Manual Title',
      overview: 'Overview',
    },
  };

  const t = i18n[lang];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="ar" className="w-full">
        <TabsList>
          <TabsTrigger value="ar">{t.arabic}</TabsTrigger>
          <TabsTrigger value="en">{t.english}</TabsTrigger>
        </TabsList>

        <TabsContent value="ar" className="space-y-4">
          <div>
            <Label htmlFor="title-ar">{t.title}</Label>
            <Input
              id="title-ar"
              value={titleAr}
              onChange={(e) => onUpdate('titleAr', e.target.value)}
              placeholder="أدخل عنوان الدليل بالعربية"
              dir="rtl"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="overview-ar">{t.overview}</Label>
            <textarea
              id="overview-ar"
              value={overviewAr}
              onChange={(e) => onUpdate('overviewAr', e.target.value)}
              placeholder="أدخل نظرة عامة عن الخدمة بالعربية"
              dir="rtl"
              className="mt-2 w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </TabsContent>

        <TabsContent value="en" className="space-y-4">
          <div>
            <Label htmlFor="title-en">{t.title}</Label>
            <Input
              id="title-en"
              value={titleEn}
              onChange={(e) => onUpdate('titleEn', e.target.value)}
              placeholder="Enter manual title in English"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="overview-en">{t.overview}</Label>
            <textarea
              id="overview-en"
              value={overviewEn}
              onChange={(e) => onUpdate('overviewEn', e.target.value)}
              placeholder="Enter service overview in English"
              className="mt-2 w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
