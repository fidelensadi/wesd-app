export interface Household {
  id: number;
  phone: string;
  userName: string;
  address: string;
  serialNumber: string;
  date: string;
  status: 'non_signe' | 'signe';
  signedBy?: string;
  signedAt?: string;
}

export type TextPositionType = 'name' | 'phone' | 'address' | 'date' | 'profile-name' | 'profile-phone';

export interface TextPosition {
  x: number;
  y: number;
  page: number;
  type: TextPositionType;
}

export type HouseholdPosition = TextPosition;