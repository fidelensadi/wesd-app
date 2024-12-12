import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { SignaturePosition } from '../hooks/useSignaturePosition';

interface SignaturePreviewProps {
  signature: string;
  position: SignaturePosition;
  onPositionChange: (position: Partial<SignaturePosition>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
  onRemove?: () => void;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  signature,
  position,
  onPositionChange,
  containerRef,
  containerWidth,
  onRemove,
}) => {
  const [dimensions, setDimensions] = useState({ width: 200, height: 100 });

  useEffect(() => {
    // Calculate actual signature dimensions
    const img = new Image();
    img.onload = () => {
      const maxWidth = containerWidth * 0.3;
      const scale = maxWidth / img.width;
      setDimensions({
        width: img.width * scale,
        height: img.height * scale
      });
    };
    img.src = signature;
  }, [signature, containerWidth]);

  const handleMove = useCallback((clientX: number, clientY: number, startX: number, startY: number) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newX = Math.max(0, Math.min(clientX - startX, containerWidth - dimensions.width));
    const newY = Math.max(0, Math.min(clientY - startY, rect.height - dimensions.height));
    onPositionChange({ x: newX, y: newY });
  }, [containerRef, containerWidth, dimensions, onPositionChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.target instanceof HTMLButtonElement) return;

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY, startX, startY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length !== 1 || e.target instanceof HTMLButtonElement) return;

    const touch = e.touches[0];
    const startX = touch.clientX - position.x;
    const startY = touch.clientY - position.y;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY, startX, startY);
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className="absolute touch-none"
      style={{
        left: position.x,
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative w-full h-full border-2 border-blue-500 rounded-lg group">
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center touch-feedback shadow-sm"
          >
            <X className="w-4 h-4 text-blue-500" />
          </button>
        )}
        <img
          src={signature}
          alt="Signature"
          className="w-full h-full object-contain select-none p-2"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
      </div>
    </div>
  );
};