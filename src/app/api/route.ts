import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req: NextRequest) {
  console.log("POST /api/quizz");
  const body = await req.formData();
  const document = body.get("pdf") as Blob;

  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  try {
    if (!document) {
      throw new Error("File is required");
    }

    if (document.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit`);
    }

    if (document.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed");
    }

    const pdfLoader = new PDFLoader(document, {
      parsedItemSeparator: " ",
    });
    const docs = await pdfLoader.load();
    const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    return NextResponse.json({ texts }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
