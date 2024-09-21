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
      setError("File is required");
      toast({
        title: error,
        description: "Please select a file to upload",
      });
      return;
    }
    setIsLoading(true);

    try {
    console.log("Uploading file");
    const pdfLoader = new PDFLoader(file as Blob, {
        parsedItemSeparator: " "
    });
    const docs = await pdfLoader.load();
    // console.log(docs);

    const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
    const texts = selectedDocuments.map((doc) => doc.pageContent);
    // console.log(texts);

    if (!process.env.COHERE_API_KEY) {
      console.log("API key not found");
      return;
      // return NextResponse.json({ message: "API key not found" }, { status: 500 });
    }
    
    const model = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY
    });
    // console.log("Model created");

    const prompt = "Given the following text, which is a summary of a document, generate a quizz based on the text. Return json only that contains a quizz object with the fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers field should be an array of objects with the fields: answerText, isCorrect.";

    const message = new HumanMessage(prompt + "\n" + texts.join("\n"));
    // console.log(message);

    const results = await model.invoke([message]);
    // console.log(results.content);

    const responseText = (results.content as string).replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const quizzObject = JSON.parse(responseText);
    // console.log(quizzObject.quiz); 

    // return NextResponse.json({ quizzObject }, { status: 200 });

    setQuizz(quizzObject.quiz); 

    } catch (e) {
      console.log(e);
      toast({
        title: "An error occurred",
        description: "Please try again later",
      });
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
