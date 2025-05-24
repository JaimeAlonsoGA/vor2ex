import Link from "next/link";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/services/auth.service";
import { ThemeSwitcher } from "../../theme-switcher";
import { Bell, ChevronDown, CreditCard, LogOut, Megaphone, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V2</span>
            </div>
            <span className="font-bold text-xl">Vor2ex</span>
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-600 rounded-full text-xs"></span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://avatar.iran.liara.run/public/44" alt={user.user_metadata?.name || user.email || "User"} />
                    <AvatarFallback>
                      {(user.user_metadata?.name || user.email || "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">Pro Plan</p>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.user_metadata?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subscriptions
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Megaphone className="mr-2 h-4 w-4" />
                  Product Updates
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={signOutAction}>
                  <DropdownMenuItem className="text-red-600" asChild>
                    <button type="submit" className="flex items-center w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant={"outline"}>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant={"default"}>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
