import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const ConversationSkeleton = () => {
	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50">
			<CardContent className="p-4">
				<div className="flex items-center gap-3">
					<Skeleton className="w-12 h-12 rounded-full" />
					<div className="flex-1 space-y-2">
						<div className="flex items-center justify-between">
							<Skeleton className="h-5 w-32" />
							<Skeleton className="h-3 w-12" />
						</div>
						<Skeleton className="h-4 w-48" />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export const ConversationListSkeleton = () => {
	return (
		<div className="space-y-2">
			{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
				<ConversationSkeleton key={i} />
			))}
		</div>
	)
}
