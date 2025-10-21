import * as React from "react"
import {
  AudioWaveform,
  Command,
  DraftingCompass,
  Home,
  Search,
} from "lucide-react"

import { NavFavorites } from "@/components/layout/navigation/nav-favorites"
import { NavMain } from "@/components/layout/navigation/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SidebarSwitcher } from "./strategy-switcher"

// This is sample data.
const data = {
  teams: [
    {
      name: "Amazon FBA Seller",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Amazing Sellers",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Big Company",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Strategies",
      url: "#",
      icon: DraftingCompass,
    },
    {
      title: "Vault",
      url: "#",
      icon: Home,
      isActive: true,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      emoji: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      emoji: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      emoji: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      emoji: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      emoji: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      emoji: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      emoji: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      emoji: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      emoji: "✅",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0 bg-muted" {...props}>
      <SidebarHeader>
        {/* <Link to="/dashboard" className="flex items-center space-x-2">
          <Icon />
        </Link> */}
        <SidebarSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        {/* <NavWorkspaces workspaces={data.workspaces} /> */}
      </SidebarContent>
      {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      <SidebarRail />
    </Sidebar>
  )
}
