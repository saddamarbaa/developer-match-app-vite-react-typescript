import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'

export const socket: Socket = io(SOCKET_URL, {
	autoConnect: false, // important
})

console.log(SOCKET_URL)
