"use client";

import { ThemeProvider } from "@/components/theme-provider";
import UploadFile from "./UploadFile";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import { CarouselQuizz } from "@/components/CarouselQuizz";

interface Answer {
  answerText: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  answers: Answer[];
}

interface Quiz {
  name: string;
  description: string;
  questions: Question[];
}

export default function Home() {
  const [quizz, setQuizz] = useState<Quiz | null>(null);

  return (
    <ThemeProvider>
      <Navbar />
      <div className="flex justify-center items-center h-screen">
        {quizz ? (
          <CarouselQuizz quizz={quizz} />
        ) : (
          <UploadFile setQuizz={setQuizz} />
        )}
      </div>
    </ThemeProvider>
  );
}
