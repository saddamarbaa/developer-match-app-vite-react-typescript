import { motion, AnimatePresence } from 'framer-motion';
import { Developer } from '@/types/developer';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

interface MatchModalProps {
  developer: Developer | null;
  onClose: () => void;
  onMessage: () => void;
}

export function MatchModal({ developer, onClose, onMessage }: MatchModalProps) {
  return (
    <AnimatePresence>
      {developer && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative glass-card p-8 max-w-sm w-full text-center space-y-6"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Celebration */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 10 }}
            >
              <h2 className="text-4xl font-bold gradient-text mb-2">It's a Match!</h2>
              <p className="text-muted-foreground text-sm">
                You and {developer.name} both want to connect
              </p>
            </motion.div>

            {/* Avatar */}
            <motion.div
              className="relative mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', damping: 15 }}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg shadow-primary/30 mx-auto">
                <img
                  src={developer.avatar}
                  alt={developer.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {developer.title}
              </motion.div>
            </motion.div>

            {/* Actions */}
            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button variant="neon" size="lg" onClick={onMessage} className="w-full">
                <MessageCircle className="w-5 h-5 mr-2" />
                Send a Message
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full">
                Keep Swiping
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
