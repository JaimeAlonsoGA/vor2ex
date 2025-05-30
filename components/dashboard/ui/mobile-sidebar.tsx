"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Search,
    TrendingUp,
    BarChart3,
    HelpCircle,
    Lightbulb,
    Wrench,
    Home,
    Server,
    Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
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
        title: "Opportunity Finder",
        icon: TrendingUp,
        href: "/opportunity-finder",
        badge: "New",
    },
    {
        title: "Niche Analyser",
        icon: BarChart3,
        href: "/niche-analyser",
        badge: null,
    },
    {
        title: "Tools",
        icon: Wrench,
        href: "/tools",
        badge: null,
    },
]

const supportItems = [
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
]

export default function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="z-50 rounded-full shadow-lg bg-background/80 backdrop-blur"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 max-w-[80vw]">
                    <nav className="flex flex-col h-full">
                        <div className="flex items-center px-6 py-4 border-b">
                            <span className="font-bold text-lg tracking-tight">Vor2ex</span>
                            <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <ul className="space-y-1 px-2 py-4">
                                {menuItems.map((item) => (
                                    <li key={item.href}>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="w-full justify-start px-3 py-2 rounded-lg transition-colors hover:bg-accent"
                                            onClick={() => setOpen(false)}
                                        >
                                            <a href={item.href} className="flex items-center space-x-3">
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-base">{item.title}</span>
                                                {/* {item.badge && (
                                                    <Badge variant="secondary" className="ml-auto text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )} */}
                                            </a>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                            <Separator className="my-2" />
                            <ul className="space-y-1 px-2">
                                {supportItems.map((item) => (
                                    <li key={item.href}>
                                        <Button
                                            asChild
                                            variant="ghost"
                                            className="w-full justify-start px-3 py-2 rounded-lg transition-colors hover:bg-accent"
                                            onClick={() => setOpen(false)}
                                        >
                                            <a href={item.href} className="flex items-center space-x-3">
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-base">{item.title}</span>
                                                {item.badge && (
                                                    <Badge variant="secondary" className="ml-auto text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </a>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="border-t px-6 py-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <Server className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-medium">Server Status</span>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                                        <span className="text-xs">API</span>
                                    </span>
                                    <Badge variant="outline" className="text-xs">Operational</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                                        <span className="text-xs">Database</span>
                                    </span>
                                    <Badge variant="outline" className="text-xs">Operational</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center space-x-2">
                                        <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                                        <span className="text-xs">Scraper</span>
                                    </span>
                                    <Badge variant="secondary" className="text-xs">Maintenance</Badge>
                                </div>
                            </div>
                        </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
    )
}