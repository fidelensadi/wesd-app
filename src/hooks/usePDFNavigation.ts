import { useState } from 'react';

export interface PDFNavigationState {
  pageNumber: number;
  numPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
  setTotalPages: (pages: number) => void;
}

export function usePDFNavigation(): PDFNavigationState {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const goToNextPage = () => {
    setPageNumber((current) => Math.min(current + 1, numPages));
  };

  const goToPreviousPage = () => {
    setPageNumber((current) => Math.max(current - 1, 1));
  };

  const setTotalPages = (pages: number) => {
    setNumPages(pages);
  };

  return {
    pageNumber,
    numPages,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage: pageNumber < numPages,
    canGoToPreviousPage: pageNumber > 1,
    setTotalPages,
  };
}