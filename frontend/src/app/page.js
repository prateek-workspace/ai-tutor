import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import About from "@/components/landing/About";
import Showcase from "@/components/landing/Showcase";
import Features from "@/components/landing/Features";
import Philosophy from "@/components/landing/Philosophy";
import UseCases from "@/components/landing/UseCases";
import Steps from "@/components/landing/Steps";
import Stats from "@/components/landing/Stats";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-hidden">
      <Hero />
      <Marquee />
      <About />
      <Showcase />
      <Features />
      <Philosophy />
      <UseCases />
      <Steps />
      <Stats />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
