import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}
