"use client";

import * as React from "react";
import { SearchBar } from "@/components/mealquest/SearchBar";
import { FilterSidebar } from "@/components/mealquest/FilterSidebar";
import { MobileDrawer } from "@/components/mealquest/MobileDrawer";
import { RecipeCard } from "@/components/mealquest/RecipeCard";
import { Pagination } from "@/components/mealquest/Pagination";
import { RecipeGridSkeleton } from "@/components/mealquest/RecipeGridSkeleton";

type ApiResponse = {
  items: Array<{
    id: string;
    name: string;
    image: string;
    category: string | null;
    area: string | null;
    tags: string[];
  }>;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export default function Home() {
  const [search, setSearch] = React.useState("");
  const [area, setArea] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState<ApiResponse | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchRecipes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (area) params.set("area", area);
      if (category) params.set("category", category);
      params.set("page", String(page));
      const res = await fetch(`/api/recipes?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json = (await res.json()) as ApiResponse;
      setData(json);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [search, area, category, page]);

  React.useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  function handleSearch(next: string) {
    setPage(1);
    setSearch(next);
  }

  function handleFilters(next: { area?: string; category?: string }) {
    setPage(1);
    setArea(next.area);
    setCategory(next.category);
  }

  function handlePageChange(next: number) {
    setPage(next);
  }

  const grid = (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data?.items?.map((m) => (
        <RecipeCard key={m.id} {...m} />
      ))}
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">MealQuest</h1>
        <div className="flex-1" />
      </div>
      <div className="mt-4">
        <SearchBar defaultValue={search} onSubmit={handleSearch} />
      </div>

      <div className="mt-4 sm:hidden">
        <MobileDrawer>
          <FilterSidebar selectedArea={area} selectedCategory={category} onChange={handleFilters} />
        </MobileDrawer>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-[16rem_1fr]">
        <div className="hidden sm:block">
          <FilterSidebar selectedArea={area} selectedCategory={category} onChange={handleFilters} />
        </div>
        <div className="space-y-4">
          {loading ? (
            <RecipeGridSkeleton />
          ) : error ? (
            <div className="rounded-md border p-6 text-center text-muted-foreground">
              {error}
            </div>
          ) : data && data.total > 0 ? (
            <>
              {grid}
              <Pagination page={data.page} totalPages={data.totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <div className="rounded-md border p-10 text-center">
              <p className="text-lg font-medium">No recipes found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search or adjust filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
