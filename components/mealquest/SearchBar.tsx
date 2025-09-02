"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({ defaultValue, onSubmit }: { defaultValue?: string; onSubmit: (value: string) => void }) {
	const [value, setValue] = React.useState(defaultValue || "");

	return (
		<form
			className="flex w-full gap-2"
			onSubmit={(e) => {
				e.preventDefault();
				onSubmit(value.trim());
			}}
		>
			<Input
				placeholder="Search meals by name or ingredient..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				aria-label="Search meals"
			/>
			<Button type="submit">Search</Button>
		</form>
	);
}


