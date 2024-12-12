import React, { useState } from 'react';
import { FileSignature } from 'lucide-react';
import { ProfileButton } from './ProfileButton';
import { ProfileModal } from './ProfileModal';
import { useAuth } from '../contexts/AuthContext';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileSignature className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-lg font-semibold text-gray-900">
                WESD SignPDF
              </h1>
            </div>
            {isAuthenticated && (
              <ProfileButton onClick={() => setShowProfile(true)} />
            )}
          </div>
        </div>
      </header>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </>
  );
};