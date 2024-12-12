import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { calculatePDFPosition } from './coordinateUtils';
import type { Household, TextPosition } from '../types/household';
import type { User } from '../types/user';

export async function addTextToPDF(
  pdfDoc: PDFDocument,
  page: PDFPage,
  positions: TextPosition[],
  household?: Household,
  user?: User | null
) {
  if (!pdfDoc || !page || !positions) {
    throw new Error('Paramètres invalides pour l\'ajout de texte');
  }

  try {
    const font = await pdfDoc.embedFont('Helvetica');
    if (!font) {
      throw new Error('Impossible de charger la police');
    }

    const fontSize = 10;
    const { width: pageWidth, height: pageHeight } = page.getSize();

    for (const position of positions) {
      let text = '';

      // Get text based on position type
      if (position.type === 'profile-name' && user) {
        text = user.name;
      } else if (position.type === 'profile-phone' && user) {
        text = user.phone;
      } else if (household) {
        switch (position.type) {
          case 'name':
            text = household.userName;
            break;
          case 'phone':
            text = household.phone;
            break;
          case 'address':
            text = household.address;
            break;
          case 'date':
            text = household.date;
            break;
        }
      }

      if (!text) continue;

      // Calculate text dimensions
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      // Calculate position
      const { x, y } = calculatePDFPosition({
        image: { 
          width: textWidth,
          height: textHeight
        },
        position,
        pageWidth,
        pageHeight,
        maxWidthRatio: 1
      });

      // Draw text with proper positioning
      page.drawText(text.trim(), {
        x,
        y: y + (textHeight * 0.2),
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        lineHeight: fontSize * 1.2
      });
    }
  } catch (error) {
    console.error('Error adding text to PDF:', error);
    throw error instanceof Error 
      ? error 
      : new Error('Impossible d\'ajouter le texte au PDF');
  }
}