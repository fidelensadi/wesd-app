import type { SignaturePosition } from '../hooks/useSignaturePosition';
import type { TextPosition } from '../types/household';

export function validatePDFData(
  pdfFile: File,
  signatureDataUrl: string,
  signaturePosition: SignaturePosition,
  textPositions: TextPosition[]
): void {
  // Validate PDF file
  if (!pdfFile) {
    throw new Error('Aucun fichier PDF fourni');
  }

  if (pdfFile.type !== 'application/pdf') {
    throw new Error('Le fichier doit être au format PDF');
  }

  if (pdfFile.size === 0) {
    throw new Error('Le fichier PDF est vide');
  }

  // Validate signature data
  if (!signatureDataUrl) {
    throw new Error('Aucune signature fournie');
  }

  if (!signatureDataUrl.startsWith('data:image/')) {
    throw new Error('Format de signature invalide');
  }

  const [, data] = signatureDataUrl.split(',');
  if (!data) {
    throw new Error('Données de signature invalides');
  }

  // Validate signature position
  if (!signaturePosition || 
      typeof signaturePosition.x !== 'number' || 
      typeof signaturePosition.y !== 'number' || 
      typeof signaturePosition.page !== 'number') {
    throw new Error('Position de signature invalide');
  }

  if (signaturePosition.page < 0) {
    throw new Error('Numéro de page invalide');
  }

  // Validate text positions
  if (!Array.isArray(textPositions)) {
    throw new Error('Positions de texte invalides');
  }

  textPositions.forEach((pos, index) => {
    if (!pos || 
        typeof pos.x !== 'number' || 
        typeof pos.y !== 'number' || 
        typeof pos.page !== 'number' || 
        !pos.type) {
      throw new Error(`Position de texte invalide à l'index ${index}`);
    }

    if (pos.page < 0) {
      throw new Error(`Numéro de page invalide pour le texte à l'index ${index}`);
    }
  });
}