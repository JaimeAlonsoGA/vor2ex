import { BarChart3, Package, TrendingUp, Wrench } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const modules = [
    {
        key: "products",
        icon: <Package className="h-7 w-7 text-blue-400 group-hover:text-blue-300 transition-transform" />,
        title: "Product Searcher",
        desc: "Find profitable products across Amazon and Alibaba.",
        gradient: "from-gray-900 via-blue-950 to-gray-800",
        ring: "ring-blue-900/30",
        to: "/explorer",
    },
    {
        key: "opportunities",
        icon: <TrendingUp className="h-7 w-7 text-green-400 group-hover:text-green-300 transition-transform" />,
        title: "Opportunity Finder",
        desc: "Discover untapped market opportunities.",
        gradient: "from-gray-900 via-green-950 to-gray-800",
        ring: "ring-green-900/30",
        to: "/oportunity-finder",
    },
    {
        key: "analytics",
        icon: <BarChart3 className="h-7 w-7 text-yellow-400 group-hover:text-yellow-300 transition-transform" />,
        title: "Analytics Dashboard",
        desc: "Track and analyze your market performance.",
        gradient: "from-gray-900 via-yellow-950 to-gray-800",
        ring: "ring-yellow-900/30",
        to: "/niche-analyser",
    },
    {
        key: "tools",
        icon: <Wrench className="h-7 w-7 text-indigo-400 group-hover:text-indigo-300 transition-transform" />,
        title: "Tools",
        desc: "Essential utilities to boost your workflow.",
        gradient: "from-gray-900 via-purple-950 to-gray-800",
        ring: "ring-purple-900/30",
        to: "/tools",
    },
];

export function ModulesCard({
    products,
    analytics,
    opportunities,
    tools,
}: {
    products?: boolean;
    analytics?: boolean;
    opportunities?: boolean;
    tools?: boolean;
}) {
    const enabled = [
        products && "products",
        opportunities && "opportunities",
        analytics && "analytics",
        tools && "tools",
    ].filter(Boolean);

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules
                .filter((m) => enabled.includes(m.key))
                .map((m) => (
                    <Link key={m.key} href={m.to}>
                        <Card
                            key={m.key}
                            className={cn(
                                "group relative overflow-hidden cursor-pointer border-none shadow-lg hover:scale-[1.015] transition-transform duration-200 bg-gradient-to-br",
                                m.gradient,
                                m.ring,
                                "hover:ring-2 focus-visible:ring-2"
                            )}
                            tabIndex={0}
                            aria-label={m.title}
                        >
                            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
                            <CardHeader className="relative z-10">
                                <CardTitle className="flex items-center gap-3 text-gray-100 drop-shadow">
                                    <span className="rounded-full bg-white/5 p-2">{m.icon}</span>
                                    <span className="text-lg font-semibold">{m.title}</span>
                                </CardTitle>
                                <CardDescription className="text-gray-300 mt-2 text-sm font-medium drop-shadow">
                                    {m.desc}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
        </div>
    );
}