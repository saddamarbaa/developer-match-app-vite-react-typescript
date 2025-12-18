import { motion, type Transition, type Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
	children: ReactNode
}

const pageVariants: Variants = {
	initial: {
		opacity: 0,
		y: 20,
	},
	animate: {
		opacity: 1,
		y: 0,
	},
	exit: {
		opacity: 0,
		y: -20,
	},
}

const pageTransition: Transition = {
	type: 'tween',
	ease: [0.25, 0.46, 0.45, 0.94],
	duration: 0.25,
}

export function PageTransition({ children }: PageTransitionProps) {
	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
			transition={pageTransition}
			className="w-full h-full">
			{children}
		</motion.div>
	)
}
