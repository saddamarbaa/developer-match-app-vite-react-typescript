import { useNavigate } from 'react-router-dom'
import { Code2, User, MessageSquare, LogOut } from 'lucide-react'
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
		<header className="flex items-center justify-between p-4 border-b border-border/50">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="rounded-full">
						<Avatar className="h-8 w-8 border border-border">
							<AvatarFallback className="bg-secondary text-xs">
								{initials}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					className="w-48 bg-popover border-border">
					<div className="px-2 py-1.5">
						<p className="text-sm font-medium">{user?.name}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</div>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => navigate('/profile')}>
						<User className="w-4 h-4 mr-2" />
						Profile
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={logout} className="text-destructive">
						<LogOut className="w-4 h-4 mr-2" />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<div className="flex items-center gap-2">
				<Code2 className="w-8 h-8 text-primary neon-text" />
				<span className="text-xl font-bold">
					<span className="gradient-text">Dev</span>
					<span className="text-foreground">Match</span>
				</span>
			</div>

			<div className="flex items-center gap-1">
				<ThemeToggle />
				<Button variant="ghost" size="icon" className="relative">
					<MessageSquare className="w-5 h-5" />
					{matchCount > 0 && (
						<span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
							{matchCount}
						</span>
					)}
				</Button>
			</div>
		</header>
	)
}
