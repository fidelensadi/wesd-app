import type { SignaturePosition } from '../hooks/useSignaturePosition';
import type { PDFImage } from 'pdf-lib';

interface CalculatePositionParams {
  image: PDFImage | { width: number; height: number };
  position: SignaturePosition;
  pageWidth: number;
  pageHeight: number;
  maxWidthRatio: number;
}

interface PDFPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function calculatePDFPosition({
  image,
  position,
  pageWidth,
  pageHeight,
  maxWidthRatio
}: CalculatePositionParams): PDFPosition {
  const previewElement = document.querySelector('.react-pdf__Page');
  if (!previewElement) {
    throw new Error('Élément de prévisualisation non trouvé');
  }

  // Calculate scale factors
  const previewWidth = previewElement.clientWidth;
  const previewHeight = previewElement.clientHeight;
  const scaleX = pageWidth / previewWidth;
  const scaleY = pageHeight / previewHeight;

  // Calculate dimensions
  let width: number;
  let height: number;

  if ('scale' in image) {
    // Handle PDFImage
    const imgDims = image.scale(1);
    const maxWidth = pageWidth * maxWidthRatio;
    const scale = maxWidth / imgDims.width;
    width = imgDims.width * scale;
    height = imgDims.height * scale;
  } else {
    // Handle text dimensions
    width = image.width;
    height = image.height;
  }

  // Calculate position with proper scaling
  const scaledX = position.x * scaleX;
  const scaledY = position.y * scaleY;

  // Convert coordinates from top-left to bottom-left origin
  const x = scaledX;
  const y = pageHeight - (scaledY + height);

  // Ensure position stays within page bounds
  return {
    x: Math.max(0, Math.min(x, pageWidth - width)),
    y: Math.max(0, Math.min(y, pageHeight - height)),
    width,
    height
  };
}