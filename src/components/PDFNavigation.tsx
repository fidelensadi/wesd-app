import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PDFNavigationState } from '../hooks/usePDFNavigation';

interface PDFNavigationProps {
  navigation: PDFNavigationState;
}

export const PDFNavigation: React.FC<PDFNavigationProps> = ({ navigation }) => {
  const {
    pageNumber,
    numPages,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  } = navigation;

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-2">
      <button
        disabled={!canGoToPreviousPage}
        onClick={goToPreviousPage}
        className="p-2 rounded-lg disabled:opacity-30 touch-feedback"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <span className="text-sm font-medium">
        Page {pageNumber}/{numPages}
      </span>
      
      <button
        disabled={!canGoToNextPage}
        onClick={goToNextPage}
        className="p-2 rounded-lg disabled:opacity-30 touch-feedback"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};