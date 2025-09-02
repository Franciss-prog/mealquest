import { RecipeGridSkeleton } from "@/components/mealquest/RecipeGridSkeleton";

export default function Loading() {
	return (
		<div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
			<div className="h-10 w-40 rounded-md bg-muted" />
			<div className="mt-4 h-10 w-full rounded-md bg-muted" />
			<div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[16rem_1fr]">
				<div className="hidden sm:block">
					<div className="sticky top-4 space-y-4">
						<div className="h-10 w-full rounded-md bg-muted" />
						<div className="h-10 w-full rounded-md bg-muted" />
					</div>
				</div>
				<div>
					<RecipeGridSkeleton />
				</div>
			</div>
		</div>
	);
}


