"use client"

import { useState } from "react"
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
        title: "Radar",
        icon: Rss,
        href: "/opportunity-finder",
        badge: "New",
    },
    {
        title: "Insights",
        icon: Component,
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

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <div
            className={cn(
                "hidden md:flex",
                "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
                isCollapsed ? "w-16" : "w-64",
            )}
        >
            <div className="flex h-full flex-col">
                {/* Toggle Button */}
                <div className="flex justify-end p-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 p-0">
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 space-y-2 p-2">
                    {menuItems.map((item) => (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn("w-full justify-start", isCollapsed ? "px-2" : "px-3")}
                            asChild
                        >
                            <a href={item.href}>
                                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.title}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </a>
                        </Button>
                    ))}

                    <Separator className="my-4" />

                    {/* Support Section */}
                    {supportItems.map((item) => (
                        <Button
                            key={item.href}
                            variant="ghost"
                            className={cn("w-full justify-start", isCollapsed ? "px-2" : "px-3")}
                            asChild
                        >
                            <a href={item.href}>
                                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.title}</span>
                                        {item.badge && (
                                            <Badge variant="secondary" className="ml-auto text-xs">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </a>
                        </Button>
                    ))}
                </nav>

                {/* Server Status */}
                {!isCollapsed && (
                    <div className="border-t p-4">
                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Server Status</h4>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs">API</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        Operational
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-xs">Database</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs">
                                        Operational
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                        <span className="text-xs">Scraper</span>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        Maintenance
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapsed Server Status */}
                {isCollapsed && (
                    <div className="border-t p-2">
                        <div className="flex flex-col items-center space-y-2 mb-1">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col space-y-1">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
