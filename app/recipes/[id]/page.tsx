import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type MealDetail = {
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

async function getMeal(id: string): Promise<MealDetail | null> {
  const base =
    process.env.MEALDB_BASE_URL ||
    process.env.NEXT_PUBLIC_MEALDB_API ||
    "https://www.themealdb.com/api/json/v1/1";
  const res = await fetch(`${base}/lookup.php?i=${encodeURIComponent(id)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const meal = Array.isArray(data?.meals) ? data.meals[0] : null;
  if (!meal) return null;

  const ingredients: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && String(ing).trim().length > 0) {
      ingredients.push({
        ingredient: String(ing).trim(),
        measure: String(meas || "").trim(),
      });
    }
  }

  const tags = meal.strTags
    ? String(meal.strTags)
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];

  return {
    id: String(meal.idMeal),
    name: String(meal.strMeal),
    image: String(meal.strMealThumb || ""),
    category: meal.strCategory ? String(meal.strCategory) : null,
    area: meal.strArea ? String(meal.strArea) : null,
    tags,
    instructions: meal.strInstructions ? String(meal.strInstructions) : null,
    youtube: meal.strYoutube ? String(meal.strYoutube) : null,
    ingredients,
  };
}

// ✅ Fix: define a dedicated props type
type RecipeDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const meal = await getMeal(params.id);

  if (!meal) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
        <div className="rounded-md border p-10 text-center">
          <p className="text-lg font-medium">Recipe not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed or is temporarily unavailable.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/">Back to search</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{meal.name}</h1>
        <Link href="/">Back</Link>
      </div>

      <Card className="overflow-hidden">
        <div className="relative w-full aspect-video bg-muted/50">
          {meal.image ? (
            <Image
              src={meal.image}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : null}
        </div>
        <CardHeader>
          <CardTitle className="text-lg">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap gap-2">
              {meal.area ? (
                <span className="rounded-md border px-2 py-0.5">
                  {meal.area}
                </span>
              ) : null}
              {meal.category ? (
                <span className="rounded-md border px-2 py-0.5">
                  {meal.category}
                </span>
              ) : null}
            </div>
            {meal.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {meal.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-accent px-2 py-0.5 text-foreground/80"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            ) : null}
            {meal.youtube ? (
              <div className="pt-2">
                <Link href={meal.youtube} target="_blank" rel="noreferrer">
                  Watch on YouTube
                </Link>
              </div>
            ) : null}
          </div>
          <div>
            <h2 className="font-semibold mb-2">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {meal.ingredients.map((it) => (
                <li
                  key={`${it.ingredient}-${it.measure}`}
                  className="flex items-center justify-between gap-2 border-b py-1"
                >
                  <span>{it.ingredient}</span>
                  <span className="text-muted-foreground">{it.measure}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {meal.instructions ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground/90">
              {meal.instructions}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
