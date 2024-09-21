import { NextRequest, NextResponse } from "next/server";
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

    return NextResponse.json({ texts }, { status: 200 });

  } catch (e:any) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }

}
