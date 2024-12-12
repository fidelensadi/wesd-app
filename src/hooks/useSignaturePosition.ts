import { useState } from 'react';

export interface SignaturePosition {
  x: number;
  y: number;
  page: number;
}

export function useSignaturePosition(initialPage: number = 0) {
  const [position, setPosition] = useState<SignaturePosition>({
    x: 50, // Position X en bas à gauche
    y: 700, // Position Y en bas (cette valeur sera ajustée en fonction de la hauteur de la page)
    page: initialPage,
  });

  const updatePosition = (newPosition: Partial<SignaturePosition>) => {
    setPosition((prev) => ({ ...prev, ...newPosition }));
  };

  return {
    position,
    updatePosition,
  };
}