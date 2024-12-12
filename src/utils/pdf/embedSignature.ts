import { PDFDocument, PDFPage } from 'pdf-lib';
import { calculatePDFPosition } from './calculatePosition';
import type { SignaturePosition } from '../../hooks/useSignaturePosition';

export async function embedSignature(
  page: PDFPage,
  signatureDataUrl: string,
  signaturePosition: SignaturePosition,
  pdfDoc: PDFDocument
) {
  try {
    const signatureImageData = signatureDataUrl.split(',')[1];
    if (!signatureImageData) {
      throw new Error('Format de signature invalide');
    }

    const signatureBytes = Uint8Array.from(
      atob(signatureImageData), 
      c => c.charCodeAt(0)
    );

    const signatureImage = await pdfDoc.embedPng(signatureBytes);
    const { width: pageWidth, height: pageHeight } = page.getSize();

    const { x, y, width, height } = calculatePDFPosition({
      image: signatureImage,
      position: signaturePosition,
      pageWidth,
      pageHeight,
      maxWidthRatio: 0.3
    });

    page.drawImage(signatureImage, { 
      x, 
      y, 
      width, 
      height,
      opacity: 0.95
    });
  } catch (error) {
    throw new Error('Impossible d\'ajouter la signature au PDF');
  }
}