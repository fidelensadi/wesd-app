import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSignature, Edit, Check, X } from 'lucide-react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { EditableTableCell } from '../components/EditableTableCell';
import { households as initialHouseholds } from '../data/households';
import { householdService } from '../services/householdService';
import type { Household } from '../types/household';

const ITEMS_PER_PAGE = 100;

export const HouseholdsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Household>>({});
  const [households, setHouseholds] = useState<Household[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize household data
    householdService.setHouseholds(initialHouseholds);
    setHouseholds(householdService.getHouseholds());
  }, []);

  const totalPages = Math.ceil(households.length / ITEMS_PER_PAGE);
  
  const currentHouseholds = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return households.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, households]);

  const handleEdit = (household: Household) => {
    setEditingId(household.id);
    setEditedData({
      phone: household.phone,
      userName: household.userName,
      address: household.address,
      serialNumber: household.serialNumber,
      date: household.date
    });
  };

  const handleSave = (id: number) => {
    try {
      const updatedHousehold = householdService.updateHousehold(id, editedData);
      setHouseholds(householdService.getHouseholds());
      setEditingId(null);
      setEditedData({});
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData({});
  };

  const handleFieldChange = (field: keyof Household, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-16 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Ménages enregistrés | VPA 001
          </h1>

          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr className="divide-x divide-gray-200">
                    <th scope="col" className="w-32 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléphone
                    </th>
                    <th scope="col" className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="w-96 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse
                    </th>
                    <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nº série
                    </th>
                    <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentHouseholds.map((household) => (
                    <tr key={household.id} className="hover:bg-gray-50 divide-x divide-gray-200">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <div className="flex items-center justify-center space-x-2">
                          {editingId === household.id ? (
                            <>
                              <button
                                onClick={() => handleSave(household.id)}
                                className="inline-flex items-center px-2 py-1 border border-green-600 text-xs font-medium rounded text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 touch-feedback"
                              >
                                <Check className="w-3 h-3 mr-1" />
                                Sauver
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-2 py-1 border border-red-600 text-xs font-medium rounded text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 touch-feedback"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Annuler
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => navigate(`/signature/${household.id}`)}
                                className="inline-flex items-center px-2 py-1 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-feedback"
                              >
                                <FileSignature className="w-3 h-3 mr-1" />
                                Signer
                              </button>
                              <button
                                onClick={() => handleEdit(household)}
                                className="inline-flex items-center px-2 py-1 border border-gray-600 text-xs font-medium rounded text-gray-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 touch-feedback"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Modifier
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          household.status === 'signe' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {household.status === 'signe' ? 'Signé' : 'Non signé'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <EditableTableCell
                          value={editingId === household.id ? editedData.phone || household.phone : household.phone}
                          isEditing={editingId === household.id}
                          onChange={(value) => handleFieldChange('phone', value)}
                          type="tel"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <EditableTableCell
                          value={editingId === household.id ? editedData.userName || household.userName : household.userName}
                          isEditing={editingId === household.id}
                          onChange={(value) => handleFieldChange('userName', value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <EditableTableCell
                          value={editingId === household.id ? editedData.address || household.address : household.address}
                          isEditing={editingId === household.id}
                          onChange={(value) => handleFieldChange('address', value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <EditableTableCell
                          value={editingId === household.id ? editedData.serialNumber || household.serialNumber : household.serialNumber}
                          isEditing={editingId === household.id}
                          onChange={(value) => handleFieldChange('serialNumber', value)}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <EditableTableCell
                          value={editingId === household.id ? editedData.date || household.date : household.date}
                          isEditing={editingId === household.id}
                          onChange={(value) => handleFieldChange('date', value)}
                          type="date"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>
    </div>
  );
};