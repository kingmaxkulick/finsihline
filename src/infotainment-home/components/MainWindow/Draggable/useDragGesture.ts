/**
* Custom hook for implementing draggable dismiss gestures.
* Provides touch and mouse event handling for vertical drag interactions,
* with automatic closing behavior when a threshold is exceeded.
* 
* Useful for modal sheets, bottom drawers, and swipe-to-dismiss UI elements.
*/

import { useState, useRef, useEffect } from 'react';

interface DragGestureOptions {
  onClose: () => void;
  dismissThreshold?: number;
}

export const useDragGesture = ({ onClose, dismissThreshold = 100 }: DragGestureOptions) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent): void => {
    setIsDragging(true);
    startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    currentY.current = dragY;
  };

  const handleTouchMove = (e: TouchEvent | MouseEvent): void => {
    if (!isDragging) return;

    const currentTouchY = 'touches' in e 
      ? (e as TouchEvent).touches[0].clientY 
      : (e as MouseEvent).clientY;
    
    const deltaY = currentTouchY - startY.current;
    // Only allow downward dragging
    const newY = Math.max(0, currentY.current + deltaY);
    setDragY(newY);
  };

  const handleTouchEnd = (): void => {
    if (!isDragging) return;

    if (dragY > dismissThreshold) {
      setDragY(window.innerHeight);
      setTimeout(onClose, 300); // Using a standard transition time
    } else {
      setDragY(0);
    }
    
    setIsDragging(false);
  };

  // Set up and clean up event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleTouchMove);
      window.addEventListener('mouseup', handleTouchEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleTouchMove);
      window.removeEventListener('mouseup', handleTouchEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragY]);

  return {
    isDragging,
    dragY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    setDragY  // Expose setDragY in case direct manipulation is needed
  };
};