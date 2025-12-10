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
		lastName: string
		email: string
		password: string
		confirmPassword: string
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
}
