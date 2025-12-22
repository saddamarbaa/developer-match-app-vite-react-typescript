import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Developer, SwipeDirection } from '@/types/developer'
import { Badge } from '@/components/ui/badge'
import { MapPin, Briefcase, Github, Clock, Star, Sparkles } from 'lucide-react'

interface DevCardProps {
	developer: Developer
	onSwipe: (direction: SwipeDirection) => void
	isTop: boolean
}

const lookingForLabels: Record<Developer['lookingFor'], string> = {
	collaborator: '🤝 Looking for collaborator',
	mentor: '🎓 Wants to mentor',
	mentee: '📚 Seeking mentorship',
	cofounder: '🚀 Finding co-founder',
	friend: '👋 Making dev friends',
}

const availabilityLabels: Record<Developer['availability'], string> = {
	'full-time': 'Full-time',
	'part-time': 'Part-time',
	weekends: 'Weekends only',
	flexible: 'Flexible hours',
}

export function DevCard({ developer, onSwipe, isTop }: DevCardProps) {
	const x = useMotionValue(0)
	const y = useMotionValue(0)

	const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25])
	const likeOpacity = useTransform(x, [0, 100], [0, 1])
	const nopeOpacity = useTransform(x, [-100, 0], [1, 0])
	const superOpacity = useTransform(y, [-100, 0], [1, 0])

	const handleDragEnd = (
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	) => {
		const threshold = 150
		const velocityThreshold = 500

		if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
			onSwipe('right')
		} else if (
			info.offset.x < -threshold ||
			info.velocity.x < -velocityThreshold
		) {
			onSwipe('left')
		} else if (
			info.offset.y < -threshold ||
			info.velocity.y < -velocityThreshold
		) {
			onSwipe('up')
		}
	}

	if (!isTop) {
		return (
			<div className="absolute inset-0 border border-border/50 rounded-3xl overflow-hidden dev-card">
				<div className="absolute inset-0 bg-card" />
			</div>
		)
	}

	return (
		<motion.div
			className="absolute inset-0 border border-border/50 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing dev-card"
			style={{ x, y, rotate }}
			drag
			dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
			dragElastic={0.9}
			onDragEnd={handleDragEnd}
			whileTap={{ scale: 1.02 }}
			initial={{ scale: 0.95, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}>
			{/* Like overlay */}
			<motion.div
				className="z-10 absolute inset-0 flex justify-center items-center bg-accent/20 pointer-events-none"
				style={{ opacity: likeOpacity }}>
				<div className="px-8 py-4 border-4 border-accent rounded-xl font-bold text-accent text-4xl rotate-[-20deg]">
					MATCH!
				</div>
			</motion.div>

			{/* Nope overlay */}
			<motion.div
				className="z-10 absolute inset-0 flex justify-center items-center bg-destructive/20 pointer-events-none"
				style={{ opacity: nopeOpacity }}>
				<div className="px-8 py-4 border-4 border-destructive rounded-xl font-bold text-destructive text-4xl rotate-[20deg]">
					SKIP
				</div>
			</motion.div>

			{/* Super like overlay - Enhanced with stars and sparkles */}
			<motion.div
				className="z-10 absolute inset-0 flex justify-center items-center overflow-hidden pointer-events-none"
				style={{ opacity: superOpacity }}>
				{/* Gradient background burst */}
				<motion.div
					className="absolute inset-0"
					style={{
						background:
							'radial-gradient(circle at center, hsl(var(--primary) / 0.4) 0%, hsl(var(--primary) / 0.2) 40%, transparent 70%)',
						opacity: superOpacity,
					}}
				/>

				{/* Floating sparkles */}
				<motion.div className="top-1/4 left-1/4 absolute">
					<Sparkles
						className="w-8 h-8 text-primary animate-sparkle"
						style={{ animationDelay: '0s' }}
					/>
				</motion.div>
				<motion.div className="top-1/3 right-1/4 absolute">
					<Sparkles
						className="w-6 h-6 text-primary animate-sparkle"
						style={{ animationDelay: '0.2s' }}
					/>
				</motion.div>
				<motion.div className="bottom-1/3 left-1/3 absolute">
					<Sparkles
						className="w-7 h-7 text-primary animate-sparkle"
						style={{ animationDelay: '0.4s' }}
					/>
				</motion.div>
				<motion.div className="right-1/3 bottom-1/4 absolute">
					<Sparkles
						className="w-5 h-5 text-primary animate-sparkle"
						style={{ animationDelay: '0.3s' }}
					/>
				</motion.div>

				{/* Main super like badge */}
				<motion.div className="relative flex flex-col items-center gap-2 animate-super-like">
					<motion.div className="animate-star-spin">
						<Star className="drop-shadow-[0_0_20px_hsl(var(--primary)/0.8)] fill-primary w-16 h-16 text-primary" />
					</motion.div>
					<div className="bg-background/80 shadow-[0_0_30px_hsl(var(--primary)/0.5)] backdrop-blur-sm px-8 py-4 border-4 border-primary rounded-xl font-bold text-primary text-4xl">
						SUPER LIKE!
					</div>
				</motion.div>
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
			<div className="relative space-y-4 p-6">
				<div className="flex justify-between items-end">
					<div>
						<h2 className="font-bold text-foreground text-2xl">
							{developer.name}, {developer.age}
						</h2>
						<p className="font-mono text-primary text-sm">{developer.title}</p>
					</div>
					{developer.github && (
						<a
							href={`https://github.com/${developer.github}`}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-primary transition-colors"
							onClick={(e) => e.stopPropagation()}>
							<Github className="w-5 h-5" />
						</a>
					)}
				</div>

				<p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
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

				<div className="flex items-center gap-4 pt-2 text-muted-foreground text-xs">
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
	)
}
