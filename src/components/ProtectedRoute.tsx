import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
	children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, isLoading } = useAuth()

	// While the auth context is loading (e.g. fetching /auth/me), show a
	// centered spinner to avoid a brief flash that redirects an authenticated
	// user to the login page.
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		)
	}

	if (!user) {
		return <Navigate to="/auth" replace />
	}

	return <>{children}</>
}
