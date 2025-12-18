import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const RequestCardSkeleton = () => {
	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50">
			<CardContent className="p-4">
				<div className="flex items-start gap-4">
					<Skeleton className="w-16 h-16 rounded-full" />
					<div className="flex-1 space-y-3">
						<Skeleton className="h-5 w-32" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<div className="flex gap-1.5">
							<Skeleton className="h-5 w-14 rounded-full" />
							<Skeleton className="h-5 w-16 rounded-full" />
							<Skeleton className="h-5 w-12 rounded-full" />
						</div>
						<div className="flex gap-2">
							<Skeleton className="h-8 w-20 rounded-md" />
							<Skeleton className="h-8 w-20 rounded-md" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export const RequestListSkeleton = () => {
	return (
		<div className="grid gap-4">
			{[1, 2, 3].map((i) => (
				<RequestCardSkeleton key={i} />
			))}
		</div>
	)
}
