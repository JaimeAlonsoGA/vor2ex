import {
    Search,
    TrendingUp,
    BarChart3,
    HelpCircle,
    Lightbulb,
    Wrench,
    ChevronLeft,
    ChevronRight,
    Home,
    Server,
    ChartPie,
    Shapes,
    Blend,
    SquareSquare,
    ChartColumn,
    Component,
    Rss,
} from "lucide-react";

export const menuItems = [
    {
        title: "Dashboard",
        icon: Home,
        href: "/dashboard",
        badge: null,
    },
    {
        title: "Explorer",
        icon: Search,
        href: "/explorer",
        badge: null,
    },
    {
        title: "Radar",
        icon: Rss,
        href: "/radar",
        badge: "New",
    },
];

export const supportItems = [
    {
        title: "Help & Support",
        icon: HelpCircle,
        href: "/help",
        badge: null,
    },
    {
        title: "Got an Idea?",
        icon: Lightbulb,
        href: "/feedback",
        badge: null,
    },
];