import * as React from "react";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (url?: string) => void;
}

export default function ImageUpload({ imageUrl, onImageChange }: ImageUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local URL for preview
      const url = URL.createObjectURL(file);
      onImageChange(url);

      // TODO: Upload to server and get actual URL
      // const formData = new FormData();
      // formData.append('image', file);
      // const { data } = await api.post('/upload', formData);
      // onImageChange(data.url);
    }
  };

  const handleRemoveImage = () => {
    onImageChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Step Image (Optional)</label>
      
      {imageUrl ? (
        <div className="relative rounded-md border p-2">
          <img
            src={imageUrl}
            alt="Step preview"
            className="w-full h-48 object-cover rounded"
          />
          <Button
            size="icon"
            variant="destructive"
            className="absolute top-4 right-4"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-md p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            Click to upload an image
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose File
          </Button>
        </div>
      )}
    </div>
  );
}
