"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MEALDB_BASE = process.env.NEXT_PUBLIC_MEALDB_API || "https://www.themealdb.com/api/json/v1/1";

type ListItem = { strArea?: string; strCategory?: string };

export function FilterSidebar({
	className,
	selectedArea,
	selectedCategory,
	onChange,
}: {
	className?: string;
	selectedArea?: string;
	selectedCategory?: string;
	onChange: (next: { area?: string; category?: string }) => void;
}) {
	const [areas, setAreas] = React.useState<string[]>([]);
	const [categories, setCategories] = React.useState<string[]>([]);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		let isMounted = true;
		async function loadLists() {
			try {
				const [aRes, cRes] = await Promise.all([
					fetch(`${MEALDB_BASE}/list.php?a=list`, { cache: "force-cache" }),
					fetch(`${MEALDB_BASE}/list.php?c=list`, { cache: "force-cache" }),
				]);
				const aData = await aRes.json();
				const cData = await cRes.json();
				if (!isMounted) return;
				setAreas((aData?.meals || []).map((i: ListItem) => String(i.strArea)));
				setCategories((cData?.meals || []).map((i: ListItem) => String(i.strCategory)));
			} finally {
				if (isMounted) setLoading(false);
			}
		}
		loadLists();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<aside className={cn("w-full sm:w-64 shrink-0", className)}>
			<div className="sticky top-4 space-y-6 rounded-lg border p-4">
				<div className="space-y-2">
					<p className="text-sm font-medium">Cuisine</p>
					<select
						className="w-full h-10 rounded-md border bg-background px-3"
						value={selectedArea || ""}
						onChange={(e) => onChange({ area: e.target.value || undefined, category: selectedCategory })}
						disabled={loading}
					>
						<option value="">All</option>
						{areas.map((a) => (
							<option key={a} value={a}>
								{a}
							</option>
						))}
					</select>
				</div>
				<div className="space-y-2">
					<p className="text-sm font-medium">Category</p>
					<select
						className="w-full h-10 rounded-md border bg-background px-3"
						value={selectedCategory || ""}
						onChange={(e) => onChange({ category: e.target.value || undefined, area: selectedArea })}
						disabled={loading}
					>
						<option value="">All</option>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</div>
			</div>
		</aside>
	);
}


