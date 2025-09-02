import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type RecipeCardProps = {
	id: string;
	name: string;
	image: string;
	category: string | null;
	area: string | null;
	tags: string[];
};

export function RecipeCard({ id, name, image, area, category, tags }: RecipeCardProps) {
    return (
        <Link href={`/recipes/${id}`} className="block">
            <Card className="overflow-hidden transition hover:shadow-md">
                <div className="relative aspect-video w-full bg-muted/50">
                    {image ? (
                        <Image src={image} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : null}
                </div>
                <CardHeader>
                    <CardTitle className="line-clamp-2">{name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-2">
                        {area ? <span className="rounded-md border px-2 py-0.5">{area}</span> : null}
                        {category ? <span className="rounded-md border px-2 py-0.5">{category}</span> : null}
                    </div>
                    {tags?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 5).map((t) => (
                                <span key={`${id}-${t}`} className="rounded-md bg-accent px-2 py-0.5 text-foreground/80">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </CardContent>
            </Card>
        </Link>
    );
}


