import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function GoBack({ route, routeName }: { route?: string, routeName?: string } = {}) {
    return (
        <Link href={route || "/"} className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
            {routeName && <span className="text-sm text-muted-foreground">{routeName}</span>}
        </Link>
    )
}