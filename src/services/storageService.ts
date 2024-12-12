import { Household } from '../types/household';

const STORAGE_KEYS = {
  HOUSEHOLDS: 'wesd_households',
  SIGNED_HOUSEHOLDS: 'wesd_signed_households'
} as const;

export const storageService = {
  saveHouseholds(households: Household[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.HOUSEHOLDS, JSON.stringify(households));
    } catch (error) {
      console.error('Error saving households:', error);
    }
  },

  getHouseholds(): Household[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HOUSEHOLDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading households:', error);
      return [];
    }
  },

  saveSignedHouseholds(householdIds: number[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SIGNED_HOUSEHOLDS, JSON.stringify(householdIds));
    } catch (error) {
      console.error('Error saving signed households:', error);
    }
  },

  getSignedHouseholds(): number[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SIGNED_HOUSEHOLDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading signed households:', error);
      return [];
    }
  },

  clearStorage() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HOUSEHOLDS);
      localStorage.removeItem(STORAGE_KEYS.SIGNED_HOUSEHOLDS);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};