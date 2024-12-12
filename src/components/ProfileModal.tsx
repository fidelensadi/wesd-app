import React from 'react';
import { X, User, Phone, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleViewSignedContracts = () => {
    navigate('/signed-contracts');
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 z-50 animate-scale-up">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center touch-feedback"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {user.name}
            </h3>
            <p className="text-gray-500">
              {user.email}
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Phone className="w-5 h-5" />
              <span className="font-medium">{user.phone}</span>
            </div>

            <div className="w-full space-y-3">
              <button
                onClick={handleViewSignedContracts}
                className="w-full py-3 px-4 bg-gray-100 rounded-xl flex items-center justify-center space-x-2 text-gray-700 hover:bg-gray-200 transition-colors touch-feedback"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Voir les contrats signés</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-100 rounded-xl flex items-center justify-center space-x-2 text-red-700 hover:bg-red-200 transition-colors touch-feedback"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Se déconnecter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};