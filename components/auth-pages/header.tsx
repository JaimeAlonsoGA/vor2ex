import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <div className="absolute top-8 left-8 z-20">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
            </Link>
        </div>
    )
}