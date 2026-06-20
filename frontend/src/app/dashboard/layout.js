import AppNav from "@/components/AppNav";

export const metadata = {
  title: "Dashboard | Sahayak",
  description: "Your classroom tools and recent activity in one place.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white dark-scroll">
      <AppNav />
      <main>{children}</main>
    </div>
  );
}
