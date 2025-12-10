import {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
	ReactNode,
} from 'react'
import { authApi } from '@/lib/api'

interface User {
	id: string
	email: string
	name: string
	firstName?: string
	lastName?: string
	gender?: string
	bio?: string
	skills?: string[]
	avatar?: string
}

interface AuthContextType {
	user: User | null
	isLoading: boolean
	login: (email: string, password: string) => Promise<{ error?: string }>
	signup: (
		email: string,
		password: string,
		name: string,
	) => Promise<{ error?: string }>
	logout: () => void
	refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Check for existing session on mount. Call getProfile unconditionally so
	// cookie-based sessions (or other server-side session approaches) work
	// even when a token is not stored in localStorage.
	useEffect(() => {
		const checkAuth = async () => {
			const response = await authApi.getProfile()
			if (response.success && response.data) {
				const profileData = response.data?.user
				setUser({
					id: profileData._id,
					email: profileData.email,
					name: `${profileData.firstName} ${profileData.lastName}`,
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					gender: profileData.gender,
					bio: profileData.bio,
					skills: profileData.skills,
					avatar: profileData.profileUrl,
				})
			} else {
				// Ensure local token is cleared if server does not recognize it
				localStorage.removeItem('devmatch_token')
			}

			setIsLoading(false)
		}

		checkAuth()
	}, [])

	const login = useCallback(async (email: string, password: string) => {
		setIsLoading(true)

		const response = await authApi.login({ email, password })

		if (!response.success) {
			setIsLoading(false)
			return { error: response.message || 'Invalid credentials' }
		}

		// Store the token if present. Support multiple possible response
		// shapes so the client remains resilient to small backend changes.
		const maybeToken =
			// shape: { data: { user: { authToken } } }
			(response.data as any)?.user?.authToken ||
			// shape: { data: { authToken } }
			(response.data as any)?.authToken ||
			// top-level (unlikely) but safe
			(response as any)?.authToken

		if (maybeToken) {
			localStorage.setItem('devmatch_token', maybeToken)
		}

		// Fetch user profile
		const profileResponse = await authApi.getProfile()

		if (profileResponse.success && profileResponse.data) {
			const profileData = profileResponse.data?.user
			setUser({
				id: profileData._id,
				email: profileData.email,
				name: `${profileData.firstName} ${profileData.lastName}`,
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				gender: profileData.gender,
				bio: profileData.bio,
				skills: profileData.skills,
				avatar: profileData.profileUrl,
			})
		}

		setIsLoading(false)
		return {}
	}, [])

	const signup = useCallback(
		async (email: string, password: string, name: string) => {
			setIsLoading(true)

			// Split name into first and last name
			const nameParts = name.trim().split(' ')
			const firstName = nameParts[0] || name
			const lastName = nameParts.slice(1).join(' ') || 'User'

			const response = await authApi.signup({
				firstName,
				lastName,
				email,
				password,
				confirmPassword: password,
			})

			if (!response.success) {
				setIsLoading(false)
				return { error: response.message || 'Signup failed' }
			}

			// After signup, auto-login the user
			const loginResult = await login(email, password)

			if (loginResult.error) {
				setIsLoading(false)
				return {
					error:
						'Account created! Please check your email to verify, then log in.',
				}
			}

			setIsLoading(false)
			return {}
		},
		[login],
	)

	const logout = useCallback(async () => {
		await authApi.logout()
		localStorage.removeItem('devmatch_token')
		setUser(null)
	}, [])

	const refreshProfile = useCallback(async () => {
		const response = await authApi.getProfile()
		if (response.success && response.data) {
			const profileData = response.data?.user
			setUser({
				id: profileData._id,
				email: profileData.email,
				name: `${profileData.firstName} ${profileData.lastName}`,
				firstName: profileData.firstName,
				lastName: profileData.lastName,
				gender: profileData.gender,
				bio: profileData.bio,
				skills: profileData.skills,
				avatar: profileData.profileUrl,
			})
		}
	}, [])

	return (
		<AuthContext.Provider
			value={{ user, isLoading, login, signup, logout, refreshProfile }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
