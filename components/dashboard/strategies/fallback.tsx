import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DraftingCompass } from "lucide-react";
import Link from "next/link";

export function NoStrategiesActivatedFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ups! No strategies activated</CardTitle>
                <CardDescription>
                    Activate your custom strategies to configure how Vor2ex analyzes and scores each niche.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="outline">
                    <Link href="/strategies" className="flex items-center gap-2">
                        <DraftingCompass />
                        <span>Manage Strategies</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

export function NoStrategiesCreatedFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Ups! No strategies created</CardTitle>
                <CardDescription>
                    Create your own custom strategies to configure how Vor2ex analyzes and scores each niche.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button variant="outline">
                    <Link href="/strategies/create" className="flex items-center gap-2">
                        <DraftingCompass />
                        <span>Create your first strategy</span>
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}