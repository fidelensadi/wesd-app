import React, { useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
  onSave: (signature: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const signaturePad = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (signaturePad.current) {
      signaturePad.current.penColor = 'black';
    }
  }, []);

  const clear = () => {
    signaturePad.current?.clear();
  };

  const save = () => {
    if (signaturePad.current) {
      const canvas = signaturePad.current.getCanvas();
      const context = canvas.getContext('2d');
      
      if (context) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        const newContext = newCanvas.getContext('2d');
        
        if (newContext) {
          newContext.globalCompositeOperation = 'source-over';
          newContext.putImageData(imageData, 0, 0);
          const dataUrl = newCanvas.toDataURL('image/png');
          onSave(dataUrl);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="border rounded-xl overflow-hidden bg-white">
        <SignatureCanvas
          ref={signaturePad}
          canvasProps={{
            className: 'w-full h-40',
            style: {
              background: 'transparent',
              touchAction: 'none'
            }
          }}
          backgroundColor="rgba(0,0,0,0)"
        />
      </div>
      <div className="flex justify-between mt-3">
        <button
          onClick={clear}
          className="flex items-center px-4 py-2 text-red-600 rounded-lg touch-feedback"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Effacer
        </button>
        <button
          onClick={save}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg touch-feedback"
        >
          <Check className="w-4 h-4 mr-2" />
          Valider
        </button>
      </div>
    </div>
  );
};