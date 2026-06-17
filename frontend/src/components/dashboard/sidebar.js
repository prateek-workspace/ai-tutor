"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  BookOpen,
  BarChart3,
  Settings,
  Calendar,
  FolderKanban,
  MessageSquare,
  PanelLeft,
  LayoutDashboard,
  User,
} from "lucide-react";

export function Sidebar({ className }) {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/profile"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Courses
          </h2>
          <div className="space-y-1">
            <Link
              href="/courses"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/courses"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </Link>
            <Link
              href="/dashboard/tasks"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/tasks"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <FolderKanban className="mr-2 h-4 w-4" />
              Tasks
            </Link>
            <Link
              href="/dashboard/calendar"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/calendar"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Analytics
          </h2>
          <div className="space-y-1">
            <Link
              href="/dashboard/stats"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/stats"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Stats
            </Link>
            <Link
              href="/dashboard/reports"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/reports"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <PanelLeft className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Communication
          </h2>
          <div className="space-y-1">
            <Link
              href="/dashboard/messages"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/messages"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Settings
          </h2>
          <div className="space-y-1">
            <Link
              href="/dashboard/settings"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                pathname === "/dashboard/settings"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-primary hover:bg-accent",
                "justify-start w-full"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 