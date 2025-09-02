"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	return (
		<div className="flex items-center justify-center gap-2">
			<Button
				variant="outline"
				disabled={page <= 1}
				onClick={() => onPageChange(page - 1)}
			>
				Prev
			</Button>
			<span className="text-sm text-muted-foreground">
				Page {page} of {Math.max(1, totalPages)}
			</span>
			<Button
				variant="outline"
				disabled={page >= totalPages}
				onClick={() => onPageChange(page + 1)}
			>
				Next
			</Button>
		</div>
	);
}


