import { Link } from "react-router-dom";
import { Icon, IconAndLogo } from "./branding";
import { NotificationsDropdown } from "../notification-dropdown";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, CreditCard, DraftingCompass, LogOut, Megaphone, Settings, User } from "lucide-react";
import { useUserWithStrategy } from "@/queries/auth.queries";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "../ui/breadcrumb";

export default function Header() {
    const { data: user, isLoading } = useUserWithStrategy();

    if (isLoading) return <div>Loading header...</div>;
    if (!user) return <div>No user found</div>;

    return (
        <header className="flex h-12 items-center justify-between pr-2 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
            <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="line-clamp-1">
                                Find Rentable Products & Providers
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <span className="flex items-center space-x-2">
                {/* <NotificationsDropdown activeStrategies={user.strategy} /> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center space-x-2 px-3"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="https://avatar.iran.liara.run/public/44"
                                    alt={user.name ?? "user avatar"}
                                />
                                <AvatarFallback>
                                    {user.name?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">Pro Plan</p>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link to="/strategies" className="flex items-center w-full">
                                <DraftingCompass className="mr-2 h-4 w-4" />
                                Strategies
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link to="/settings" className="flex items-center w-full">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link
                                to="/subscriptions"
                                className="flex items-center w-full"
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                Subscriptions
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Megaphone className="mr-2 h-4 w-4" />
                            Product Updates
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" asChild>
                            <button type="submit" className="flex items-center w-full">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        </header>
    );
}