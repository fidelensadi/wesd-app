import React from 'react';
import { X } from 'lucide-react';
import { SignaturePad } from './SignaturePad';

interface SignatureModalProps {
  onSave: (signature: string) => void;
  onClose: () => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({ onSave, onClose }) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-xl p-6 z-50 animate-scale-up">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center touch-feedback"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Dessinez votre signature
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Utilisez votre doigt ou votre stylet
            </p>
          </div>

          <SignaturePad 
            onSave={(signature) => {
              onSave(signature);
              onClose();
            }} 
          />
        </div>
      </div>
    </>
  );
};