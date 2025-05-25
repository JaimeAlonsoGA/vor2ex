import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsFallback() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Niche Analyser</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">No analytics to display.</p>
            </CardContent>
        </Card>
    );
}