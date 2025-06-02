import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";

export default function SavedNichesFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ups! No niches saved</CardTitle>
                <CardDescription>
                    Search and save niches to analyze their potential. Use the explorer to find niches that match your criteria.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="outline">
                    <Link href="/explorer" className="flex items-center gap-2">
                        <Search />
                        <span>Explorer</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

{/* <Alert variant="destructive">
    <AlertCircleIcon />
    <AlertTitle>Ups! No niches saved</AlertTitle>
    <AlertDescription>
        Search and save niches to analyze their potential. Use the explorer to find niches that match your criteria.
        <Button variant="outline" asChild>
            <Link href="/product-searcher" className="flex items-center gap-2">
                <Search />
                <span>Save niches</span>
            </Link>
        </Button>
    </AlertDescription>
</Alert> */}