import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send, Smile } from 'lucide-react'

interface Message {
	id: string
	text: string
	sender: 'me' | 'other'
	timestamp: Date
}

// Mock data for UI demonstration
const mockConversations: Record<
	string,
	{ name: string; avatar: string; messages: Message[] }
> = {
	'1': {
		name: 'Sarah Chen',
		avatar: '/placeholder.svg',
		messages: [
			{
				id: '1',
				text: 'Hey! I saw your profile and loved your React projects!',
				sender: 'other',
				timestamp: new Date(Date.now() - 3600000),
			},
			{
				id: '2',
				text: 'Thanks! Your work on that GraphQL API looks impressive too',
				sender: 'me',
				timestamp: new Date(Date.now() - 3500000),
			},
			{
				id: '3',
				text: 'Would you be interested in collaborating on an open source project?',
				sender: 'other',
				timestamp: new Date(Date.now() - 3400000),
			},
		],
	},
}

const Chat = () => {
	const { id } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])
	const [otherUser, setOtherUser] = useState({
		name: 'Developer',
		avatar: '/placeholder.svg',
	})
	const messagesEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// Load mock conversation or create empty one
		const conversation = mockConversations[id || ''] || {
			name: 'Developer',
			avatar: '/placeholder.svg',
			messages: [],
		}
		setOtherUser({ name: conversation.name, avatar: conversation.avatar })
		setMessages(conversation.messages)
	}, [id])

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSend = () => {
		if (!message.trim()) return

		const newMessage: Message = {
			id: Date.now().toString(),
			text: message,
			sender: 'me',
			timestamp: new Date(),
		}

		setMessages((prev) => [...prev, newMessage])
		setMessage('')

		// Simulate response after a short delay (UI demo only)
		setTimeout(() => {
			const response: Message = {
				id: (Date.now() + 1).toString(),
				text: "That sounds great! Let's discuss more details.",
				sender: 'other',
				timestamp: new Date(),
			}
			setMessages((prev) => [...prev, response])
		}, 1500)
	}

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	}

	return (
		<div className="min-h-screen bg-background flex flex-col">
			<div
				className="fixed inset-0 pointer-events-none opacity-30"
				style={{ background: 'var(--gradient-radial)' }}
			/>

			{/* Chat Header */}
			<header className="flex items-center gap-3 p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate('/messages')}>
					<ArrowLeft className="w-5 h-5" />
				</Button>

				<Avatar className="w-10 h-10 border border-primary/30">
					<AvatarImage src={otherUser.avatar} alt={otherUser.name} />
					<AvatarFallback className="bg-primary/20 text-primary">
						{otherUser.name
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<h2 className="font-semibold text-foreground">{otherUser.name}</h2>
					<p className="text-xs text-green-500">Online</p>
				</div>
			</header>

			{/* Messages */}
			<main className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<Avatar className="w-20 h-20 mb-4 border-2 border-primary/30">
							<AvatarImage src={otherUser.avatar} alt={otherUser.name} />
							<AvatarFallback className="bg-primary/20 text-primary text-2xl">
								{otherUser.name
									.split(' ')
									.map((n) => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
						<p className="text-muted-foreground">
							Start a conversation with {otherUser.name}
						</p>
					</div>
				) : (
					messages.map((msg) => (
						<div
							key={msg.id}
							className={`flex ${
								msg.sender === 'me' ? 'justify-end' : 'justify-start'
							}`}>
							<div
								className={`max-w-[75%] rounded-2xl px-4 py-2 ${
									msg.sender === 'me'
										? 'bg-primary text-primary-foreground rounded-br-md'
										: 'bg-secondary text-secondary-foreground rounded-bl-md'
								}`}>
								<p className="text-sm">{msg.text}</p>
								<p
									className={`text-[10px] mt-1 ${
										msg.sender === 'me'
											? 'text-primary-foreground/70'
											: 'text-muted-foreground'
									}`}>
									{formatTime(msg.timestamp)}
								</p>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</main>

			{/* Message Input */}
			<div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
				<div className="flex items-center gap-2 max-w-2xl mx-auto">
					<Button variant="ghost" size="icon" className="shrink-0">
						<Smile className="w-5 h-5 text-muted-foreground" />
					</Button>
					<Input
						placeholder="Type a message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						className="flex-1 bg-secondary/50 border-border/50"
					/>
					<Button
						size="icon"
						onClick={handleSend}
						disabled={!message.trim()}
						className="shrink-0">
						<Send className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}

export default Chat
