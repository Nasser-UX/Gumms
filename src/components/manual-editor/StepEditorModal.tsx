import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X } from "lucide-react";

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

const I18N = {
  ar: {
    editStep: "تحرير الخطوة",
    newStep: "خطوة جديدة",
    stepDetails: "أدخل تفاصيل الخطوة بكلا اللغتين",
    arabic: "العربية",
    english: "English",
    title: "العنوان",
    titlePlaceholder: "عنوان الخطوة",
    body: "المحتوى",
    bodyPlaceholder: "وصف تفصيلي للخطوة...",
    images: "الصور (اختياري)",
    uploadImage: "رفع صورة",
    altText: "نص بديل",
    altTextAr: "نص بديل (عربي)",
    altTextEn: "نص بديل (إنجليزي)",
    remove: "إزالة",
    save: "حفظ",
    cancel: "إلغاء",
    maxImages: "الحد الأقصى 5 صور",
    maxFileSize: "الحد الأقصى لحجم الملف 5 ميجابايت",
    invalidFileType: "نوع الملف غير صالح. يرجى استخدام PNG أو JPG",
    fileTooLarge: "حجم الملف كبير جدًا. الحد الأقصى 5 ميجابايت",
    altTextRequired: "النص البديل مطلوب لجميع الصور",
    titleRequired: "العنوان مطلوب بكلا اللغتين",
  },
  en: {
    editStep: "Edit Step",
    newStep: "New Step",
    stepDetails: "Enter step details in both languages",
    arabic: "العربية",
    english: "English",
    title: "Title",
    titlePlaceholder: "Step title",
    body: "Content",
    bodyPlaceholder: "Detailed step description...",
    images: "Images (Optional)",
    uploadImage: "Upload Image",
    altText: "Alt Text",
    altTextAr: "Alt Text (Arabic)",
    altTextEn: "Alt Text (English)",
    remove: "Remove",
    save: "Save",
    cancel: "Cancel",
    maxImages: "Maximum 5 images",
    maxFileSize: "Maximum file size 5MB",
    invalidFileType: "Invalid file type. Please use PNG or JPG",
    fileTooLarge: "File is too large. Maximum 5MB",
    altTextRequired: "Alt text is required for all images",
    titleRequired: "Title is required in both languages",
  },
} as const;

interface StepEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step?: ManualStep | null;
  onSave: (stepData: Partial<ManualStep>) => void;
  lang: Lang;
}

interface ImageData extends StepImage {
  file?: File;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
const MAX_IMAGES = 5;

export function StepEditorModal({
  open,
  onOpenChange,
  step,
  onSave,
  lang,
}: StepEditorModalProps) {
  const t = I18N[lang];
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeLang, setActiveLang] = React.useState<Lang>("ar");
  const [errors, setErrors] = React.useState<string[]>([]);

  const [formData, setFormData] = React.useState({
    titleAr: "",
    titleEn: "",
    bodyAr: "",
    bodyEn: "",
  });

  const [images, setImages] = React.useState<ImageData[]>([]);

  // Initialize form data when step changes or modal opens
  React.useEffect(() => {
    if (open) {
      if (step) {
        setFormData({
          titleAr: step.titleAr || "",
          titleEn: step.titleEn || "",
          bodyAr: step.bodyAr || "",
          bodyEn: step.bodyEn || "",
        });
        setImages(step.images || []);
      } else {
        // Reset for new step
        setFormData({
          titleAr: "",
          titleEn: "",
          bodyAr: "",
          bodyEn: "",
        });
        setImages([]);
      }
      setErrors([]);
    }
  }, [open, step]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newErrors: string[] = [];

    if (images.length + files.length > MAX_IMAGES) {
      newErrors.push(t.maxImages);
      setErrors(newErrors);
      return;
    }

    const validFiles: ImageData[] = [];

    files.forEach((file) => {
      // Check file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        newErrors.push(`${file.name}: ${t.invalidFileType}`);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name}: ${t.fileTooLarge}`);
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      validFiles.push({
        id: Date.now().toString() + Math.random(),
        url,
        altTextAr: "",
        altTextEn: "",
        file,
      });
    });

    if (validFiles.length > 0) {
      setImages([...images, ...validFiles]);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter((img) => img.id !== imageId));
    setErrors([]);
  };

