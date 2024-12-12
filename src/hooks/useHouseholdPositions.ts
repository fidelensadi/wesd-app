import { useState } from 'react';
import type { HouseholdPosition } from '../types/household';

const initialPositions: HouseholdPosition[] = [
  { x: 50, y: 100, page: 0, type: 'name' },
  { x: 50, y: 150, page: 0, type: 'phone' },
  { x: 50, y: 200, page: 0, type: 'address' },
  { x: 50, y: 250, page: 0, type: 'date' }
];

export function useHouseholdPositions(initialPage: number = 0) {
  const [positions, setPositions] = useState<HouseholdPosition[]>(
    initialPositions.map(pos => ({ ...pos, page: initialPage }))
  );

  const updatePosition = (type: HouseholdPosition['type'], updates: Partial<HouseholdPosition>) => {
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