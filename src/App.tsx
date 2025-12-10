import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Index from './pages/Index'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'

const queryClient = new QueryClient()

const App = () => (
	<QueryClientProvider client={queryClient}>
		<ThemeProvider defaultTheme="dark" storageKey="devmatch-theme">
			<AuthProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					<BrowserRouter>
						<Routes>
							<Route path="/auth" element={<Auth />} />
							<Route
								path="/"
								element={
									<ProtectedRoute>
										<Index />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</TooltipProvider>
			</AuthProvider>
		</ThemeProvider>
	</QueryClientProvider>
)

export default App
