"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
	variant?: "default" | "outline" | "ghost";
	size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant = "default", size = "md", ...rest },
		ref
	) => {
		const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
			default: "bg-foreground text-background hover:opacity-90",
			outline: "border border-input bg-transparent text-foreground hover:bg-accent/50",
			ghost: "bg-transparent hover:bg-accent",
		};

		const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
			sm: "h-8 px-3 text-sm",
			md: "h-10 px-4 text-sm",
			lg: "h-12 px-6 text-base",
			icon: "h-10 w-10 p-0",
		};

		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
					variants[variant],
					sizes[size],
					className
				)}
				{...rest} // only valid HTML button attributes here
			/>
		);
	}
);

Button.displayName = "Button";
