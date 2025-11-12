"use client";
import { User } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface FileDropzoneProps {
  form: any;
  setFile?: (file: File | null) => void;
  selectedEditUser: User | User[];
}

export function ImageUploadForm({
  form,
  setFile,
  selectedEditUser,
}: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const getAvatarUrl = form.watch("avatar");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile?.(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const imageToShow = preview || getAvatarUrl;

  const handleRemovePreview = (e: React.MouseEvent) => {
    setPreview(null);
    e.stopPropagation();
    setFile?.(null);
  };

  return (
    <div className="w-full">
      <div
        className="border-2 border-dashed border-border rounded-md p-4 flex cursor-pointer relative overflow-hidden h-[100px] justify-center items-center"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
      >
        {imageToShow ? (
          <div className="relative w-full h-full flex">
            <Image
              src={imageToShow}
              alt="Preview"
              fill
              className="object-contain p-1"
            />
            {/* @ts-expect-error:weird-error */}
            {selectedEditUser?.avatar ? (
              <></>
            ) : (
              <Button
                onClick={handleRemovePreview}
                variant="link"
                className="z-10"
              >
                <X />
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center h-full gap-2">
            <div className="rounded-full p- mb-1">
              <Upload className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-[10px] font-medium text-foreground">
              Upload Image
            </p>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
