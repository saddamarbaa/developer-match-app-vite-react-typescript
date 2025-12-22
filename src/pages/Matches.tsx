import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { requestApi } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, Github } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { MatchListSkeleton } from '@/components/skeletons/MatchCardSkeleton'
import { Connection } from '@/types/developer'

const Matches = () => {
	const navigate = useNavigate()
	const [connections, setConnections] = useState<Connection[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchConnections = async () => {
			setIsLoading(true)
			const response = await requestApi.getConnections()

			if (response.success && response.data) {
				const mappedConnections: Connection[] = response.data.map(
					(userData) => {
						// Construct name from firstName and lastName
						const firstName = userData.firstName || ''
						const lastName = userData.lastName || ''
						const fullName =
							firstName && lastName
								? `${firstName} ${lastName}`
								: firstName ||
								  lastName ||
								  userData.username ||
								  userData.email ||
								  'Unknown User'

						return {
							id: userData._id,
							_id: userData._id,
							firstName: userData.firstName || '',
							lastName: userData.lastName || '',
							email: userData.email || '',
							gender: userData.gender,
							name: fullName,
							avatar: userData.profileUrl || '/placeholder.svg',
							profileUrl: userData.profileUrl,
							bio: userData.bio || 'No bio available',
							skills: userData.skills || [],
							github: userData.email?.split('@')[0],
						}
					},
				)

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
		<div className="flex flex-col bg-background min-h-screen">
			<div
				className="fixed inset-0 opacity-30 pointer-events-none"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={connections.length} />

			<main className="flex-1 mx-auto px-4 py-6 w-full max-w-2xl">
				<h1 className="mb-6 font-bold text-foreground text-2xl">
					Your Matches
				</h1>

				{isLoading ? (
					<MatchListSkeleton />
				) : connections.length === 0 ? (
					<Card className="bg-card/50 backdrop-blur-sm border-border/50">
						<CardContent className="flex flex-col justify-center items-center py-12">
							<p className="text-muted-foreground text-center">
								No matches yet. Start swiping to find your dev match!
							</p>
							<Button
								variant="default"
								className="mt-4"
								onClick={() => navigate('/')}>
								Start Swiping
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="gap-4 grid">
						{connections.map((connection) => (
							<Card
								key={connection.id}
								className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar className="border-2 border-primary/30 w-16 h-16">
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

											<p className="mb-3 text-muted-foreground text-sm line-clamp-2">
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
												onClick={() => navigate(`/chat/${connection.id}`)}
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
