"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, User, LogOut, Settings, Search, 
  Moon, Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

export default function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [searchActive, setSearchActive] = useState(false);
  
  // Mock notifications for the UI
  const notifications = [
    { id: 1, title: "Assignment Graded", message: "Your Math assignment has been graded.", time: "2 hours ago" },
    { id: 2, title: "New Quiz Available", message: "A new Computer Science quiz is now available.", time: "5 hours ago" },
    { id: 3, title: "Class Reminder", message: "Physics class starts in 30 minutes.", time: "25 minutes ago" }
  ];
  
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/" className="font-bold text-lg">
            AI Tutor
          </Link>
        </div>
        
        <div className={cn(
          "flex-1 transition-all duration-200 ease-in-out",
          searchActive ? "md:mx-4 lg:mx-8 xl:mx-16" : "mx-4"
        )}>
          <div className="relative">
            <Search 
              className={cn(
                "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-opacity",
                searchActive ? "opacity-100" : "opacity-70"
              )} 
            />
            <Input
              type="search"
              placeholder="Search..."
              className={cn(
                "w-full bg-background pl-8 md:w-64 lg:w-80",
                searchActive && "md:w-80 lg:w-96"
              )}
              onFocus={() => setSearchActive(true)}
              onBlur={() => setSearchActive(false)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Notification dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 text-[10px] h-4 min-w-4 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <p className="text-sm font-medium">Notifications</p>
                <Button variant="ghost" size="sm" className="text-xs">Mark all as read</Button>
              </div>
              <Separator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="p-3 hover:bg-secondary/50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-[10px] text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="p-2 text-center">
                <Button variant="ghost" size="sm" className="text-xs w-full">View all notifications</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john.doe@example.com</p>
              </div>
              <Separator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">My Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/stats">My Stats</Link>
              </DropdownMenuItem>
              <Separator />
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
} 