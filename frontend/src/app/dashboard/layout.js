import { Inter } from "next/font/google";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export const metadata = {
  title: "Dashboard | AI Tutor",
  description: "AI Tutor Dashboard for Teachers and Students",
};

export default function DashboardLayout({ children }) {
  // For now, no authentication is implemented, 
  // but this is where you would check if the user is authenticated
  // const isAuthenticated = useAuth();
  // if (!isAuthenticated) {
  //   redirect("/login");
  // }

  return (
    <div className="dark min-h-screen flex flex-col bg-background text-foreground">
      <DashboardHeader />
      <div className="flex flex-1 flex-grow">
        <DashboardSidebar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto dark-scroll">
          {children}
        </main>
      </div>
    </div>
  );
} 