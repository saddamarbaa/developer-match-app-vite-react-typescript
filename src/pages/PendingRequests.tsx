import { useState, useEffect } from 'react'
import { Header } from '@/components/Header'
import { requestApi } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Check, X, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface PendingRequest {
	requestId: string
	id: string
	name: string
	avatar: string
	bio: string
	skills: string[]
}

const PendingRequests = () => {
	const [requests, setRequests] = useState<PendingRequest[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

	useEffect(() => {
		fetchPendingRequests()
	}, [])

	const fetchPendingRequests = async () => {
		setIsLoading(true)
		const response = await requestApi.getPendingRequests()
		if (response.success && response.data) {
			const mappedRequests: PendingRequest[] = response.data.map((req) => ({
				requestId: req._id,
				id: req.fromUserId._id,
				name: `${req.fromUserId.firstName} ${req.fromUserId.lastName}`,
				avatar: req.fromUserId.profileUrl || '/placeholder.svg',
				bio: req.fromUserId.bio || 'No bio available',
				skills: req.fromUserId.skills || [],
			}))
			setRequests(mappedRequests)
		} else {
			toast({
				title: 'Error',
				description: response.message || 'Failed to fetch pending requests',
				variant: 'destructive',
			})
		}
		setIsLoading(false)
	}

	const handleRequest = async (
		requestId: string,
		status: 'accepted' | 'rejected',
	) => {
		setProcessingIds((prev) => new Set(prev).add(requestId))

		const response = await requestApi.reviewRequest(requestId, status)

		if (response.success) {
			setRequests((prev) => prev.filter((req) => req.requestId !== requestId))
			toast({
				title:
					status === 'accepted'
						? '🎉 Connection Accepted!'
						: 'Request Rejected',
				description:
					status === 'accepted'
						? 'You can now message this developer!'
						: 'The request has been declined.',
			})
		} else {
			toast({
				title: 'Error',
				description: response.message || `Failed to ${status} request`,
				variant: 'destructive',
			})
		}

		setProcessingIds((prev) => {
			const next = new Set(prev)
			next.delete(requestId)
			return next
		})
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div
				className="fixed inset-0 pointer-events-none opacity-30"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={0} />

			<main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
				<div className="flex items-center gap-2 mb-6">
					<Clock className="w-6 h-6 text-primary" />
					<h1 className="text-2xl font-bold text-foreground">
						Pending Requests
					</h1>
				</div>

				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<div className="text-muted-foreground">Loading requests...</div>
					</div>
				) : requests.length === 0 ? (
					<Card className="bg-card/50 backdrop-blur-sm border-border/50">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<Clock className="w-12 h-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground text-center">
								No pending requests at the moment.
							</p>
							<Button
								variant="default"
								className="mt-4"
								onClick={() => (window.location.href = '/')}>
								Find Developers
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4">
						{requests.map((request) => (
							<Card
								key={request.requestId}
								className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
								<CardContent className="p-4">
									<div className="flex items-start gap-4">
										<Avatar className="w-16 h-16 border-2 border-primary/30">
											<AvatarImage src={request.avatar} alt={request.name} />
											<AvatarFallback className="bg-primary/20 text-primary">
												{request.name
													.split(' ')
													.map((n) => n[0])
													.join('')}
											</AvatarFallback>
										</Avatar>

										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-foreground truncate mb-1">
												{request.name}
											</h3>

											<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
												{request.bio}
											</p>

											<div className="flex flex-wrap gap-1.5 mb-4">
												{request.skills.slice(0, 4).map((skill) => (
													<Badge
														key={skill}
														variant="secondary"
														className="text-xs">
														{skill}
													</Badge>
												))}
												{request.skills.length > 4 && (
													<Badge variant="outline" className="text-xs">
														+{request.skills.length - 4}
													</Badge>
												)}
											</div>

											<div className="flex gap-2">
												<Button
													size="sm"
													onClick={() =>
														handleRequest(request.requestId, 'accepted')
													}
													disabled={processingIds.has(request.requestId)}
													className="gap-2 bg-green-600 hover:bg-green-700">
													<Check className="w-4 h-4" />
													Accept
												</Button>
												<Button
													size="sm"
													variant="outline"
													onClick={() =>
														handleRequest(request.requestId, 'rejected')
													}
													disabled={processingIds.has(request.requestId)}
													className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10">
													<X className="w-4 h-4" />
													Reject
												</Button>
											</div>
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

export default PendingRequests
