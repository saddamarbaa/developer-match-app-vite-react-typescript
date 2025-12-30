import { Connection } from '@/types/developer'

// API Configuration
export const API_BASE_URL = 'http://localhost:8000/api/v1'

// Helper function for API requests
export async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<{
	success: boolean
	message: string
	status: number
	data: T | null
}> {
	const token = localStorage.getItem('devmatch_token')

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...(token && { Authorization: `Bearer ${token}` }),
		...options.headers,
	}

	try {
		const response = await fetch(`${API_BASE_URL}${endpoint}`, {
			...options,
			headers,
			credentials: 'include', // Include cookies
		})

		const data = await response.json()
		return data
	} catch (error) {
		console.error('API request failed:', error)
		return {
			success: false,
			message: 'Network error. Please check your connection.',
			status: 0,
			data: null,
		}
	}
}

// Auth API endpoints
export const authApi = {
	signup: async (userData: {
		firstName: string
		lastName?: string
		email: string
		password: string
		confirmPassword: string
		gender?: string
		bio?: string
		skills?: string[]
		acceptTerms?: boolean
	}) => {
		return apiRequest<null>('/auth/signup', {
			method: 'POST',
			body: JSON.stringify(userData),
		})
	},

	login: async (credentials: { email: string; password: string }) => {
		return apiRequest<{ user: { authToken: string } }>('/auth/login', {
			method: 'POST',
			body: JSON.stringify(credentials),
		})
	},

	logout: async () => {
		return apiRequest<null>('/auth/logout', {
			method: 'POST',
		})
	},

	getProfile: async () => {
		return apiRequest<{
			user: {
				_id: string
				firstName: string
				lastName: string
				email: string
				gender?: string
				bio?: string
				skills?: string[]
				profileUrl?: string
			}
		}>('/auth/me', {
			method: 'GET',
		})
	},

	updateProfile: async (
		userId: string,
		profileData: {
			firstName?: string
			lastName?: string
			email?: string
			gender?: string
			bio?: string
			skills?: string[]
			profileUrl?: string
		},
	) => {
		return apiRequest<{
			_id: string
			firstName: string
			lastName: string
			email: string
			gender?: string
			bio?: string
			skills?: string[]
			profileUrl?: string
		}>(`/auth/update/${userId}`, {
			method: 'PATCH',
			body: JSON.stringify(profileData),
		})
	},

	deleteProfile: async (userId: string) => {
		return apiRequest<null>(`/auth/delete/${userId}`, {
			method: 'DELETE',
		})
	},

	forgotPassword: async (email: string) => {
		return apiRequest<{
			user: {
				resetPasswordToken: string
			}
		}>('/auth/forget-password', {
			method: 'POST',
			body: JSON.stringify({ email }),
		})
	},

	resetPassword: async (token: string, newPassword: string, userId: string) => {
		console.log(token)
		return apiRequest<null>(`/auth/reset-password/${userId}/${token}`, {
			method: 'POST',
			body: JSON.stringify({
				password: newPassword,
				confirmPassword: newPassword,
			}),
		})
	},
}

// Feed API endpoints
export const feedApi = {
	getFeed: async () => {
		return apiRequest<{
			users: Array<{
				_id: string
				firstName?: string
				lastName?: string
				email?: string
				gender?: string
				bio?: string
				skills?: string[]
				profileUrl?: string
				username?: string
			}>
			pagination: {
				currentPage: number
				limit: number
				totalDocs: number
				totalPages: number
				nextPage: number | null
				prevPage: number | null
				lastPage: number
			}
		}>('/user/feed', {
			method: 'GET',
		})
	},
}

// Connection Request API endpoints
export const requestApi = {
	sendRequest: async (
		toUserId: string,
		status: 'interested' | 'ignored' = 'interested',
	) => {
		return apiRequest<null>(`/request/send/${status}/${toUserId}`, {
			method: 'POST',
		})
	},

	getConnections: async () => {
		return apiRequest<
			Array<{
				_id: string
				firstName?: string
				lastName?: string
				email?: string
				gender?: string
				bio?: string
				skills?: string[]
				profileUrl?: string
				username?: string
				isEmailVerified?: boolean
				createdAt?: string
				updatedAt?: string
			}>
		>('/user/match/connections', {
			method: 'GET',
		})
	},

	getPendingRequests: async () => {
		return apiRequest<
			Array<{
				_id: string
				fromUserId: {
					_id: string
					firstName: string
					lastName: string
					email: string
					gender?: string
					bio?: string
					skills?: string[]
					profileUrl?: string
				}
				status: string
			}>
		>('/user/requests/pending', {
			method: 'GET',
		})
	},

	reviewRequest: async (requestId: string, status: 'accepted' | 'rejected') => {
		return apiRequest<null>(`/request/review/${status}/${requestId}`, {
			method: 'POST',
		})
	},

	getRejected: async () => {
		return apiRequest<
			Array<{
				_id: string
				firstName?: string
				lastName?: string
				email?: string
				gender?: string
				bio?: string
				skills?: string[]
				profileUrl?: string
				username?: string
				isEmailVerified?: boolean
				createdAt?: string
				updatedAt?: string
			}>
		>('/user/reject/connections', {
			method: 'GET',
		})
	},
}

// Chat API endpoints
export const chatApi = {
	/**
	 * Get chat messages between two users
	 */
	getChat: async (userId: string, otherUserId: string) => {
		return apiRequest<{
			messages: Array<{
				reactions: {}
				_id: string
				text: string
				senderId: {
					_id: string
					firstName?: string
					lastName?: string
					profileUrl?: string
				}
				createdAt: string
			}>
		}>(`/chat/${userId}/${otherUserId}`, {
			method: 'GET',
		})
	},
}
