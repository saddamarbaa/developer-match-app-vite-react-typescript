import { useNavigate } from 'react-router-dom'
import {
	Code2,
	User,
	MessageSquare,
	LogOut,
	Heart,
	Clock,
	XCircle,
} from 'lucide-react'
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
		<header className="border-border/50 border-b">
			<div className="flex justify-between items-center mx-auto p-3 sm:p-4 w-full max-w-7xl">
				{/* Logo - Left */}
				<button
					onClick={() => navigate('/')}
					className="group flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all duration-300">
					<Code2 className="group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))] w-6 sm:w-8 h-6 sm:h-8 text-primary group-hover:rotate-12 transition-all duration-300 neon-text" />
					<span className="font-bold text-lg sm:text-xl">
						<span className="group-hover:drop-shadow-[0_0_6px_hsl(var(--primary))] transition-all duration-300 gradient-text">
							Dev
						</span>
						<span className="text-foreground group-hover:text-primary transition-colors duration-300">
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
						className="relative w-8 sm:w-9 h-8 sm:h-9"
						onClick={() => navigate('/messages')}>
						<MessageSquare className="w-4 sm:w-5 h-4 sm:h-5" />
						{matchCount > 0 && (
							<span className="-top-1 -right-1 absolute flex justify-center items-center bg-primary rounded-full w-4 sm:w-5 h-4 sm:h-5 font-bold text-[9px] text-primary-foreground sm:text-[10px]">
								{matchCount}
							</span>
						)}
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full w-8 sm:w-9 h-8 sm:h-9">
								<Avatar className="border border-border w-7 sm:w-8 h-7 sm:h-8">
									<AvatarFallback className="bg-secondary text-[10px] sm:text-xs">
										{initials}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="bg-popover border-border w-48">
							<div className="px-2 py-1.5">
								<p className="font-medium text-sm">{user?.name}</p>
								<p className="text-muted-foreground text-xs">{user?.email}</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => navigate('/profile')}>
								<User className="mr-2 w-4 h-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/matches')}>
								<Heart className="mr-2 w-4 h-4" />
								My Matches
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/pending')}>
								<Clock className="mr-2 w-4 h-4" />
								Pending Requests
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => navigate('/rejected')}>
								<XCircle className="mr-2 w-4 h-4" />
								Passed Developers
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={logout} className="text-destructive">
								<LogOut className="mr-2 w-4 h-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
