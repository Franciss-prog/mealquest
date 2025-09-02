import { NextResponse } from "next/server";
import placeholderData from "@/data/recipes.json";

type RawMeal = {
	idMeal?: string;
	strMeal?: string;
	strMealThumb?: string;
	strCategory?: string;
	strArea?: string;
	strTags?: string | null;
	strInstructions?: string | null;
	strYoutube?: string | null;
	[key: `strIngredient${number}`]: string | undefined;
	[key: `strMeasure${number}`]: string | undefined;
};

export type Meal = {
	id: string;
	name: string;
	image: string;
	category: string | null;
	area: string | null;
	tags: string[];
	instructions: string | null;
	youtube: string | null;
	ingredients: { ingredient: string; measure: string }[];
};

const PAGE_SIZE = 10;

const MEALDB_BASE = process.env.MEALDB_BASE_URL ||
	process.env.NEXT_PUBLIC_MEALDB_API ||
	"https://www.themealdb.com/api/json/v1/1";

function formatMeal(raw: RawMeal): Meal {
	const ingredients: { ingredient: string; measure: string }[] = [];
	for (let i = 1; i <= 20; i++) {
		const ing = raw[`strIngredient${i}`];
		const meas = raw[`strMeasure${i}`];
		if (ing && String(ing).trim().length > 0) {
			ingredients.push({ ingredient: String(ing).trim(), measure: String(meas || "").trim() });
		}
	}

	const tags = typeof raw.strTags === "string" && raw.strTags
		? String(raw.strTags)
			.split(",")
			.map((t: string) => t.trim())
			.filter(Boolean)
		: [];

	return {
		id: String(raw.idMeal),
		name: String(raw.strMeal || ""),
		image: String(raw.strMealThumb || ""),
		category: raw.strCategory ? String(raw.strCategory) : null,
		area: raw.strArea ? String(raw.strArea) : null,
		tags,
		instructions: raw.strInstructions ? String(raw.strInstructions) : null,
		youtube: raw.strYoutube ? String(raw.strYoutube) : null,
		ingredients,
	};
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const search = (searchParams.get("search") || "").trim();
	const area = (searchParams.get("area") || "").trim();
	const category = (searchParams.get("category") || "").trim();
	const pageParam = Number(searchParams.get("page") || "1");
	const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

	let meals: Meal[] = [];
	try {
		// Primary: search by meal name
		const url = `${MEALDB_BASE}/search.php?s=${encodeURIComponent(search)}`;
		const res = await fetch(url, { next: { revalidate: 60 } });
		if (!res.ok) throw new Error(`Upstream error: ${res.status}`);
		const data = await res.json();
		const rawMeals: RawMeal[] = Array.isArray(data?.meals) ? data.meals : [];
		meals = rawMeals.map(formatMeal);

		// If no results and a search term exists, try ingredient-based search
		if ((!meals || meals.length === 0) && search) {
			const filterRes = await fetch(`${MEALDB_BASE}/filter.php?i=${encodeURIComponent(search)}`, { next: { revalidate: 60 } });
			if (filterRes.ok) {
				const fData = await filterRes.json();
				const basic = Array.isArray(fData?.meals) ? (fData.meals as Array<{ idMeal?: string }>) : [];
				const ids = basic.map((m) => String(m.idMeal)).slice(0, 30);
				if (ids.length) {
					const detailed = await Promise.all(
						ids.map(async (id: string) => {
							const dRes = await fetch(`${MEALDB_BASE}/lookup.php?i=${id}`, { next: { revalidate: 60 } });
							if (!dRes.ok) return null;
							const d = await dRes.json();
							const arr: RawMeal[] = Array.isArray(d?.meals) ? d.meals : [];
							return arr[0] ? formatMeal(arr[0]) : null;
						})
					);
					meals = detailed.filter(Boolean) as Meal[];
				}
			}
		}
	} catch (error) {
		// Fallback to local placeholder data
		const local = placeholderData as unknown as { meals?: Meal[] };
		meals = Array.isArray(local?.meals) ? local.meals : [];
	}

	// Apply filters client-side style on the server results
	if (area) {
		meals = meals.filter((m) => (m.area || "").toLowerCase() === area.toLowerCase());
	}
	if (category) {
		meals = meals.filter((m) => (m.category || "").toLowerCase() === category.toLowerCase());
	}

	const total = meals.length;
	const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * PAGE_SIZE;
	const end = start + PAGE_SIZE;
	const items = meals.slice(start, end);

	return NextResponse.json({
		items,
		page: safePage,
		pageSize: PAGE_SIZE,
		total,
		totalPages,
	});
}


