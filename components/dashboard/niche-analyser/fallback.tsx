import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import Link from "next/link";

export default function AnalyticsFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ups! No niches saved</CardTitle>
                <CardDescription>
                    Search and save niches to analyze their potential. Use the niche searcher to find niches that match your criteria.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="outline">
                    <Link href="/product-searcher" className="flex items-center gap-2">
                        <Search />
                        <span>Save niches</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}