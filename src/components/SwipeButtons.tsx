import { Button } from '@/components/ui/button';
import { X, Heart, Star, RotateCcw } from 'lucide-react';
import { SwipeDirection } from '@/types/developer';

interface SwipeButtonsProps {
  onSwipe: (direction: SwipeDirection) => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled: boolean;
}

export function SwipeButtons({ onSwipe, onUndo, canUndo, disabled }: SwipeButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-6">
      <Button
        variant="glass"
        size="iconLg"
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className="rounded-full opacity-75"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      <Button
        variant="pass"
        size="iconXl"
        onClick={() => onSwipe('left')}
        disabled={disabled}
      >
        <X className="w-7 h-7" />
      </Button>

      <Button
        variant="superlike"
        size="iconLg"
        onClick={() => onSwipe('up')}
        disabled={disabled}
      >
        <Star className="w-6 h-6" />
      </Button>

      <Button
        variant="like"
        size="iconXl"
        onClick={() => onSwipe('right')}
        disabled={disabled}
      >
        <Heart className="w-7 h-7" />
      </Button>
    </div>
  );
}
