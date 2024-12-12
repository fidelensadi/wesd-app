import { PDFDocument } from 'pdf-lib';

export async function processSignatureImage(
  signatureDataUrl: string, 
  pdfDoc: PDFDocument
) {
  if (!signatureDataUrl || !pdfDoc) {
    throw new Error('Données de signature invalides');
  }

  try {
    const [header, data] = signatureDataUrl.split(',');
    
    if (!header.includes('image/') || !data) {
      throw new Error('Format de signature invalide');
    }

    const signatureBytes = Uint8Array.from(
      atob(data), 
      c => c.charCodeAt(0)
    );

    if (signatureBytes.length === 0) {
      throw new Error('Données de signature vides');
    }

    const image = await pdfDoc.embedPng(signatureBytes);
    
    if (!image) {
      throw new Error('Impossible d\'intégrer la signature dans le PDF');
    }

    return image;
  } catch (error) {
    console.error('Error processing signature:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Impossible de traiter l\'image de la signature');
  }
}