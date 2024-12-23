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
  onRetryAnotherQuiz?: () => void; // Callback for retrying another quiz
}

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
  const [score, setScore] = useState<number>(0);
  const [correct, setCorrect] = useState<number>(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (quizz) {
      const shuffled = quizz.questions.map((question) => ({
        ...question,
        answers: shuffleArray(question.answers),
      }));
      setShuffledQuestions(shuffled);
    }
  }, [quizz]);

  const handleAnswerClick = (questionIndex: number, answerIndex: number) => {
    if (isDone) return;
    setSelectedAnswers((prev) =>
      prev.map((selected, idx) => (idx === questionIndex ? answerIndex : selected))
    );
  };

  const calculateScore = () => {
    return quizz.questions.reduce((acc, question, idx) => {
      const selectedAnswerIndex = selectedAnswers[idx];
      if (
        selectedAnswerIndex !== null &&
        question.answers[selectedAnswerIndex].isCorrect
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
  };

  const handleDoneClick = () => {
    setIsDone(true);
    const correctAnswers = calculateScore();
    setCorrect(correctAnswers);
    setScore((correctAnswers / quizz.questions.length) * 100);
  };

  const handleRetrySameQuiz = () => {
    // Reset the quiz to initial state
    setSelectedAnswers(Array(quizz.questions.length).fill(null));
    setIsDone(false);
    setScore(0);
    setCorrect(0);
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
                            className={`p-2 border rounded ${isDone ? 'cursor-not-allowed' : 'cursor-pointer'} ${bgColor}`}
                            onClick={() => !isDone && handleAnswerClick(questionIndex, answerIndex)}
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
            Your score: {correct}/{quizz.questions.length} ( {score.toFixed(2)}% )
          </div>
        )}
      </div>

      {/* Display retry buttons after submission */}
      {isDone && (
        <div className="mt-6 flex space-x-4 justify-center">
          <Button onClick={handleRetrySameQuiz} className="w-full">
            Retry with Same Quiz
          </Button>
            <Button onClick={() => window.location.reload()} className="w-full">
            Retry with Another Quiz
            </Button>
        </div>
      )}
    </div>
  );
}
