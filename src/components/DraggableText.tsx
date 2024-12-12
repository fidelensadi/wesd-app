import React, { useCallback } from 'react';
import { X } from 'lucide-react';
import type { TextPosition } from '../types/household';

interface DraggableTextProps {
  text: string;
  position: TextPosition;
  onPositionChange: (position: Partial<TextPosition>) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  containerWidth: number;
  onRemove?: () => void;
}

export const DraggableText: React.FC<DraggableTextProps> = ({
  text,
  position,
  onPositionChange,
  containerRef,
  containerWidth,
  onRemove,
}) => {
  const handleMove = useCallback((clientX: number, clientY: number, startX: number, startY: number) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const newX = Math.max(0, Math.min(clientX - startX, containerWidth - 200));
    const newY = Math.max(0, Math.min(clientY - startY, rect.height - 30));
    onPositionChange({ x: newX, y: newY });
  }, [containerRef, containerWidth, onPositionChange]);

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
        cursor: 'move',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div className="relative border-2 border-blue-500 rounded-lg p-2 group">
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center touch-feedback shadow-sm"
          >
            <X className="w-4 h-4 text-blue-500" />
          </button>
        )}
        <span className="text-xs font-medium text-gray-900 select-none whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
}