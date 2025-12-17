import * as React from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Lang = "ar" | "en";

const I18N = {
  ar: {
    createServiceTitle: "إنشاء خدمة جديدة",
    createServiceDesc: "أدخل تفاصيل الخدمة الجديدة",
    serviceCode: "رمز الخدمة",
    serviceCodePlaceholder: "مثال: SRV-001",
    serviceCodeHelper: "أحرف وأرقام وشرطة، 3-20 حرف (بالأحرف الكبيرة)",
    nameAr: "الاسم (عربي)",
    nameEn: "الاسم (إنجليزي)",
    cancel: "إلغاء",
    submit: "إرسال",
    creating: "جاري الإنشاء...",
    validationErrors: {
      codeRequired: "رمز الخدمة مطلوب",
      codeInvalid: "الرمز يجب أن يكون بأحرف كبيرة، أرقام، أو شرطة فقط (3-20 حرف)",
      nameArRequired: "الاسم بالعربية مطلوب",
      nameArMaxLength: "الاسم بالعربية يجب ألا يتجاوز 255 حرف",
      nameEnRequired: "الاسم بالإنجليزية مطلوب",
      nameEnMaxLength: "الاسم بالإنجليزية يجب ألا يتجاوز 255 حرف",
    },
  },
  en: {
    createServiceTitle: "Create New Service",
    createServiceDesc: "Enter the details for the new service",
    serviceCode: "Service Code",
    serviceCodePlaceholder: "e.g., SRV-001",
    serviceCodeHelper: "Uppercase alphanumeric + hyphen, 3-20 chars",
    nameAr: "Name (Arabic)",
    nameEn: "Name (English)",
    cancel: "Cancel",
    submit: "Submit",
    creating: "Creating...",
    validationErrors: {
      codeRequired: "Service code is required",
      codeInvalid: "Code must be uppercase alphanumeric + hyphen only (3-20 chars)",
      nameArRequired: "Arabic name is required",
      nameArMaxLength: "Arabic name must not exceed 255 characters",
      nameEnRequired: "English name is required",
      nameEnMaxLength: "English name must not exceed 255 characters",
    },
  },
} as const;

interface CreateServiceData {
  code: string;
  nameAr: string;
  nameEn: string;
}

interface FormErrors {
  code?: string;
  nameAr?: string;
  nameEn?: string;
}

interface CreateServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onError: (error: string) => void;
  lang?: Lang;
}

export default function CreateServiceModal({
  open,
  onOpenChange,
  onSuccess,
  onError,
  lang = "ar",
}: CreateServiceModalProps) {
  const t = I18N[lang];
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState<CreateServiceData>({
    code: "",
    nameAr: "",
    nameEn: "",
  });
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

  // Reset form when modal closes
  React.useEffect(() => {
    if (!open) {
      setFormData({ code: "", nameAr: "", nameEn: "" });
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [open]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const codeRegex = /^[A-Z0-9-]{3,20}$/;

    // Validate code
    if (!formData.code.trim()) {
      errors.code = t.validationErrors.codeRequired;
    } else if (!codeRegex.test(formData.code)) {
      errors.code = t.validationErrors.codeInvalid;
    }

    // Validate Arabic name
    if (!formData.nameAr.trim()) {
      errors.nameAr = t.validationErrors.nameArRequired;
    } else if (formData.nameAr.length > 255) {
      errors.nameAr = t.validationErrors.nameArMaxLength;
    }

    // Validate English name
    if (!formData.nameEn.trim()) {
      errors.nameEn = t.validationErrors.nameEnRequired;
    } else if (formData.nameEn.length > 255) {
      errors.nameEn = t.validationErrors.nameEnMaxLength;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle field changes with real-time validation clearing
  const handleFieldChange = (field: keyof CreateServiceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/services", {
        code: formData.code.trim(),
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      const errorMessage = 
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : err instanceof Error
          ? err.message
          : "Failed to create service";
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.createServiceTitle}</DialogTitle>
          <DialogDescription>{t.createServiceDesc}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Service Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="flex items-center gap-1">
                {t.serviceCode}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder={t.serviceCodePlaceholder}
                value={formData.code}
                onChange={(e) => {
                  const value = e.target.value.toUpperCase();
                  handleFieldChange("code", value);
                }}
                maxLength={20}
                disabled={isSubmitting}
                className={formErrors.code ? "border-destructive" : ""}
                autoComplete="off"
              />
              {!formErrors.code && (
                <p className="text-xs text-muted-foreground">
                  {t.serviceCodeHelper}
                </p>
              )}
              {formErrors.code && (
                <p className="text-xs text-destructive">{formErrors.code}</p>
              )}
            </div>

            {/* Name (Arabic) */}
            <div className="space-y-2">
              <Label htmlFor="nameAr" className="flex items-center gap-1">
                {t.nameAr}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameAr"
                dir="rtl"
                placeholder="اسم الخدمة بالعربية"
                value={formData.nameAr}
                onChange={(e) => handleFieldChange("nameAr", e.target.value)}
                maxLength={255}
                disabled={isSubmitting}
                className={formErrors.nameAr ? "border-destructive" : ""}
                autoComplete="off"
              />
              {formErrors.nameAr && (
                <p className="text-xs text-destructive">{formErrors.nameAr}</p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {formData.nameAr.length}/255
              </p>
            </div>

            {/* Name (English) */}
            <div className="space-y-2">
              <Label htmlFor="nameEn" className="flex items-center gap-1">
                {t.nameEn}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nameEn"
                placeholder="Service name in English"
                value={formData.nameEn}
                onChange={(e) => handleFieldChange("nameEn", e.target.value)}
                maxLength={255}
                disabled={isSubmitting}
                className={formErrors.nameEn ? "border-destructive" : ""}
                autoComplete="off"
              />
              {formErrors.nameEn && (
                <p className="text-xs text-destructive">{formErrors.nameEn}</p>
              )}
              <p className="text-xs text-muted-foreground text-right">
                {formData.nameEn.length}/255
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t.creating : t.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
