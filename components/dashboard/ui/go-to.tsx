import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GoTo({ Icon, route, routeName }: { Icon?: React.ElementType, route?: string, routeName?: string } = {}) {
    return (
        <Button asChild variant="outline" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
            <Link href={route || "/dashboard"}>
                {Icon && <Icon className="h-5 w-5" />}
                {routeName && <span className="text-sm text-muted-foreground">{routeName}</span>}
            </Link>
        </Button>
    )
}