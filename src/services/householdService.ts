import { Household } from '../types/household';
import { storageService } from './storageService';

type Subscriber = () => void;

class HouseholdService {
  private subscribers: Subscriber[] = [];
  private householdData: Household[] = [];
  private signedHouseholds: Set<number>;

  constructor() {
    // Initialize from localStorage
    this.householdData = storageService.getHouseholds();
    this.signedHouseholds = new Set(storageService.getSignedHouseholds());
  }

  setHouseholds(households: Household[]) {
    this.householdData = households.map(h => ({
      ...h,
      status: this.signedHouseholds.has(h.id) ? 'signe' : 'non_signe'
    }));
    this.persistChanges();
    this.notifySubscribers();
  }

  getHouseholds() {
    return this.householdData.filter(h => !this.signedHouseholds.has(h.id));
  }

  getSignedHouseholds() {
    return this.householdData.filter(h => this.signedHouseholds.has(h.id));
  }

  updateHousehold(id: number, updates: Partial<Household>): Household {
    const index = this.householdData.findIndex(h => h.id === id);
    if (index === -1) {
      throw new Error('Ménage non trouvé');
    }

    const updatedHousehold = {
      ...this.householdData[index],
      ...updates,
      status: this.signedHouseholds.has(id) ? 'signe' : 'non_signe'
    };

    this.householdData[index] = updatedHousehold;
    this.persistChanges();
    this.notifySubscribers();
    return updatedHousehold;
  }

  markAsSigned(id: number, userEmail: string) {
    const index = this.householdData.findIndex(h => h.id === id);
    if (index === -1) {
      throw new Error('Ménage non trouvé');
    }

    // Add to signed set
    this.signedHouseholds.add(id);

    // Update household data
    this.householdData[index] = {
      ...this.householdData[index],
      status: 'signe',
      signedBy: userEmail,
      signedAt: new Date().toISOString()
    };

    this.persistChanges();
    this.notifySubscribers();
  }

  private persistChanges() {
    storageService.saveHouseholds(this.householdData);
    storageService.saveSignedHouseholds(Array.from(this.signedHouseholds));
  }

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback());
  }

  clearStorage() {
    this.householdData = [];
    this.signedHouseholds.clear();
    storageService.clearStorage();
    this.notifySubscribers();
  }
}

// Export a singleton instance
export const householdService = new HouseholdService();