  const handleUpdateImageAlt = (imageId: string, altTextAr: string, altTextEn: string) => {
    setImages(
      images.map((img) =>
        img.id === imageId ? { ...img, altTextAr, altTextEn } : img
      )
    );
  };

  const handleSave = () => {
    const newErrors: string[] = [];

    // Validate titles
    if (!formData.titleAr.trim() || !formData.titleEn.trim()) {
      newErrors.push(t.titleRequired);
    }

    // Validate alt text for images
    const imagesWithoutAlt = images.filter(
      (img) => !img.altTextAr?.trim() || !img.altTextEn?.trim()
    );
    if (imagesWithoutAlt.length > 0) {
      newErrors.push(t.altTextRequired);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    // TODO: Upload images to server and get URLs
    // For now, we'll use the local URLs
    const stepData: Partial<ManualStep> = {
      titleAr: formData.titleAr.trim(),
      titleEn: formData.titleEn.trim(),
      bodyAr: formData.bodyAr.trim(),
      bodyEn: formData.bodyEn.trim(),
      images: images.map(({ file, ...img }) => img), // Remove file object
    };

    onSave(stepData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setErrors([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step ? t.editStep : t.newStep}</DialogTitle>
          <DialogDescription>{t.stepDetails}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="rounded-md bg-destructive/10 p-3 space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-destructive">
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Language Tabs for Title and Body */}
          <Tabs value={activeLang} onValueChange={(v) => setActiveLang(v as Lang)}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="ar">{t.arabic}</TabsTrigger>
              <TabsTrigger value="en">{t.english}</TabsTrigger>
            </TabsList>

            {/* Arabic Tab */}
            <TabsContent value="ar" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titleAr">{t.title} (عربي) *</Label>
                <Input
                  id="titleAr"
                  dir="rtl"
                  value={formData.titleAr}
                  onChange={(e) =>
                    setFormData({ ...formData, titleAr: e.target.value })
                  }
                  placeholder={t.titlePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyAr">{t.body} (عربي)</Label>
                <textarea
                  id="bodyAr"
                  dir="rtl"
                  value={formData.bodyAr}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyAr: e.target.value })
                  }
                  className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
                  placeholder={t.bodyPlaceholder}
                />
              </div>
            </TabsContent>

            {/* English Tab */}
            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titleEn">{t.title} (English) *</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) =>
                    setFormData({ ...formData, titleEn: e.target.value })
                  }
                  placeholder={t.titlePlaceholder}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyEn">{t.body} (English)</Label>
                <textarea
                  id="bodyEn"
                  value={formData.bodyEn}
                  onChange={(e) =>
                    setFormData({ ...formData, bodyEn: e.target.value })
                  }
                  className="w-full min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm resize-y"
                  placeholder={t.bodyPlaceholder}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t.images}</Label>
              <p className="text-xs text-muted-foreground">{t.maxFileSize}</p>
            </div>

            {/* Upload Button */}
            {images.length < MAX_IMAGES && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t.uploadImage}
                </Button>
              </div>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="flex-shrink-0">
                        <img
                          src={image.url}
                          alt=""
                          className="w-24 h-24 object-cover rounded border"
                        />
                      </div>

                      {/* Alt Text Inputs */}
                      <div className="flex-1 space-y-3">
                        <div className="space-y-1">
                          <Label htmlFor={`altAr-${image.id}`} className="text-xs">
                            {t.altTextAr} *
                          </Label>
                          <Input
                            id={`altAr-${image.id}`}
                            dir="rtl"
                            value={image.altTextAr || ""}
                            onChange={(e) =>
                              handleUpdateImageAlt(
                                image.id,
                                e.target.value,
                                image.altTextEn || ""
                              )
                            }
                            placeholder="وصف الصورة"
                            className="text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor={`altEn-${image.id}`} className="text-xs">
                            {t.altTextEn} *
                          </Label>
                          <Input
                            id={`altEn-${image.id}`}
                            value={image.altTextEn || ""}
                            onChange={(e) =>
                              handleUpdateImageAlt(
                                image.id,
                                image.altTextAr || "",
                                e.target.value
                              )
                            }
                            placeholder="Image description"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveImage(image.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {t.cancel}
          </Button>
          <Button onClick={handleSave}>{t.save}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
