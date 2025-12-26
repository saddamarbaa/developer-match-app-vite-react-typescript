import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send, Smile } from 'lucide-react'

import { toast } from '@/hooks/use-toast'
import { socket } from '@/socket'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
	id: string
	text: string
	senderId: string
	timestamp: Date
}

const Chat = () => {
	const { user } = useAuth()
	const { id: otherUserId } = useParams<{ id: string }>()
	const navigate = useNavigate()

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<Message[]>([])
	const [otherUser, setOtherUser] = useState({
		name: 'Developer',
		avatar: '/placeholder.svg',
	})
	const [isConnected, setIsConnected] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// SAME chatId for both users
	const chatId = [user.id, otherUserId].sort().join('_')

	/* ---------------- SOCKET CONNECTION ---------------- */
	useEffect(() => {
		if (!user?.id || !otherUserId) return

		socket.connect()

		const onConnect = () => {
			console.log('✅ Socket connected:', socket.id)
			setIsConnected(true)

			socket.emit('userOnline', user.id)

			// 👉 CLIENT EMITS joinChat
			socket.emit('joinChatRoom', {
				name: user.name,
				userId: user.id,
				targetUserId: otherUserId,
			})
		}

		const onReceiveMessage = (incomingMessage: Message) => {
			setMessages((prev) => [...prev, incomingMessage])
		}

		const onDisconnect = () => {
			console.log('❌ Socket disconnected')
			setIsConnected(false)
		}

		socket.on('connect', onConnect)
		socket.on('receiveMessage', onReceiveMessage)
		socket.on('disconnect', onDisconnect)

		return () => {
			socket.off('connect', onConnect)
			socket.off('receiveMessage', onReceiveMessage)
			socket.off('disconnect', onDisconnect)
			socket.disconnect()
		}
	}, [user.id, otherUserId, user.name])

	/* ---------------- AUTO SCROLL ---------------- */
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	/* ---------------- SEND MESSAGE ---------------- */

	const handleSend = () => {
		if (!isConnected) {
			toast({
				title: 'Disconnected',
				description: 'Reconnecting to chat server...',
				variant: 'destructive',
			})
			return
		}

		if (!message.trim() || !otherUserId) return

		const newMessage: Message = {
			id: Date.now().toString(),
			text: message,
			senderId: user.id,
			timestamp: new Date(),
		}

		setMessage('')

		socket.emit('sendMessage', { roomId: chatId, message: newMessage })
		socket.emit('stopTyping', { roomId: chatId, userId: user.id })
	}

	/* ---------------- FORMAT TIME ---------------- */
	const formatTime = (date: Date) =>
		new Date(date).toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		})

	/* ---------------- UI ---------------- */
	/* ---------------- UI ---------------- */
	return (
		<div className="flex flex-col bg-background h-screen overflow-hidden">
			{/* HEADER (FIXED) */}
			<header className="flex items-center gap-3 p-4 border-b shrink-0">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => navigate('/messages')}>
					<ArrowLeft className="w-5 h-5" />
				</Button>

				<Avatar className="w-10 h-10">
					<AvatarImage src={otherUser.avatar} />
					<AvatarFallback>
						{otherUser.name
							.split(' ')
							.map((n) => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<h2 className="font-semibold">{otherUser.name}</h2>
					<p
						className={`text-xs ${
							isConnected ? 'text-green-500' : 'text-red-500'
						}`}>
						{isConnected ? 'Online' : 'Offline'}
					</p>
				</div>
			</header>

			{/* MESSAGES (SCROLL ONLY HERE) */}
			<main className="flex-1 space-y-3 px-4 py-3 overflow-y-auto">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`flex ${
							msg.senderId === user.id ? 'justify-end' : 'justify-start'
						}`}>
						<div
							className={`max-w-[75%] px-4 py-2 rounded-2xl ${
								msg.senderId === user.id
									? 'bg-primary text-primary-foreground'
									: 'bg-secondary'
							}`}>
							<p className="text-sm">{msg.text}</p>
							<p className="opacity-70 mt-1 text-[10px]">
								{formatTime(msg.timestamp)}
							</p>
						</div>
					</div>
				))}
				<div ref={messagesEndRef} />
			</main>

			{/* INPUT (FIXED) */}
			<footer className="p-4 border-t shrink-0">
				<div className="flex gap-2">
					<Button variant="ghost" size="icon">
						<Smile className="w-5 h-5" />
					</Button>

					<Input
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleSend()}
						placeholder="Type a message..."
					/>

					<Button
						size="icon"
						onClick={handleSend}
						disabled={!message.trim() || !isConnected}>
						<Send className="w-4 h-4" />
					</Button>
				</div>
			</footer>
		</div>
	)
}

export default Chat
