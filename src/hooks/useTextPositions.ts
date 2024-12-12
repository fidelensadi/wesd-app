import { useState } from 'react';
import type { TextPosition, TextPositionType } from '../types/household';

const initialPositions: TextPosition[] = [
  // Household information
  { x: 175, y: 148, page: 0, type: 'name' },
  { x: 115, y: 164, page: 0, type: 'address' },
  { x: 128, y: 174, page: 0, type: 'phone' },
  { x: 105, y: 472.7, page: 0, type: 'date' },
  
  // Seller information
  { x: 340, y: 228, page: 0, type: 'profile-name' },
  { x: 350, y: 282, page: 0, type: 'profile-phone' }
];

export function useTextPositions(initialPage: number = 0) {
  const [positions, setPositions] = useState<TextPosition[]>(
    initialPositions.map(pos => ({ ...pos, page: initialPage }))
  );

  const updatePosition = (type: TextPositionType, updates: Partial<TextPosition>) => {
    setPositions(prev => 
      prev.map(pos => 
        pos.type === type ? { ...pos, ...updates } : pos
      )
    );
  };

  return {
    positions,
    updatePosition,
  };
}