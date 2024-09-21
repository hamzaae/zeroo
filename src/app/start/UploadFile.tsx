"use client";

import { NextResponse } from "next/server";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

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

interface UploadFileProps {
  setQuizz: React.Dispatch<React.SetStateAction<Quiz | null>>;
}

export default function UploadFile({ setQuizz }: UploadFileProps) {
  const [file, setFile] = useState<Blob | File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('File is required');
      return;
    }
  
    setIsLoading(true);
    const formData = new FormData();
    formData.append('pdf', file as Blob);
  
    try {
      // First: Parse the PDF
      const parseResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!parseResponse.ok) {
        throw new Error('Failed to parse PDF');
      }
  
      const { texts } = await parseResponse.json();
  
      // Second: Generate Quiz with parsed texts
      const quizResponse = await fetch('/api/quizz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts }),
      });
  
      if (quizResponse.ok) {
        const data = await quizResponse.json();
        setQuizz(data.quizzObject.quiz); 
      } else {
        throw new Error('Failed to generate quiz');
      }
  
    } catch (e) {
      console.error(e);
      setError('An error occurred. Please try again later.');
    }
  
    setIsLoading(false);
  };
  

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid w-full max-w-sm items-center gap-1.5"
        >
          <Label htmlFor="file">File</Label>
          <Input
            id="file"
            type="file"
            onChange={(e) => setFile(e?.target?.files?.[0])}
          />
          <Button type="submit" disabled={isLoading}>
            Upload
          </Button>
        </form>
      )}
    </>
  );
}
