import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export const DevCardSkeleton = () => {
	return (
		<Card className="absolute inset-0 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
			<CardContent className="p-0 h-full flex flex-col">
				{/* Avatar skeleton */}
				<Skeleton className="w-full aspect-[3/4] rounded-none" />

				{/* Content skeleton */}
				<div className="p-4 flex-1 flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Skeleton className="h-7 w-40" />
						<Skeleton className="h-5 w-12" />
					</div>

					<Skeleton className="h-5 w-32" />

					<div className="flex gap-2">
						<Skeleton className="h-6 w-16 rounded-full" />
						<Skeleton className="h-6 w-20 rounded-full" />
						<Skeleton className="h-6 w-14 rounded-full" />
					</div>

					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			</CardContent>
		</Card>
	)
}
