import { motion } from 'framer-motion';
import { RefreshCw, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onRefresh: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
        <Code2 className="w-10 h-10 text-muted-foreground" />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">
        No more devs nearby
      </h3>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        You've seen everyone in your area. Check back later or expand your search criteria.
      </p>
      
      <Button variant="neon" onClick={onRefresh}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh Profiles
      </Button>
    </motion.div>
  );
}
