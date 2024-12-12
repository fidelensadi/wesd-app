import React from 'react';
import { UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProfileButtonProps {
  onClick: () => void;
}

export const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-gray-100 touch-feedback"
      aria-label="Voir le profil"
    >
      <UserCircle className="w-6 h-6 text-gray-600" />
    </button>
  );
};