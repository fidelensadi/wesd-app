import React from 'react';
import { Check, FileText, X } from 'lucide-react';

interface DownloadNotificationProps {
  fileName: string;
  fileUrl: string;
  onClose: () => void;
}

export const DownloadNotification: React.FC<DownloadNotificationProps> = ({
  fileName,
  fileUrl,
  onClose,
}) => {
  const handleOpen = () => {
    window.open(fileUrl, '_blank');
  };

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

          {/* Success icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Document téléchargé avec succès
            </h3>
            <p className="text-sm text-gray-500">
              {fileName}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleOpen}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium touch-feedback flex items-center justify-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              Ouvrir le document
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium touch-feedback"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};