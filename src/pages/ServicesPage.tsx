import * as React from "react";
import axios from "axios";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateServiceModal from "@/components/CreateServiceModal";

type Lang = "ar" | "en";
type Role = "admin" | "editor" | "reviewer" | "viewer";

const I18N = {
  ar: {
    services: "الخدمات",
    createService: "إنشاء خدمة",
    search: "بحث",
    searchPlaceholder: "ابحث برمز أو اسم الخدمة...",
    code: "الرمز",
    nameAr: "الاسم (عربي)",
    nameEn: "الاسم (إنجليزي)",
    createdAt: "تاريخ الإنشاء",
    actions: "الإجراءات",
    loading: "جاري التحميل...",
    error: "خطأ في تحميل الخدمات",
    noServices: "لا توجد خدمات",
    retry: "إعادة المحاولة",
    success: "تم إنشاء الخدمة بنجاح",
  },
  en: {
    services: "Services",
    createService: "Create Service",
    search: "Search",
    searchPlaceholder: "Search by code or name...",
    code: "Code",
    nameAr: "Name (Arabic)",
    nameEn: "Name (English)",
    createdAt: "Created At",
    actions: "Actions",
    loading: "Loading...",
    error: "Error loading services",
    noServices: "No services found",
    retry: "Retry",
    success: "Service created successfully",
  },
} as const;

interface Service {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  createdAt: string;
}

// Mock data for development (when backend is not available)
const MOCK_SERVICES: Service[] = [
  {
    id: "1",
    code: "SRV-001",
    nameAr: "خدمة تجديد الرخصة",
    nameEn: "License Renewal Service",
    createdAt: "2024-12-01T10:00:00Z",
  },
  {
    id: "2",
    code: "SRV-002",
    nameAr: "خدمة إصدار جواز السفر",
    nameEn: "Passport Issuance Service",
    createdAt: "2024-12-05T14:30:00Z",
  },
  {
    id: "3",
    code: "SRV-003",
    nameAr: "خدمة التسجيل التجاري",
    nameEn: "Commercial Registration Service",
    createdAt: "2024-12-10T09:15:00Z",
  },
  {
    id: "4",
    code: "SRV-004",
    nameAr: "خدمة الاستعلام عن المخالفات",
    nameEn: "Traffic Violations Inquiry Service",
    createdAt: "2024-12-12T16:45:00Z",
  },
  {
    id: "5",
    code: "SRV-005",
    nameAr: "خدمة طلب تصريح البناء",
    nameEn: "Building Permit Request Service",
    createdAt: "2024-12-15T11:20:00Z",
  },
];

// Development mode flag - set to true to use mock data
const USE_MOCK_DATA = true;

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  );
}

export default function ServicesPage() {
  const lang: Lang = "ar"; // TODO: get from context
  const role: Role = "admin"; // TODO: get from context
  const t = I18N[lang];

  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [toast, setToast] = React.useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch services
  const fetchServices = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setServices(MOCK_SERVICES);
      } else {
        const response = await api.get<Service[]>("/services");
        setServices(response.data);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          setError("Cannot connect to server. Using mock data for development.");
          // Fallback to mock data if network error
          setServices(MOCK_SERVICES);
        } else {
          setError(err.response?.data?.message || err.message);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch services");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Filter services
  const filteredServices = React.useMemo(() => {
    if (!searchQuery) return services;
    const query = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.code.toLowerCase().includes(query) ||
        s.nameAr.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query)
    );
  }, [services, searchQuery]);

  // Handle successful service creation
  const handleServiceCreated = () => {
    showToast(t.success, "success");
    fetchServices();
  };

  // Handle service creation error
  const handleServiceError = (errorMessage: string) => {
    showToast(errorMessage, "error");
  };

  // Show toast
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US");
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-lg p-4 shadow-lg ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {toast.message}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>{t.services}</CardTitle>
            {role === "admin" && (
              <Button onClick={() => setIsDialogOpen(true)}>
                {t.createService}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-2">
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* Loading state */}
          {loading && <LoadingSkeleton />}

          {/* Error state */}
          {error && !loading && (
            <div className="text-center py-8 space-y-4">
              <p className="text-destructive">{t.error}</p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={fetchServices} variant="outline">
                {t.retry}
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredServices.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t.noServices}</p>
            </div>
          )}

          {/* Services table */}
          {!loading && !error && filteredServices.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.code}</TableHead>
                  <TableHead>{t.nameAr}</TableHead>
                  <TableHead>{t.nameEn}</TableHead>
                  <TableHead>{t.createdAt}</TableHead>
                  <TableHead>{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.code}</TableCell>
                    <TableCell>{service.nameAr}</TableCell>
                    <TableCell>{service.nameEn}</TableCell>
                    <TableCell>{formatDate(service.createdAt)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Service Modal */}
      <CreateServiceModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleServiceCreated}
        onError={handleServiceError}
        lang={lang}
      />
    </>
  );
}
