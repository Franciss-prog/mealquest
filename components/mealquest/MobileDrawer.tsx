"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export function MobileDrawer({
	triggerLabel = "Filters",
	children,
}: {
	triggerLabel?: string;
	children: React.ReactNode;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<div className="sm:hidden">
			<Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
				{triggerLabel}
			</Button>
			{open ? (
				<>
					<div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
					<div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border bg-background p-4 shadow-2xl">
						<div className="mx-auto max-w-md">
							<div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-muted" />
							{children}
							<div className="mt-4">
								<Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
									Close
								</Button>
							</div>
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}


