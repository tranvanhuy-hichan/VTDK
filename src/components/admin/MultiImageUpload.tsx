"use client";

import React, { useEffect, useMemo } from "react";
import { X, Camera, Upload } from "lucide-react";

interface MultiImageUploadProps {
  existingUrls: string[];
  onExistingUrlsChange: (urls: string[]) => void;
  newFiles: File[];
  onNewFilesChange: (files: File[]) => void;
  label?: string;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  existingUrls,
  onExistingUrlsChange,
  newFiles,
  onNewFilesChange,
  label = "Thư viện ảnh (nhiều ảnh)",
}) => {
  const newPreviews = useMemo(() => newFiles.map((f) => URL.createObjectURL(f)), [newFiles]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onNewFilesChange([...newFiles, ...Array.from(e.target.files)]);
      e.target.value = "";
    }
  };

  const removeExisting = (index: number) => {
    onExistingUrlsChange(existingUrls.filter((_, i) => i !== index));
  };

  const removeNew = (index: number) => {
    onNewFilesChange(newFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
        {existingUrls.map((url, index) => (
          <div key={`existing-${url}-${index}`} className="relative aspect-square rounded-md border border-slate-200 overflow-hidden bg-slate-50 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeExisting(index)}
              aria-label="Xóa ảnh"
              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 rounded-md shadow-sm transition-colors !min-h-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {newFiles.map((_, index) => (
          <div key={`new-${index}`} className="relative aspect-square rounded-md border border-blue-200 overflow-hidden bg-slate-50 group">
            <img src={newPreviews[index]} alt="" className="w-full h-full object-cover" />
            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              Mới
            </span>
            <button
              type="button"
              onClick={() => removeNew(index)}
              aria-label="Bỏ ảnh"
              className="absolute top-1 right-1 p-1 bg-white/90 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 rounded-md shadow-sm transition-colors !min-h-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <label className="aspect-square flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 hover:border-[#075FA8] rounded-md cursor-pointer text-slate-400 hover:text-[#075FA8] transition-colors">
          <Camera className="w-5 h-5" />
          <span className="text-[10px] font-bold">Chụp ảnh</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFilesSelected}
            className="hidden"
          />
        </label>

        <label className="aspect-square flex flex-col items-center justify-center gap-1 border-2 border-dashed border-slate-200 hover:border-[#075FA8] rounded-md cursor-pointer text-slate-400 hover:text-[#075FA8] transition-colors">
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-bold">Tải ảnh lên</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5">
        Khách hàng sẽ lướt xem được tất cả ảnh trong thư viện này. JPG, PNG, WEBP tối đa 5MB/ảnh.
      </p>
    </div>
  );
};
