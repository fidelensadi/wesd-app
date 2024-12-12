import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface PDFUploaderProps {
  onFileSelect: (file: File) => void;
}

export const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileSelect }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type === 'application/pdf') {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full p-8 border-2 border-dashed border-gray-300 bg-white rounded-2xl touch-feedback"
    >
      <label className="flex flex-col items-center cursor-pointer">
        <Upload className="w-12 h-12 text-blue-600 mb-4" />
        <span className="text-base font-medium text-gray-900 text-center">
          Sélectionnez un PDF
        </span>
        <span className="text-sm text-gray-500 mt-1 text-center">
          ou glissez-le ici
        </span>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
    </div>
  );
};