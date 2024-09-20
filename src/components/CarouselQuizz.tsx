"use client";
import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

// Define the interfaces if needed
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

interface CarouselQuizzProps {
  quizz: Quiz;
}

// Function to shuffle an array (Fisher-Yates Shuffle Algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function CarouselQuizz({ quizz }: CarouselQuizzProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(quizz.questions.length).fill(null));
  const [isDone, setIsDone] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  // Shuffle the answers for each question when the component mounts
  useEffect(() => {
    const shuffled = quizz.questions.map((question) => ({
      ...question,
      answers: shuffleArray(question.answers),
    }));
    setShuffledQuestions(shuffled);
  }, [quizz.questions]);

  const handleAnswerClick = (questionIndex: number, answerIndex: number) => {
    if (isDone) return; // Prevent selection after done
    setSelectedAnswers((prev) =>
      prev.map((selected, idx) => (idx === questionIndex ? answerIndex : selected))
    );
  };

  const handleDoneClick = () => {
    setIsDone(true);
    // Calculate score
    const correctAnswers = quizz.questions.reduce((acc, question, idx) => {
      const selectedAnswerIndex = selectedAnswers[idx];
      if (selectedAnswerIndex !== null && question.answers[selectedAnswerIndex].isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setScore((correctAnswers / quizz.questions.length) * 100);
  };

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-2xl font-bold mb-4">{quizz.name}</h1>
      <p className="mb-6">{quizz.description}</p>

      <Carousel className="w-full">
        <CarouselContent>
          {shuffledQuestions.map((question, questionIndex) => (
            <CarouselItem key={questionIndex}>
              <div className="p-1">
                <Card>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">
                        Question {questionIndex + 1}: {question.questionText}
                      </h2>
                    </div>
                    <ul className="space-y-2">
                      {question.answers.map((answer, answerIndex) => {
                        const isSelected = selectedAnswers[questionIndex] === answerIndex;
                        const isCorrect = answer.isCorrect;
                        const isDoneAndCorrect = isDone && isCorrect;
                        const isDoneAndIncorrectSelected =
                          isDone && isSelected && !isCorrect;

                        // Determine the background color based on the selection and done status
                        const bgColor = isDone
                          ? isDoneAndCorrect
                            ? "bg-green-100 border-green-500"
                            : isDoneAndIncorrectSelected
                            ? "bg-red-100 border-red-500"
                            : "border-gray-300"
                          : isSelected
                          ? "bg-blue-100 border-blue-500"
                          : "border-gray-300";

                        return (
                          <li
                            key={answerIndex}
                            className={`p-2 border rounded cursor-pointer ${bgColor}`}
                            onClick={() => handleAnswerClick(questionIndex, answerIndex)}
                          >
                            {answer.answerText}
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <div className="mt-6">
        {!isDone ? (
          <Button onClick={handleDoneClick} className="w-full">
            Done
          </Button>
        ) : (
          <div className="text-xl font-semibold text-center">
            Your score: {score?.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}
