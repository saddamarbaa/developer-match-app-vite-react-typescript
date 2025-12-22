import { useState, useCallback, useEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DevCard } from '@/components/DevCard'
import { SwipeButtons } from '@/components/SwipeButtons'
import { MatchModal } from '@/components/MatchModal'
import { Header } from '@/components/Header'
import { EmptyState } from '@/components/EmptyState'
import { FeedFilters } from '@/components/FeedFilters'
import { DevCardSkeleton } from '@/components/skeletons/DevCardSkeleton'
import { Developer, SwipeDirection } from '@/types/developer'
import { toast } from '@/hooks/use-toast'
import { feedApi, requestApi } from '@/lib/api'
const Index = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [matches, setMatches] = useState<Developer[]>([])
	const [matchedDev, setMatchedDev] = useState<Developer | null>(null)
	const [history, setHistory] = useState<number[]>([])
	const [allDevs, setAllDevs] = useState<Developer[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedSkills, setSelectedSkills] = useState<string[]>([])

	const fetchFeed = useCallback(async () => {
		setIsLoading(true)
		const response = await feedApi.getFeed()
		if (response.success && response.data) {
			const mappedDevs: Developer[] = response.data?.users?.map((user) => {
				return {
					id: user._id,
					name:
						user?.username ||
						user?.firstName ||
						user.lastName ||
						user.email ||
						'Unknown User',
					age: 25, // Default age as API doesn't provide it
					avatar: user.profileUrl || '/placeholder.svg',
					title: user.bio?.split('.')[0] || 'Developer',
					bio: user.bio || 'No bio available',
					location: 'Remote',
					experience: 2,
					skills: user.skills || [],
					lookingFor: 'collaborator' as const,
					github: user.email?.split('@')[0],
					availability: 'flexible' as const,
				}
			})
			setAllDevs(mappedDevs)
			setCurrentIndex(0)
			setHistory([])
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to fetch developers',
				variant: 'destructive',
			})
		}
		setIsLoading(false)
	}, [])

	useEffect(() => {
		fetchFeed()
	}, [fetchFeed])

	// Filter developers based on search and skills
	const filteredDevs = useMemo(() => {
		return allDevs.filter((dev) => {
			const matchesSearch = searchQuery
				? dev.name.toLowerCase().includes(searchQuery.toLowerCase())
				: true
			const matchesSkills =
				selectedSkills.length > 0
					? selectedSkills.some((skill) =>
							dev.skills
								.map((s) => s.toLowerCase())
								.includes(skill.toLowerCase()),
					  )
					: true
			return matchesSearch && matchesSkills
		})
	}, [allDevs, searchQuery, selectedSkills])

	const currentDev = filteredDevs[currentIndex]
	const nextDev = filteredDevs[currentIndex + 1]
	const isComplete = currentIndex >= filteredDevs.length

	const handleSwipe = useCallback(
		async (direction: SwipeDirection) => {
			if (!currentDev) return

			setHistory((prev) => [...prev, currentIndex])

			if (direction === 'right' || direction === 'up') {
				// Send connection request to API
				const response = await requestApi.sendRequest(
					currentDev.id,
					'interested',
				)

				if (response.success) {
					if (
						response.message?.toLowerCase().includes('match') ||
						direction === 'up'
					) {
						setMatches((prev) => [...prev, currentDev])
						setMatchedDev(currentDev)
					} else {
						toast({
							title: '💚 Liked!',
							description: `You liked ${currentDev.name}. They'll be notified!`,
						})
					}
				} else {
					toast({
						title: 'Request sent',
						description:
							response.message ||
							`Connection request sent to ${currentDev.name}`,
					})
				}
			} else {
				// Send ignored request
				await requestApi.sendRequest(currentDev.id, 'ignored')
				toast({
					title: 'Passed',
					description: `You passed on ${currentDev.name}`,
					variant: 'default',
				})
			}

			setCurrentIndex((prev) => prev + 1)
		},
		[currentDev, currentIndex],
	)

	const handleUndo = useCallback(() => {
		if (history.length === 0) return
		const prevIndex = history[history.length - 1]
		setHistory((prev) => prev.slice(0, -1))
		setCurrentIndex(prevIndex)
	}, [history])

	const handleRefresh = useCallback(() => {
		fetchFeed()
	}, [fetchFeed])

	const handleMessage = () => {
		toast({
			title: '💬 Coming soon!',
			description: 'Messaging feature is under development',
		})
		setMatchedDev(null)
	}

	return (
		<div className="flex flex-col bg-background min-h-screen">
			{/* Background gradient */}
			<div
				className="fixed inset-0 opacity-30 pointer-events-none"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={matches.length} />

			<main className="flex flex-col flex-1 mx-auto px-4 pb-4 w-full max-w-md">
				{/* Search and Filters */}
				<FeedFilters
					searchQuery={searchQuery}
					onSearchChange={(query) => {
						setSearchQuery(query)
						setCurrentIndex(0)
						setHistory([])
					}}
					selectedSkills={selectedSkills}
					onSkillsChange={(skills) => {
						setSelectedSkills(skills)
						setCurrentIndex(0)
						setHistory([])
					}}
				/>
				{/* Card stack */}
				<div className="relative flex-1 mb-4">
					{isLoading ? (
						<DevCardSkeleton />
					) : isComplete ? (
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

				{/* Swipe buttons  */}
				{!isLoading && !isComplete && (
					<SwipeButtons
						onSwipe={handleSwipe}
						onUndo={handleUndo}
						canUndo={history.length > 0}
						disabled={isComplete}
					/>
				)}
			</main>

			{/* Match modal */}
			<MatchModal
				developer={matchedDev}
				onClose={() => setMatchedDev(null)}
				onMessage={handleMessage}
			/>
		</div>
	)
}

export default Index
