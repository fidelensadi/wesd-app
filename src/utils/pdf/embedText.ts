import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { calculatePDFPosition } from './calculatePosition';
import type { Household, TextPosition } from '../../types/household';
import type { User } from '../../types/user';

export async function embedText(
  pdfDoc: PDFDocument,
  page: PDFPage,
  positions: TextPosition[],
  household?: Household,
  user?: User | null
) {
  try {
    const font = await pdfDoc.embedFont('Helvetica');
    const fontSize = 8; // Reduced font size to match text-xs
    const { width: pageWidth, height: pageHeight } = page.getSize();

    for (const position of positions) {
      let text = '';

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

      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      const { x, y } = calculatePDFPosition({
        image: { width: textWidth, height: textHeight },
        position,
        pageWidth,
        pageHeight,
        maxWidthRatio: 1
      });

      page.drawText(text.trim(), {
        x,
        y: y + (textHeight * 0.2), // Slight vertical adjustment for better alignment
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