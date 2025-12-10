import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Developer, SwipeDirection } from '@/types/developer';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Github, Clock } from 'lucide-react';

interface DevCardProps {
  developer: Developer;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

const lookingForLabels: Record<Developer['lookingFor'], string> = {
  collaborator: '🤝 Looking for collaborator',
  mentor: '🎓 Wants to mentor',
  mentee: '📚 Seeking mentorship',
  cofounder: '🚀 Finding co-founder',
  friend: '👋 Making dev friends',
};

const availabilityLabels: Record<Developer['availability'], string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  'weekends': 'Weekends only',
  'flexible': 'Flexible hours',
};

export function DevCard({ developer, onSwipe, isTop }: DevCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 150;
    const velocityThreshold = 500;
    
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left');
    } else if (info.offset.y < -threshold || info.velocity.y < -velocityThreshold) {
      onSwipe('up');
    }
  };

  if (!isTop) {
    return (
      <div className="absolute inset-0 dev-card rounded-3xl border border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-card" />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 dev-card rounded-3xl border border-border/50 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Like overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-accent/20 z-10 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <div className="border-4 border-accent text-accent text-4xl font-bold px-8 py-4 rounded-xl rotate-[-20deg]">
          MATCH!
        </div>
      </motion.div>

      {/* Nope overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-destructive/20 z-10 pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        <div className="border-4 border-destructive text-destructive text-4xl font-bold px-8 py-4 rounded-xl rotate-[20deg]">
          SKIP
        </div>
      </motion.div>

      {/* Super like overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-primary/20 z-10 pointer-events-none"
        style={{ opacity: superOpacity }}
      >
        <div className="border-4 border-primary text-primary text-4xl font-bold px-8 py-4 rounded-xl">
          SUPER!
        </div>
      </motion.div>

      {/* Profile image */}
      <div className="relative h-[55%] overflow-hidden">
        <img
          src={developer.avatar}
          alt={developer.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Profile info */}
      <div className="relative p-6 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {developer.name}, {developer.age}
            </h2>
            <p className="text-primary font-mono text-sm">{developer.title}</p>
          </div>
          {developer.github && (
            <a
              href={`https://github.com/${developer.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>

        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
          {developer.bio}
        </p>

        <div className="flex flex-wrap gap-2">
          {developer.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="tech">
              {skill}
            </Badge>
          ))}
          {developer.skills.length > 5 && (
            <Badge variant="secondary">+{developer.skills.length - 5}</Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {developer.location}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3 h-3" />
            {developer.experience}y exp
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {availabilityLabels[developer.availability]}
          </span>
        </div>

        <div className="pt-2">
          <Badge variant="glow">{lookingForLabels[developer.lookingFor]}</Badge>
        </div>
      </div>
    </motion.div>
  );
}
