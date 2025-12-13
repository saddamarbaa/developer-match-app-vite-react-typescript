import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

const COMMON_SKILLS = [
	'React',
	'TypeScript',
	'Node.js',
	'Python',
	'Go',
	'Rust',
	'AWS',
	'Docker',
	'Kubernetes',
	'PostgreSQL',
	'MongoDB',
	'GraphQL',
]

interface FeedFiltersProps {
	searchQuery: string
	onSearchChange: (query: string) => void
	selectedSkills: string[]
	onSkillsChange: (skills: string[]) => void
}

export const FeedFilters = ({
	searchQuery,
	onSearchChange,
	selectedSkills,
	onSkillsChange,
}: FeedFiltersProps) => {
	const [isOpen, setIsOpen] = useState(false)

	const toggleSkill = (skill: string) => {
		if (selectedSkills.includes(skill)) {
			onSkillsChange(selectedSkills.filter((s) => s !== skill))
		} else {
			onSkillsChange([...selectedSkills, skill])
		}
	}

	const clearFilters = () => {
		onSearchChange('')
		onSkillsChange([])
	}

	const hasActiveFilters = searchQuery || selectedSkills.length > 0

	return (
		<div className="space-y-3 mb-4">
			{/* Search and Filter Row */}
			<div className="flex items-center gap-3">
				{/* Search Input */}
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search developers..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="pl-10 bg-card/50 border-border/50 backdrop-blur-sm h-10"
					/>
					{searchQuery && (
						<button
							onClick={() => onSearchChange('')}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
							<X className="h-4 w-4" />
						</button>
					)}
				</div>

				{/* Skills Filter Button */}
				<Popover open={isOpen} onOpenChange={setIsOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							size="default"
							className={`gap-2 h-10 px-4 bg-card/50 backdrop-blur-sm border-border/50 shrink-0 ${
								selectedSkills.length > 0
									? 'border-primary/50 text-primary'
									: ''
							}`}>
							<Filter className="h-4 w-4" />
							<span className="hidden sm:inline">Skills</span>
							{selectedSkills.length > 0 && (
								<span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
									{selectedSkills.length}
								</span>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-80 p-4 bg-popover border-border z-50"
						align="end">
						<div className="space-y-4">
							<div className="flex items-center justify-between">
								<p className="text-sm font-semibold text-foreground">
									Filter by skills
								</p>
								{selectedSkills.length > 0 && (
									<Button
										variant="ghost"
										size="sm"
										onClick={() => onSkillsChange([])}
										className="h-7 text-xs text-muted-foreground hover:text-foreground">
										Clear
									</Button>
								)}
							</div>
							<div className="flex flex-wrap gap-2">
								{COMMON_SKILLS.map((skill) => {
									const isSelected = selectedSkills.includes(skill)
									return (
										<Badge
											key={skill}
											variant={isSelected ? 'default' : 'outline'}
											className={`cursor-pointer transition-all text-xs py-1 px-2.5 ${
												isSelected
													? 'bg-primary text-primary-foreground shadow-sm'
													: 'hover:bg-accent hover:text-accent-foreground border-border/50'
											}`}
											onClick={() => toggleSkill(skill)}>
											{skill}
										</Badge>
									)
								})}
							</div>
						</div>
					</PopoverContent>
				</Popover>

				{/* Clear All */}
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="icon"
						onClick={clearFilters}
						className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
						title="Clear all filters">
						<X className="h-4 w-4" />
					</Button>
				)}
			</div>

			{/* Active Filters Display */}
			{selectedSkills.length > 0 && (
				<div className="flex items-center gap-2 flex-wrap">
					<span className="text-xs text-muted-foreground">Active:</span>
					{selectedSkills.map((skill) => (
						<Badge
							key={skill}
							variant="secondary"
							className="gap-1 cursor-pointer text-xs py-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
							onClick={() => toggleSkill(skill)}>
							{skill}
							<X className="h-3 w-3" />
						</Badge>
					))}
				</div>
			)}
		</div>
	)
}
