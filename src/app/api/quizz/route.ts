import { NextRequest, NextResponse } from "next/server";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  console.log("POST /api/generateQuiz");
  const { texts } = await req.json(); // Expecting texts array in the body

  if (!texts || !Array.isArray(texts)) {
    return NextResponse.json({ message: "Invalid texts input" }, { status: 400 });
  }

  try {
    if (!process.env.COHERE_API_KEY) {
      console.log("API key not found");
      return NextResponse.json({ message: "API key not found" }, { status: 500 });
    }
    
    const model = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY
    });
    console.log("Model created");

    const prompt = "Given the following text, which is a summary of a document, generate a quizz based on the text. Return json only that contains a quizz object with the fields: name, description and questions. The questions is an array of objects with fields: questionText, answers. The answers field should be an array of objects with the fields: answerText, isCorrect.";

    const message = new HumanMessage(prompt + "\n" + texts.join("\n"));
    
    const results = await model.invoke([message]);
    const responseText = (results.content as string).replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const quizzObject = JSON.parse(responseText);

    return NextResponse.json({ quizzObject }, { status: 200 });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
