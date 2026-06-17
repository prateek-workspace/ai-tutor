"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, Video, Clock, Award, FileText,
  Mic, ListChecks, Settings,
  BookText, ChevronRight, Menu, X, Calendar, User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const NavItem = ({ icon, label, path, isActive, onClick, collapsed }) => {
  return (
    <Link 
      href={path}
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-3 rounded-lg transition-colors group",
        collapsed && "justify-center px-2",
        isActive 
          ? "bg-accent text-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <span className={cn("flex-shrink-0", !collapsed && "mr-3")}>{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
      {isActive && !collapsed && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  );
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const checkScreenSize = () => {
        setIsSmallScreen(window.innerWidth < 1024);
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };
      
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);
      
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Overview",
      path: "/dashboard",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      label: "Smartboard",
      path: "/smartboard",
    },
    {
      icon: <ListChecks className="h-5 w-5" />,
      label: "Quiz Studio",
      path: "/quiz",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Test Generator",
      path: "/test-generate",
    },
    {
      icon: <Video className="h-5 w-5" />,
      label: "Video Lectures",
      path: "/dashboard/videos",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      label: "Attendance",
      path: "/dashboard/attendance",
    },
    {
      icon: <Award className="h-5 w-5" />,
      label: "Results",
      path: "/dashboard/results",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Tests & Quizzes",
      path: "/dashboard/tests",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Calendar",
      path: "/dashboard/calendar",
    },
    {
      icon: <BookText className="h-5 w-5" />,
      label: "Notes",
      path: "/dashboard/notes",
    },
  ];

  const settingItems = [
    {
      icon: <User className="h-5 w-5" />,
      label: "Profile",
      path: "/dashboard/profile",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Stats",
      path: "/dashboard/stats",
    },
  ];

  // Mobile sidebar toggle button visible only on small screens
  const MobileSidebarToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-primary-foreground shadow-lg rounded-full"
      onClick={toggleSidebar}
    >
      {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );

  return (
    <>
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-10 lg:relative flex flex-col bg-background border-r transition-all w-[250px]",
          isSmallScreen && (isSidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full shadow-lg"),
          !isSmallScreen && !isSidebarOpen && "w-[70px]",
          isSmallScreen && !isSidebarOpen && "hidden"
        )}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b">
          <h2 className={cn(
            "text-2xl font-display transition-opacity",
            !isSmallScreen && !isSidebarOpen && "opacity-0 w-0 overflow-hidden"
          )}>
            Sahayak
          </h2>
          {!isSmallScreen && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              {isSidebarOpen ? 
                <ChevronRight className="h-4 w-4 rotate-180" /> : 
                <ChevronRight className="h-4 w-4" />
              }
            </Button>
          )}
        </div>
        
        <ScrollArea className="flex-1 py-2">
          <div className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isActive={pathname === item.path}
                onClick={isSmallScreen ? () => setIsSidebarOpen(false) : undefined}
                collapsed={!isSmallScreen && !isSidebarOpen}
              />
            ))}
          </div>
          
          <div className={cn(
            "mt-6", 
            !isSmallScreen && !isSidebarOpen ? "px-2" : "px-4"
          )}>
            <h3 className={cn(
              "mb-2 text-xs uppercase text-muted-foreground font-medium",
              !isSmallScreen && !isSidebarOpen && "opacity-0 h-0 overflow-hidden m-0"
            )}>
              Support
            </h3>
            <div className="px-2 space-y-1">
              {settingItems.map((item) => (
                <NavItem
                  key={item.path}
                  icon={item.icon}
                  label={item.label}
                  path={item.path}
                  isActive={pathname === item.path}
                  onClick={isSmallScreen ? () => setIsSidebarOpen(false) : undefined}
                  collapsed={!isSmallScreen && !isSidebarOpen}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </aside>
      
      {isSmallScreen && <MobileSidebarToggle />}
      
      {/* Overlay for mobile */}
      {isSmallScreen && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
} 