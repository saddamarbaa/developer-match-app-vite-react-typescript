import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DevCard } from '@/components/DevCard';
import { SwipeButtons } from '@/components/SwipeButtons';
import { MatchModal } from '@/components/MatchModal';
import { Header } from '@/components/Header';
import { EmptyState } from '@/components/EmptyState';
import { developers } from '@/data/developers';
import { Developer, SwipeDirection } from '@/types/developer';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<Developer[]>([]);
  const [matchedDev, setMatchedDev] = useState<Developer | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [allDevs, setAllDevs] = useState(developers);

  const currentDev = allDevs[currentIndex];
  const nextDev = allDevs[currentIndex + 1];
  const isComplete = currentIndex >= allDevs.length;

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (!currentDev) return;

    setHistory((prev) => [...prev, currentIndex]);

    if (direction === 'right') {
      // Simulate 30% match chance
      if (Math.random() > 0.7) {
        setMatches((prev) => [...prev, currentDev]);
        setMatchedDev(currentDev);
      } else {
        toast({
          title: '💚 Liked!',
          description: `You liked ${currentDev.name}. They'll be notified!`,
        });
      }
    } else if (direction === 'up') {
      // Super like always matches (demo)
      setMatches((prev) => [...prev, currentDev]);
      setMatchedDev(currentDev);
    } else {
      toast({
        title: 'Passed',
        description: `You passed on ${currentDev.name}`,
        variant: 'default',
      });
    }

    setCurrentIndex((prev) => prev + 1);
  }, [currentDev, currentIndex]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prevIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentIndex(prevIndex);
  }, [history]);

  const handleRefresh = useCallback(() => {
    setCurrentIndex(0);
    setHistory([]);
    // Shuffle developers
    setAllDevs([...developers].sort(() => Math.random() - 0.5));
  }, []);

  const handleMessage = () => {
    toast({
      title: '💬 Coming soon!',
      description: 'Messaging feature is under development',
    });
    setMatchedDev(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background gradient */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-30"
        style={{ background: 'var(--gradient-radial)' }}
      />

      <Header matchCount={matches.length} />

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-4 pb-4">
        {/* Card stack */}
        <div className="flex-1 relative mt-4 mb-4">
          {isComplete ? (
            <EmptyState onRefresh={handleRefresh} />
          ) : (
            <AnimatePresence mode="popLayout">
              {/* Next card (behind) */}
              {nextDev && (
                <DevCard
                  key={nextDev.id + '-bg'}
                  developer={nextDev}
                  onSwipe={() => {}}
                  isTop={false}
                />
              )}
              
              {/* Current card (top) */}
              {currentDev && (
                <DevCard
                  key={currentDev.id}
                  developer={currentDev}
                  onSwipe={handleSwipe}
                  isTop={true}
                />
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Swipe buttons */}
        <SwipeButtons
          onSwipe={handleSwipe}
          onUndo={handleUndo}
          canUndo={history.length > 0}
          disabled={isComplete}
        />
      </main>

      {/* Match modal */}
      <MatchModal
        developer={matchedDev}
        onClose={() => setMatchedDev(null)}
        onMessage={handleMessage}
      />
    </div>
  );
};

export default Index;
