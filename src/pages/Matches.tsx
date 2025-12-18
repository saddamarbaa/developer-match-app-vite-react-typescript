import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { requestApi } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Github } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { MatchListSkeleton } from '@/components/skeletons/MatchCardSkeleton'

interface Connection {
	id: string
	name: string
	avatar: string
	bio: string
	skills: string[]
	github?: string
}

const Matches = () => {
	const [connections, setConnections] = useState<Connection[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchConnections = async () => {
			setIsLoading(true)
			const response = await requestApi.getConnections()
			if (response.success && response.data) {
				const mappedConnections: Connection[] = response.data.map((conn) => {
					// The other user in the connection (could be fromUserId or toUserId)
					const otherUser = conn.fromUserId || conn.toUserId
					return {
						id: otherUser._id,
						name: `${otherUser.firstName} ${otherUser.lastName}`,
						avatar: otherUser.profileUrl || '/placeholder.svg',
						bio: otherUser.bio || 'No bio available',
						skills: otherUser.skills || [],
						github: otherUser.email?.split('@')[0],
					}
				})
				setConnections(mappedConnections)
			} else {
				toast({
					title: 'Error',
					description: response.message || 'Failed to fetch connections',
					variant: 'destructive',
				})
			}
			setIsLoading(false)
		}

		fetchConnections()
	}, [])

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div
				className="fixed inset-0 pointer-events-none opacity-30"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={connections.length} />

			<main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
				<h1 className="text-2xl font-bold text-foreground mb-6">
					Your Matches
				</h1>

				{isLoading ? (
					<MatchListSkeleton />
				) : connections.length === 0 ? (
					<Card className="bg-card/50 backdrop-blur-sm border-border/50">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<p className="text-muted-foreground text-center">
								No matches yet. Start swiping to find your dev match!
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
					<div className="grid gap-4">
						{connections.map((connection) => (
							<Card
								key={connection.id}
								className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar className="w-16 h-16 border-2 border-primary/30">
											<AvatarImage
												src={connection.avatar}
												alt={connection.name}
											/>
											<AvatarFallback className="bg-primary/20 text-primary">
												{connection.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<h3 className="font-semibold text-foreground truncate">
													{connection.name}
												</h3>
												{connection.github && (
													<a
														href={`https://github.com/${connection.github}`}
														target="_blank"
														rel="noopener noreferrer"
														className="text-muted-foreground hover:text-primary transition-colors">
														<Github className="w-4 h-4" />
													</a>
												)}
											</div>

											<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
												{connection.bio}
											</p>

											<div className="flex flex-wrap gap-1.5 mb-3">
												{connection.skills.slice(0, 4).map((skill) => (
													<Badge
														key={skill}
														variant="secondary"
														className="text-xs">
														{skill}
													</Badge>
												))}
												{connection.skills.length > 4 && (
													<Badge variant="outline" className="text-xs">
														+{connection.skills.length - 4}
													</Badge>
												)}
											</div>

											<Button
												size="sm"
												onClick={() =>
													(window.location.href = `/chat/${connection.id}`)
												}
												className="gap-2">
												<MessageCircle className="w-4 h-4" />
												Message
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

export default Matches
