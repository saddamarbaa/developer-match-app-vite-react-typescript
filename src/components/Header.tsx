import { useNavigate } from 'react-router-dom'
import { Code2, User, MessageSquare, LogOut, Heart, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface HeaderProps {
	matchCount: number
}

export function Header({ matchCount }: HeaderProps) {
	const navigate = useNavigate()
	const { user, logout } = useAuth()

	const initials =
		user?.name
			?.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() || 'U'

	return (
		<header className="border-b border-border/50">
			<div className="flex items-center justify-between p-3 sm:p-4 max-w-7xl mx-auto w-full">
				{/* Logo - Left */}
				<button
					onClick={() => navigate('/')}
					className="group flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:scale-105">
					<Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary neon-text transition-all duration-300 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
					<span className="text-lg sm:text-xl font-bold">
						<span className="gradient-text transition-all duration-300 group-hover:drop-shadow-[0_0_6px_hsl(var(--primary))]">
							Dev
						</span>
						<span className="text-foreground transition-colors duration-300 group-hover:text-primary">
							Match
						</span>
					</span>
				</button>

				{/* Right side - Theme, Messages, Profile */}
				<div className="flex items-center gap-1 sm:gap-2">
					<ThemeToggle />
					<Button
						variant="ghost"
						size="icon"
						className="relative h-8 w-8 sm:h-9 sm:w-9"
						onClick={() => navigate('/messages')}>
						<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
						{matchCount > 0 && (
							<span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
								{matchCount}
							</span>
						)}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
								<Avatar className="h-7 w-7 sm:h-8 sm:w-8 border border-border">
									<AvatarFallback className="bg-secondary text-[10px] sm:text-xs">
										{initials}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-48 bg-popover border-border">
							<div className="px-2 py-1.5">
								<p className="text-sm font-medium">{user?.name}</p>
								<p className="text-xs text-muted-foreground">{user?.email}</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate('/profile')}>
								<User className="w-4 h-4 mr-2" />
								Edit Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/matches')}>
								<Heart className="w-4 h-4 mr-2" />
								My Matches
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/pending')}>
								<Clock className="w-4 h-4 mr-2" />
								Pending Requests
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout} className="text-destructive">
								<LogOut className="w-4 h-4 mr-2" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
