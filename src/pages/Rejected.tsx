import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { requestApi } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { XCircle, RotateCcw, UserX } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { RequestListSkeleton } from '@/components/skeletons/RequestCardSkeleton'

interface RejectedDeveloper {
	id: string
	name: string
	avatar: string
	bio: string
	skills: string[]
	email?: string
}

const Rejected = () => {
	const [rejected, setRejected] = useState<RejectedDeveloper[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

	useEffect(() => {
		fetchRejected()
	}, [])

	const fetchRejected = async () => {
		setIsLoading(true)
		const response = await requestApi.getRejected()

		if (response.success && response.data) {
			const mappedDevs: RejectedDeveloper[] = response.data.map((user) => {
				// Construct name from firstName and lastName, fallback to email or username
				const firstName = user.firstName || ''
				const lastName = user.lastName || ''
				const fullName =
					firstName && lastName
						? `${firstName} ${lastName}`
						: firstName ||
						  lastName ||
						  user.username ||
						  user.email ||
						  'Unknown User'

				return {
					id: user._id,
					name: fullName,
					avatar: user.profileUrl || '/placeholder.svg',
					bio: user.bio || 'No bio available',
					skills: user.skills || [],
					email: user.email,
				}
			})
			setRejected(mappedDevs)
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to fetch passed developers',
				variant: 'destructive',
			})
		}
		setIsLoading(false)
	}

	const handleReconsider = async (userId: string, name: string) => {
		setProcessingIds((prev) => new Set(prev).add(userId))

		// Send request - backend will update existing ignored connection to interested
		const response = await requestApi.sendRequest(userId, 'interested')

		if (response.success) {
			setRejected((prev) => prev.filter((dev) => dev.id !== userId))
			toast({
				title: '💚 Reconsidered!',
				description: `You've shown interest in ${name} again!`,
			})
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to reconsider',
				variant: 'destructive',
			})
		}

		setProcessingIds((prev) => {
			const next = new Set(prev)
			next.delete(userId)
			return next
		})
	}

	return (
		<div className="flex flex-col bg-background min-h-screen">
			<div
				className="fixed inset-0 opacity-30 pointer-events-none"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={0} />

			<main className="flex-1 mx-auto px-4 py-6 w-full max-w-2xl">
				<div className="flex items-center gap-2 mb-6">
					<XCircle className="w-6 h-6 text-muted-foreground" />
					<h1 className="font-bold text-foreground text-2xl">
						Passed Developers
					</h1>
				</div>

				<p className="mb-6 text-muted-foreground text-sm">
					Developers you previously passed on. Changed your mind? Give them
					another chance!
				</p>

				{isLoading ? (
					<RequestListSkeleton />
				) : rejected.length === 0 ? (
					<Card className="bg-card/50 backdrop-blur-sm border-border/50">
						<CardContent className="flex flex-col justify-center items-center py-12">
							<UserX className="mb-4 w-12 h-12 text-muted-foreground" />
							<p className="text-muted-foreground text-center">
								You haven't passed on anyone yet.
							</p>
							<Button
								variant="default"
								className="mt-4"
								onClick={() => (window.location.href = '/')}>
								Start Swiping
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="gap-4 grid">
						{rejected.map((dev) => (
							<Card
								key={dev.id}
								className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar className="border-2 border-muted-foreground/30 w-16 h-16">
											<AvatarImage src={dev.avatar} alt={dev.name} />
											<AvatarFallback className="bg-muted text-muted-foreground">
												{dev.name
													.split(' ')
													.map((n) => n[0])
													.join('')
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 min-w-0">
											<h3 className="mb-1 font-semibold text-foreground truncate">
												{dev.name}
											</h3>

											<p className="mb-3 text-muted-foreground text-sm line-clamp-2">
												{dev.bio}
											</p>

											<div className="flex flex-wrap gap-1.5 mb-4">
												{dev.skills.slice(0, 4).map((skill) => (
													<Badge
														key={skill}
														variant="secondary"
														className="text-xs">
														{skill}
													</Badge>
												))}
												{dev.skills.length > 4 && (
													<Badge variant="outline" className="text-xs">
														+{dev.skills.length - 4}
													</Badge>
												)}
											</div>

											<Button
												size="sm"
												onClick={() => handleReconsider(dev.id, dev.name)}
												disabled={processingIds.has(dev.id)}
												className="gap-2">
												<RotateCcw className="w-4 h-4" />
												Reconsider
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</main>
		</div>
	)
}

export default Rejected
