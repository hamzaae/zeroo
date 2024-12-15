"use client";

import { NextResponse } from "next/server";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";

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

  const MAX_FILE_SIZE_MB = 2; // Max size in MB
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert to bytes

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("File is required");
      toast({
        title: error,
        description: "Please select a file to upload",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File size should not exceed ${MAX_FILE_SIZE_MB} MB`);
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB} MB`,
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", file as Blob);

    try {
      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();

        if (!process.env.NEXT_PUBLIC_COHERE_API_KEY) {
          console.log("API key not found");
          setError("API key not found");
          return;
        }

        const model = new ChatCohere({
          apiKey: process.env.NEXT_PUBLIC_COHERE_API_KEY,
        });

        const prompt = `Given the following text, which is a summary of a document, 
        generate a quizz based on the text. Return json only that contains a quizz object with the fields: 
        name, description and questions. The questions is an array of objects with fields: questionText, answers. 
        The answers field should be an array of objects with the fields: answerText, isCorrect.`;

        const message = new HumanMessage(prompt + "\n" + data.texts.join("\n"));
        const results = await model.invoke([message]);

        const responseText = (results.content as string).replace(/^```json\s*/, "").replace(/\s*```$/, "");
        const quizzObject = JSON.parse(responseText);
        setQuizz(quizzObject.quiz);

      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later",
        });
      }
    } catch (e) {
      toast({
        title: "An error occurred",
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
<div className="flex flex-col space-y-4 items-center w-3/4">
  <Skeleton className="h-[200px] w-full max-w-3xl rounded-xl" />
  <div className="space-y-2 w-full max-w-3xl">
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-6 w-3/4" />
  </div>
  <p className="text-center text-gray-500">This usually takes a few seconds, please wait...</p>
</div>
      </>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid w-full max-w-sm items-center gap-1.5"
        >
          <Input
            id="file"
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e?.target?.files?.[0])}
          />
          <Button type="submit" disabled={isLoading}>
            Upload
          </Button>
          <ul className="list-disc list-inside mb-4">
            <li>Max file size: 2MB</li>
            <li>Accepted file type: PDF</li>
          </ul>
        </form>
      )}
    </>
  );
}
