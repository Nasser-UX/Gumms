import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Lang = "ar" | "en";
type Role = "admin" | "editor" | "reviewer" | "viewer";

const I18N = {
  ar: {
    search: "بحث",
    searchPlaceholder: "ابحث باسم الخدمة أو الرمز...",
    quickActions: "إجراءات سريعة",
    createService: "إنشاء خدمة",
    recentActivity: "النشاط الأخير",
    emptyActivity: "لا يوجد نشاط بعد.",
    manuals: "الأدلة",
    reviewQueue: "قائمة المراجعة",
    searchManuals: "البحث عن الأدلة",
    services: "الخدمات",
    cards: {
      draft: "مسودات",
      underReview: "قيد المراجعة",
      approved: "معتمد",
      published: "منشور",
    },
  },
  en: {
    search: "Search",
    searchPlaceholder: "Search by service name or code...",
    quickActions: "Quick Actions",
    createService: "Create Service",
    recentActivity: "Recent activity",
    emptyActivity: "No activity yet.",
    manuals: "Manuals",
    reviewQueue: "Review Queue",
    searchManuals: "Search Manuals",
    services: "Services",
    cards: {
      draft: "Draft",
      underReview: "Under Review",
      approved: "Approved",
      published: "Published",
    },
  },
} as const;

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{title}</div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const lang: Lang = "ar"; // TODO: get from context
  const role: Role = "admin"; // TODO: get from context
  const t = I18N[lang];

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.search}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder={t.searchPlaceholder}
            className="sm:max-w-md"
            aria-label={t.searchPlaceholder}
          />
          <div className="flex gap-2">
            <Button>{t.search}</Button>
            {role === "admin" && (
              <Button variant="secondary">{t.createService}</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title={t.cards.draft} value="12" />
        <KpiCard title={t.cards.underReview} value="5" />
        <KpiCard title={t.cards.approved} value="3" />
        <KpiCard title={t.cards.published} value="28" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.quickActions}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>{t.manuals}</Button>
          {(role === "reviewer" || role === "admin") && (
            <Button variant="secondary">{t.reviewQueue}</Button>
          )}
          <Button variant="outline">{t.searchManuals}</Button>
          {role === "admin" && <Button variant="outline">{t.services}</Button>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.recentActivity}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t.emptyActivity}
        </CardContent>
      </Card>
    </>
  );
}
