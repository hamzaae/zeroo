"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";
import { CarouselQuizz } from "@/components/CarouselQuizz";

interface PageProps {
    params: {
      quizz: Object;
    };
  }

export default function Home({ params }: PageProps) {
    console.log("Hello from start page");

    console.log(params.quizz);


  return (
    <ThemeProvider>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
            <CarouselQuizz />
        </div>
    </ThemeProvider>
  )
}
