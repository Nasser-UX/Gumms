import * as React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Lang = "ar" | "en";
type Role = "admin" | "editor" | "reviewer" | "viewer";

const I18N = {
  ar: {
    appName: "GUMMS",
    poc: "إثبات مفهوم",
    dashboard: "لوحة التحكم",
    services: "الخدمات",
    manuals: "الأدلة",
    reviewQueue: "قائمة المراجعة",
    searchManuals: "البحث عن الأدلة",
    auditLog: "سجل التدقيق",
    language: "اللغة",
    role: "الدور",
    notifications: "الإشعارات",
    account: "الحساب",
  },
  en: {
    appName: "GUMMS",
    poc: "Proof of Concept",
    dashboard: "Dashboard",
    services: "Services",
    manuals: "Manuals",
    reviewQueue: "Review Queue",
    searchManuals: "Search Manuals",
    auditLog: "Audit Log",
    language: "Language",
    role: "Role",
    notifications: "Notifications",
    account: "Account",
  },
} as const;

function NavItem({
  label,
  to,
  active,
}: {
  label: string;
  to: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "block w-full rounded-md px-3 py-2 text-start text-sm transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

export default function MainLayout() {
  const [lang, setLang] = React.useState<Lang>("ar");
  const [role, setRole] = React.useState<Role>("admin");
  const location = useLocation();
  const t = I18N[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";

  const nav = [
    { label: t.dashboard, to: "/", show: true },
    { label: t.services, to: "/services", show: role === "admin" },
    { label: t.manuals, to: "/manuals", show: true },
    { label: t.reviewQueue, to: "/review", show: role === "reviewer" || role === "admin" },
    { label: t.searchManuals, to: "/search", show: true },
    { label: t.auditLog, to: "/audit", show: role === "admin" },
  ].filter((x) => x.show);

  return (
    <div dir={dir} className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">G</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">{t.appName}</div>
              <div className="text-xs text-muted-foreground">{t.poc}</div>
            </div>
          </Link>

          <div className="flex-1" />

          {/* Language */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                {t.language}: {lang.toUpperCase()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
              <DropdownMenuItem onClick={() => setLang("ar")}>AR (RTL)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>EN (LTR)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Role (PoC) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                {t.role}: {role}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === "rtl" ? "start" : "end"}>
              <DropdownMenuItem onClick={() => setRole("admin")}>admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("editor")}>editor</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("reviewer")}>reviewer</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("viewer")}>viewer</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" variant="outline">
            {t.notifications}
            <Badge className={cn(dir === "rtl" ? "mr-2" : "ml-2")} variant="secondary">
              3
            </Badge>
          </Button>

          <Button size="sm" variant="ghost">
            {t.account}
          </Button>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <aside className="h-fit rounded-lg border bg-card">
          <div className="p-3">
            <div className="text-sm font-semibold">{t.dashboard}</div>
            <div className="text-xs text-muted-foreground">
              {lang === "ar" ? "تطبيق واحد بأدوار متعددة" : "Single app with role-based views"}
            </div>
          </div>
          <Separator />
          <nav className="p-2 space-y-1">
            {nav.map((x) => (
              <NavItem
                key={x.to}
                label={x.label}
                to={x.to}
                active={location.pathname === x.to}
              />
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
