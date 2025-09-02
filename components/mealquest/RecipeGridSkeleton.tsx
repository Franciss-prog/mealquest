import { Skeleton } from "@/components/ui/skeleton";

export function RecipeGridSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, idx) => (
				<div key={idx} className="rounded-lg border p-0 overflow-hidden">
					<Skeleton className="aspect-video w-full" />
					<div className="p-4 space-y-3">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-4 w-1/3" />
					</div>
				</div>
			))}
		</div>
	);
}


