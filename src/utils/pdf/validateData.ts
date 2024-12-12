import type { SignaturePosition } from '../../hooks/useSignaturePosition';
import type { TextPosition } from '../../types/household';

export function validatePDFData(
  pdfFile: File,
  signatureDataUrl: string,
  signaturePosition: SignaturePosition,
  textPositions: TextPosition[]
): void {
  if (!pdfFile || pdfFile.type !== 'application/pdf') {
    throw new Error('Fichier PDF invalide');
  }

  if (!signatureDataUrl || !signatureDataUrl.startsWith('data:image/')) {
    throw new Error('Format de signature invalide');
  }

  if (!signaturePosition || 
      typeof signaturePosition.x !== 'number' || 
      typeof signaturePosition.y !== 'number' || 
      typeof signaturePosition.page !== 'number' ||
      signaturePosition.page < 0) {
    throw new Error('Position de signature invalide');
  }

  if (!Array.isArray(textPositions)) {
    throw new Error('Positions de texte invalides');
  }

  textPositions.forEach((pos, index) => {
    if (!pos || 
        typeof pos.x !== 'number' || 
        typeof pos.y !== 'number' || 
        typeof pos.page !== 'number' || 
        !pos.type ||
        pos.page < 0) {
      throw new Error(`Position de texte invalide à l'index ${index}`);
    }
  });
}