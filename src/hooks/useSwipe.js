import { useRef, useState } from 'react';

export function useSwipe({ threshold = 80, onSwipeLeft, onSwipeRight }) {
  const startXRef = useRef(0);
  const activeRef = useRef(false);
  const [offsetX, setOffsetX] = useState(0);

  const onPointerDown = (event) => {
    activeRef.current = true;
    startXRef.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!activeRef.current) {
      return;
    }

    const delta = event.clientX - startXRef.current;
    const limitedDelta = Math.max(-110, Math.min(110, delta));
    setOffsetX(limitedDelta);
  };

  const onPointerUp = (event) => {
    if (!activeRef.current) {
      return;
    }

    const delta = event.clientX - startXRef.current;
    activeRef.current = false;

    if (delta <= -threshold) {
      onSwipeLeft?.();
    }

    if (delta >= threshold) {
      onSwipeRight?.();
    }

    setOffsetX(0);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const onPointerCancel = () => {
    activeRef.current = false;
    setOffsetX(0);
  };

  return {
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
    offsetX,
  };
}
