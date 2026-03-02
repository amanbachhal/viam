"use client";

import { Upload, Trash2 } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  value?: File[];
  onValueChange?: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
}

export default function FileUpload01({
  value = [],
  onValueChange,
  multiple = true,
  accept = "image/*",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files) return;

    const newFiles = [...value, ...Array.from(files)];
    onValueChange?.(newFiles);
  }

  function removeFile(name: string) {
    const updated = value.filter((f) => f.name !== name);
    onValueChange?.(updated);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-3">
      {/* Upload Box */}
      <div
        className="border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/40 transition"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <Upload className="w-5 h-5 mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Upload files</p>
        <p className="text-xs text-muted-foreground">
          Drag & drop or click to browse
        </p>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Preview */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {value.map((file) => {
            const url = URL.createObjectURL(file);

            return (
              <div
                key={file.name}
                className="relative border rounded-md overflow-hidden"
              >
                <img
                  src={url}
                  className="w-24 h-24 object-cover"
                  onLoad={() => URL.revokeObjectURL(url)}
                />

                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeFile(file.name)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
