import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { requestApi } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ConversationListSkeleton } from '@/components/skeletons/ConversationSkeleton'
import { Button } from '@/components/ui/button'

interface Conversation {
	id: string
	name: string
	avatar: string
	lastMessage: string
	timestamp: string
	unread: boolean
}

const Messages = () => {
	const navigate = useNavigate()
	const [conversations, setConversations] = useState<Conversation[]>([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const fetchConversations = async () => {
			setIsLoading(true)
			const response = await requestApi.getConnections()
			if (response.success && response.data) {
				// Map connections to conversations (mock last messages for UI demo)
				const mappedConversations: Conversation[] = response.data.map(
					(conn, index) => {
						const otherUser = conn.fromUserId || conn.toUserId
						return {
							id: otherUser._id,
							name: `${otherUser.firstName} ${otherUser.lastName}`,
							avatar: otherUser.profileUrl || '/placeholder.svg',
							lastMessage:
								index === 0
									? 'Hey! Would you like to collaborate?'
									: 'Looking forward to working together!',
							timestamp: index === 0 ? '2m ago' : '1h ago',
							unread: index === 0,
						}
					},
				)
				setConversations(mappedConversations)
			} else {
				toast({
					title: 'Error',
					description: response.message || 'Failed to fetch conversations',
					variant: 'destructive',
				})
			}
			setIsLoading(false)
		}

		fetchConversations()
	}, [])

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div
				className="fixed inset-0 pointer-events-none opacity-30"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			<Header matchCount={conversations.filter((c) => c.unread).length} />

			<main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
				<div className="flex items-center gap-2 mb-6">
					<MessageCircle className="w-6 h-6 text-primary" />
					<h1 className="text-2xl font-bold text-foreground">Messages</h1>
				</div>

				{isLoading ? (
					<ConversationListSkeleton />
				) : conversations.length === 0 ? (
					<Card className="bg-card/50 backdrop-blur-sm border-border/50">
						<CardContent className="flex flex-col items-center justify-center py-12">
							<MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
							<p className="text-muted-foreground text-center mb-2">
								No conversations yet.
							</p>
							<p className="text-sm text-muted-foreground text-center">
								Match with developers to start chatting!
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
					<div className="space-y-2">
						{conversations.map((conversation) => (
							<Card
								key={conversation.id}
								className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
								onClick={() => navigate(`/chat/${conversation.id}`)}>
								<CardContent className="p-4">
									<div className="flex items-center gap-3">
										<div className="relative">
											<Avatar className="w-12 h-12 border border-primary/30">
												<AvatarImage
													src={conversation.avatar}
													alt={conversation.name}
												/>
												<AvatarFallback className="bg-primary/20 text-primary">
													{conversation.name
														.split(' ')
														.map((n) => n[0])
														.join('')}
												</AvatarFallback>
											</Avatar>
											{conversation.unread && (
												<span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
											)}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-1">
												<h3
													className={`font-semibold truncate ${
														conversation.unread
															? 'text-foreground'
															: 'text-muted-foreground'
													}`}>
													{conversation.name}
												</h3>
												<span className="text-xs text-muted-foreground shrink-0">
													{conversation.timestamp}
												</span>
											</div>
											<p
												className={`text-sm truncate ${
													conversation.unread
														? 'text-foreground'
														: 'text-muted-foreground'
												}`}>
												{conversation.lastMessage}
											</p>
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

export default Messages
