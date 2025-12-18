import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageTransition } from '@/components/PageTransition'
import { AnimatePresence } from 'framer-motion'
import Index from './pages/Index'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import Matches from './pages/Matches'
import PendingRequests from './pages/PendingRequests'
import Messages from './pages/Messages'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'

const queryClient = new QueryClient()

function AnimatedRoutes() {
	const location = useLocation()

	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route
					path="/auth"
					element={
						<PageTransition>
							<Auth />
						</PageTransition>
					}
				/>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<PageTransition>
								<Index />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<PageTransition>
								<Profile />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/matches"
					element={
						<ProtectedRoute>
							<PageTransition>
								<Matches />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/pending"
					element={
						<ProtectedRoute>
							<PageTransition>
								<PendingRequests />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/messages"
					element={
						<ProtectedRoute>
							<PageTransition>
								<Messages />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="/chat/:id"
					element={
						<ProtectedRoute>
							<PageTransition>
								<Chat />
							</PageTransition>
						</ProtectedRoute>
					}
				/>
				<Route
					path="*"
					element={
						<PageTransition>
							<NotFound />
						</PageTransition>
					}
				/>
			</Routes>
		</AnimatePresence>
	)
}

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="dark" storageKey="devmatch-theme">
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<AnimatedRoutes />
					</BrowserRouter>
				</TooltipProvider>
			</AuthProvider>
		</ThemeProvider>
	</QueryClientProvider>
)

export default App
