import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { PDFViewer } from '../components/PDFViewer';
import { PDFNavigation } from '../components/PDFNavigation';
import { ErrorMessage } from '../components/ErrorMessage';
import { DownloadNotification } from '../components/DownloadNotification';
import { SignatureModal } from '../components/SignatureModal';
import { usePDFNavigation } from '../hooks/usePDFNavigation';
import { useSignaturePosition } from '../hooks/useSignaturePosition';
import { useTextPositions } from '../hooks/useTextPositions';
import { addSignatureToPDF } from '../utils/pdfUtils';
import { householdService } from '../services/householdService';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import type { Household } from '../types/household';

export const SignaturePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; fileName: string } | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const navigation = usePDFNavigation();
  const { position: signaturePosition, updatePosition: updateSignaturePosition } = useSignaturePosition(navigation.pageNumber - 1);
  const { positions: textPositions, updatePosition: updateTextPosition } = useTextPositions(navigation.pageNumber - 1);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load contract PDF on component mount
  useEffect(() => {
    const loadContractPDF = async () => {
      try {
        const response = await fetch('/contrat.pdf');
        if (!response.ok) throw new Error('Failed to load contract PDF');
        
        const blob = await response.blob();
        const file = new File([blob], 'contrat.pdf', { type: 'application/pdf' });
        setPdfFile(file);
      } catch (err) {
        console.error('Error loading contract:', err);
        setError('Impossible de charger le contrat');
      }
    };

    loadContractPDF();
  }, []);

  // Load household data
  const refreshHouseholdData = () => {
    if (!id) return;
    
    try {
      const households = householdService.getHouseholds();
      const found = households.find(h => h.id === parseInt(id, 10));
      if (found) {
        setHousehold(found);
      } else {
        setError('Ménage non trouvé');
      }
    } catch (err) {
      console.error('Error loading household:', err);
      setError('Erreur lors du chargement des données du ménage');
    }
  };

  useEffect(() => {
    refreshHouseholdData();
  }, [id]);

  useEffect(() => {
    const unsubscribe = householdService.subscribe(() => {
      refreshHouseholdData();
    });
    return () => unsubscribe();
  }, [id]);

  const handleSignatureSave = (signatureDataUrl: string) => {
    setSignature(signatureDataUrl);
    setError(null);
    setShowSignatureModal(false);
  };

  const handleSignatureRemove = () => {
    setSignature(null);
  };

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    navigation.setTotalPages(numPages);
  };

  const handleBack = () => {
    navigate(-1);
    setError(null);
  };

  const handleSignDocument = async () => {
    if (!pdfFile || !signature || !user || !household) {
      setError('Veuillez ajouter une signature');
      return;
    }

    try {
      setError(null);
      const signedPdfBytes = await addSignatureToPDF(
        pdfFile,
        signature,
        signaturePosition,
        textPositions,
        household,
        user
      );
      
      const fileName = `signed_${household.userName || 'document'}_${pdfFile.name}`;
      const blob = new Blob([signedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      setDownloadInfo({ url, fileName });

      // Mark household as signed
      householdService.markAsSigned(household.id, user.email);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup URL after 5 minutes
      setTimeout(() => {
        URL.revokeObjectURL(url);
        setDownloadInfo(null);
      }, 300000);

      // Navigate back after successful signing
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error signing PDF:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors de la signature du PDF'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-padding">
      <Header />

      <main className="pt-16 pb-4 px-4">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg touch-feedback flex items-center text-gray-600 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <ErrorMessage message={error} />
        
        <div className="space-y-4">
          {pdfFile && (
            <div className="space-y-4 pb-24">
              <PDFViewer
                file={pdfFile}
                onLoadSuccess={handleDocumentLoadSuccess}
                pageNumber={navigation.pageNumber}
                signature={signature}
                signaturePosition={signaturePosition}
                onSignaturePositionChange={updateSignaturePosition}
                onSignatureRemove={handleSignatureRemove}
                household={household}
                textPositions={textPositions}
                onTextPositionChange={updateTextPosition}
              />
              
              <PDFNavigation navigation={navigation} />

              <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-t-lg safe-area-padding">
                <div className="max-w-[calc(100%-40px)] mx-auto">
                  {!signature ? (
                    <button
                      onClick={() => setShowSignatureModal(true)}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium touch-feedback"
                    >
                      Ajouter une signature
                    </button>
                  ) : (
                    <button
                      onClick={handleSignDocument}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium touch-feedback"
                    >
                      Télécharger le document signé
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showSignatureModal && (
        <SignatureModal
          onSave={handleSignatureSave}
          onClose={() => setShowSignatureModal(false)}
        />
      )}

      {downloadInfo && (
        <DownloadNotification
          fileName={downloadInfo.fileName}
          fileUrl={downloadInfo.url}
          onClose={() => setDownloadInfo(null)}
        />
      )}
    </div>
  );
};