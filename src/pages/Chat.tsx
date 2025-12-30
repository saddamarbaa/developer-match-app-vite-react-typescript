import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send, Smile } from 'lucide-react'
import { socket } from '@/socket'
import { useAuth } from '@/contexts/AuthContext'
import { chatApi, requestApi } from '@/lib/api'

interface Message {
	id: string
	text: string
	senderId: string
	senderName: string
	timestamp: Date
	readBy?: string[]
	reactions?: Record<string, string[]>
}

const Chat = () => {
	const { user } = useAuth()
	const [otherUser, setOtherUser] = useState(null)
	const { id: otherUserId } = useParams<{ id: string }>()
	const navigate = useNavigate()
	const [isOtherUserOnline, setIsOtherUserOnline] = useState(false)

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])
	const [isConnected, setIsConnected] = useState(false)
	const [isTyping, setIsTyping] = useState(false)

	const messagesEndRef = useRef<HTMLDivElement>(null)
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const chatId = [user.id, otherUserId].sort().join('_')

	useEffect(() => {
		if (!otherUserId) return
		;(async () => {
			const response = await requestApi.getConnections()

			if (!response.success || !response.data) return

			const userData = response.data.find(
				(user) => user?._id?.toString() === otherUserId?.toString(),
			)

			if (!userData) return

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

			setOtherUser({
				id: userData._id,
				_id: userData._id,
				fullName,
				firstName,
				lastName,
				email: userData.email || '',
				gender: userData.gender,
				avatar: userData.profileUrl || '/placeholder.svg',
				profileUrl: userData.profileUrl,
				bio: userData.bio || 'No bio available',
				skills: userData.skills || [],
				github: userData.email?.split('@')[0],
			})
		})()
	}, [otherUserId])

	/* ---------------- SOCKET CONNECTION ---------------- */
	useEffect(() => {
		if (!user?.id || !otherUserId) return

		socket.connect()

		socket.on('connect', () => {
			setIsConnected(true)
			socket.emit('register', user.id)
			socket.emit('joinChatRoom', {
				userId: user.id,
				targetUserId: otherUserId,
			})
		})

		socket.on('receiveMessage', (msg: Message) => {
			setMessages((prev) => [...prev, msg])
		})

		socket.on('typing', ({ userId }) => {
			if (userId !== user.id) setIsTyping(true)
		})

		socket.on('stopTyping', ({ userId }) => {
			if (userId !== user.id) setIsTyping(false)
		})

		socket.on('messageRead', ({ messageId, userId }) => {
			setMessages((prev) =>
				prev.map((msg) =>
					msg.id === messageId
						? { ...msg, readBy: [...(msg.readBy || []), userId] }
						: msg,
				),
			)
		})

		socket.on('userOnline', (onlineUserId: string) => {
			if (onlineUserId === otherUserId) {
				setIsOtherUserOnline(true)
			}
		})

		socket.on('userOffline', (offlineUserId: string) => {
			if (offlineUserId === otherUserId) {
				setIsOtherUserOnline(false)
			}
		})

		socket.on('messageReaction', ({ messageId, emoji, userId }) => {
			setMessages((prev) =>
				prev.map((msg) => {
					if (msg.id !== messageId) return msg
					const reactions = { ...(msg.reactions || {}) }
					reactions[emoji] = [...(reactions[emoji] || []), userId]
					return { ...msg, reactions }
				}),
			)
		})

		socket.on('disconnect', () => setIsConnected(false))

		return () => {
			socket.off('userOnline')
			socket.off('userOffline')
			socket.off()
			socket.disconnect()
		}
	}, [user.id, otherUserId])

	/* ---------------- LOAD CHAT ---------------- */
	useEffect(() => {
		if (!user?.id || !otherUserId) return

		const loadChat = async () => {
			const res = await chatApi.getChat(user.id, otherUserId)

			if (res.success && res.data?.messages) {
				setMessages(
					res.data.messages.map((msg) => ({
						id: msg._id,
						text: msg.text,
						senderId: msg.senderId._id,
						senderName:
							msg.senderId._id === user.id
								? 'You'
								: msg.senderId.firstName + ' ' + msg.senderId?.lastName,
						timestamp: new Date(msg.createdAt),
						// readBy: msg.readBy || [],
						reactions: msg.reactions || {},
					})),
				)
			}
		}

		loadChat()
	}, [user.id, otherUserId])

	/* ---------------- AUTO SCROLL ---------------- */
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	/* ---------------- READ RECEIPT ---------------- */
	useEffect(() => {
		if (!messages.length) return
		const last = messages[messages.length - 1]

		if (last.senderId !== user.id) {
			socket.emit('readMessage', {
				roomId: chatId,
				messageId: last.id,
				userId: user.id,
			})
		}
	}, [messages, chatId, user.id])

	/* ---------------- SEND MESSAGE ---------------- */
	const handleSend = () => {
		if (!message.trim() || !isConnected) return

		const newMessage: Message = {
			id: Date.now().toString(),
			text: message,
			senderId: user.id,
			senderName: 'You',
			timestamp: new Date(),
			readBy: [],
			reactions: {},
		}

		setMessage('')
		socket.emit('sendMessage', { roomId: chatId, message: newMessage })
		socket.emit('stopTyping', { roomId: chatId, userId: user.id })
	}

	/* ---------------- HELPERS ---------------- */
	const formatTime = (date: Date) =>
		new Date(date).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})

	const getDateLabel = (date: Date) => {
		const today = new Date()
		const d = new Date(date)
		const diff =
			(today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / 86400000

		if (diff === 0) return 'Today'
		if (diff === 1) return 'Yesterday'
		return d.toLocaleDateString()
	}

	/* ---------------- UI ---------------- */
	let lastDate = ''

	return (
		<div className="flex flex-col bg-background h-screen">
			{/* HEADER */}
			<header className="flex items-center gap-3 p-4 border-b">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate('/messages')}>
					<ArrowLeft className="w-5 h-5" />
				</Button>

				<Avatar>
					<AvatarImage
						src={(otherUser && otherUser?.avatar) || '/placeholder.svg'}
					/>
					<AvatarFallback>U</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<h2 className="font-semibold">
						{(otherUser && otherUser?.fullName) || 'Chat'}
					</h2>
					<p className="text-muted-foreground text-xs">
						{isTyping ? 'Typing…' : isOtherUserOnline ? 'Online' : 'Offline'}
					</p>
				</div>
			</header>

			{/* MESSAGES */}
			<main className="flex-1 px-4 py-3 overflow-y-auto">
				{messages.map((msg) => {
					const dateLabel = getDateLabel(msg.timestamp)
					const showDate = dateLabel !== lastDate
					lastDate = dateLabel

					return (
						<div key={msg.id} className="mt-4">
							{showDate && (
								<div className="my-4 text-muted-foreground text-xs text-center">
									{dateLabel}
								</div>
							)}

							<div
								className={`flex ${
									msg.senderId === user.id ? 'justify-end' : 'justify-start'
								}`}>
								<div
									className={`relative group max-w-[75%] px-4 py-2 rounded-2xl ${
										msg.senderId === user.id
											? 'bg-primary text-primary-foreground'
											: 'bg-secondary'
									}`}>
									{/* NAME */}
									<p className="opacity-70 mb-1 text-[10px]">
										{msg.senderName}
									</p>

									<p>{msg.text}</p>

									{/* REACTIONS */}
									{msg.reactions && (
										<div className="flex gap-1 mt-1 text-xs">
											{Object.entries(msg.reactions).map(([emoji, users]) => (
												<span
													key={emoji}
													className="bg-muted px-2 py-0.5 rounded-full">
													{emoji} {users.length}
												</span>
											))}
										</div>
									)}

									{/* TIME + READ */}
									<p className="flex justify-end gap-1 opacity-70 mt-1 text-[10px]">
										{formatTime(msg.timestamp)}
										{msg.senderId === user.id && (
											<span>{msg.readBy?.length ? '✔✔' : '✔'}</span>
										)}
									</p>

									{/* REACTION BUTTONS */}
									<div className="hidden -top-6 right-2 absolute group-hover:flex gap-1">
										{['❤️', '🔥', '😂'].map((emoji) => (
											<button
												key={emoji}
												onClick={() =>
													socket.emit('reactMessage', {
														roomId: chatId,
														messageId: msg.id,
														emoji,
														userId: user.id,
													})
												}>
												{emoji}
											</button>
										))}
									</div>
								</div>
							</div>
						</div>
					)
				})}
				<div ref={messagesEndRef} />
			</main>

			{/* INPUT */}
			<footer className="p-4 border-t">
				<div className="flex gap-2">
					<Button variant="ghost" size="icon">
						<Smile />
					</Button>

					<Input
						value={message}
						onChange={(e) => {
							setMessage(e.target.value)
							socket.emit('typing', { roomId: chatId, userId: user.id })

							if (typingTimeoutRef.current)
								clearTimeout(typingTimeoutRef.current)

							typingTimeoutRef.current = setTimeout(() => {
								socket.emit('stopTyping', {
									roomId: chatId,
									userId: user.id,
								})
							}, 1000)
						}}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						placeholder="Type a message…"
					/>

					<Button onClick={handleSend} disabled={!message.trim()}>
						<Send className="w-4 h-4" />
					</Button>
				</div>
			</footer>
		</div>
	)
}

export default Chat
