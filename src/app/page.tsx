"use client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Cta } from "@/components/Cta";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ThemeProvider } from "@/components/theme-provider";

export default function Home() {
  return (
    <main >
      <ThemeProvider>
        <Navbar />
        <Hero />
        <HowItWorks />
        <Cta />
        <FAQ />
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </main>
  );
}
