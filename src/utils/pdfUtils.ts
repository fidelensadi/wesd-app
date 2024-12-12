import { PDFDocument } from 'pdf-lib';
import { validatePDFData } from './pdf/validateData';
import { embedSignature } from './pdf/embedSignature';
import { embedText } from './pdf/embedText';
import type { SignaturePosition } from '../hooks/useSignaturePosition';
import type { Household, TextPosition } from '../types/household';
import type { User } from '../types/user';

export async function addSignatureToPDF(
  pdfFile: File,
  signatureDataUrl: string,
  signaturePosition: SignaturePosition,
  textPositions: TextPosition[],
  household?: Household,
  user?: User | null
): Promise<Uint8Array> {
  try {
    validatePDFData(pdfFile, signatureDataUrl, signaturePosition, textPositions);

    const pdfBuffer = await pdfFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBuffer, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    if (!pdfDoc || pdfDoc.getPageCount() === 0) {
      throw new Error('Document PDF invalide ou vide');
    }

    const page = pdfDoc.getPage(signaturePosition.page);

    await embedSignature(page, signatureDataUrl, signaturePosition, pdfDoc);
    await embedText(pdfDoc, page, textPositions, household, user);

    return await pdfDoc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
      updateMetadata: false
    });
  } catch (error) {
    console.error('Error in addSignatureToPDF:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Une erreur est survenue lors de la signature du PDF');
  }
}