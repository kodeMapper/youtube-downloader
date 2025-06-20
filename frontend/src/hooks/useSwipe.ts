import { useEffect, useState } from 'react';

interface SwipeHandlers {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const useSwipe = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: SwipeHandlers) => {
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);

  // Minimum swipe distance in pixels
  const minSwipeDistance = 60;

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null); // Reset touchEnd
      if (e.touches && e.touches[0]) {
        setTouchStart({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        setTouchEnd({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
      }
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) return;
      
      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
      
      if (isHorizontalSwipe) {
        if (Math.abs(distanceX) > minSwipeDistance) {
          // Horizontal swipe detected
          if (distanceX > 0) {
            onSwipeLeft && onSwipeLeft();
          } else {
            onSwipeRight && onSwipeRight();
          }
        }
      } else {
        if (Math.abs(distanceY) > minSwipeDistance) {
          // Vertical swipe detected
          if (distanceY > 0) {
            onSwipeUp && onSwipeUp();
          } else {
            onSwipeDown && onSwipeDown();
          }
        }
      }
      
      // Reset after checking
      setTouchStart(null);
      setTouchEnd(null);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, touchStart, touchEnd]);
};

export default useSwipe;
