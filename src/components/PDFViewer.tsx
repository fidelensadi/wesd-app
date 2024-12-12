import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import type { DocumentProps } from 'react-pdf';
import { SignaturePreview } from './SignaturePreview';
import { DraggableText } from './DraggableText';
import type { SignaturePosition } from '../hooks/useSignaturePosition';
import type { TextPosition } from '../types/household';
import type { Household } from '../types/household';
import { useAuth } from '../contexts/AuthContext';

interface PDFViewerProps {
  file: File | null;
  onLoadSuccess: DocumentProps['onLoadSuccess'];
  pageNumber: number;
  signature?: string;
  signaturePosition?: SignaturePosition;
  onSignaturePositionChange?: (position: Partial<SignaturePosition>) => void;
  onSignatureRemove?: () => void;
  household?: Household;
  textPositions: TextPosition[];
  onTextPositionChange: (type: TextPosition['type'], position: Partial<TextPosition>) => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  onLoadSuccess,
  pageNumber,
  signature,
  signaturePosition,
  onSignaturePositionChange,
  onSignatureRemove,
  household,
  textPositions,
  onTextPositionChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const { user } = useAuth();

  // Memoize PDF.js options
  const pdfOptions = useMemo(() => ({
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/'
  }), []);

  // Handle container width updates
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const width = Math.min(containerWidth, 1000);

  // Memoize text content getter
  const getTextForPosition = useCallback((position: TextPosition): string => {
    if (position.type === 'profile-name' && user) {
      return user.name;
    }
    if (position.type === 'profile-phone' && user) {
      return user.phone;
    }
    if (household) {
      switch (position.type) {
        case 'name':
          return household.userName;
        case 'phone':
          return household.phone;
        case 'address':
          return household.address;
        case 'date':
          return household.date;
      }
    }
    return '';
  }, [household, user]);

  // Memoize file URL
  const fileUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // Cleanup file URL on unmount or file change
  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  if (!fileUrl) return null;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div ref={containerRef} className="relative">
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          options={pdfOptions}
          error={
            <div className="text-red-600 p-4">
              Une erreur est survenue lors du chargement du PDF.
            </div>
          }
          loading={
            <div className="w-full h-[842px] bg-gray-100 animate-pulse rounded-lg" />
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="border rounded-lg shadow-lg"
            width={width}
            loading={
              <div className="w-full h-[842px] bg-gray-100 animate-pulse rounded-lg" />
            }
          />
        </Document>

        {signature && signaturePosition && onSignaturePositionChange && (
          <SignaturePreview
            signature={signature}
            position={signaturePosition}
            onPositionChange={onSignaturePositionChange}
            containerRef={containerRef}
            containerWidth={width}
            onRemove={onSignatureRemove}
          />
        )}

        {textPositions.map(position => {
          const text = getTextForPosition(position);
          if (!text) return null;

          return (
            <DraggableText
              key={position.type}
              text={text}
              position={position}
              onPositionChange={(updates) => onTextPositionChange(position.type, updates)}
              containerRef={containerRef}
              containerWidth={width}
            />
          );
        })}
      </div>
    </div>
  );
};