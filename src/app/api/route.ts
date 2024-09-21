import { NextRequest, NextResponse } from "next/server";

import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";
// import { ChatPromptTemplate } from "@langchain/core/prompts";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req: NextRequest) {
  console.log("POST /api/quizz");
  const body = await req.formData();
  // console.log(body);
  const document = body.get("pdf");
  // console.log(document);

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
        parsedItemSeparator: " "
    });
    const docs = await pdfLoader.load();
    // console.log(docs);

    const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
    const texts = selectedDocuments.map((doc) => doc.pageContent);
    // console.log(texts);

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
    // console.log(message);

    const results = await model.invoke([message]);
    // console.log(results.content);

    const responseText = (results.content as string).replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const quizzObject = JSON.parse(responseText);
    // console.log(quizzObject.quiz); 

    return NextResponse.json({ quizzObject }, { status: 200 });

  } catch (e:any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }

}