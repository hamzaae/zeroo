"use client";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Sponsors } from "@/components/Sponsors";
import { About } from "@/components/About";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Services } from "@/components/Services";
import { Cta } from "@/components/Cta";
import { Testimonials } from "@/components/Testimonials";
import { Team } from "@/components/Team";
import { Pricing } from "@/components/Pricing";
import { Newsletter } from "@/components/Newsletter";
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
        {/* <Sponsors /> */}
        {/* <About /> */}
        <HowItWorks />
        {/* <Features /> */}
        {/* <Services /> */}
        <Cta />
        {/* <Testimonials /> */}
        {/* <Team /> */}
        {/* <Pricing /> */}
        {/* <Newsletter /> */}
        <FAQ />
        <Footer />
        <ScrollToTop />
      </ThemeProvider>
    </main>
  );
}
