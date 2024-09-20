import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function POST(req: NextRequest) {
  console.log("POST /api/uploadPdf");
  const body = await req.formData();
  const document = body.get("pdf");

  try {
    const pdfLoader = new PDFLoader(document as Blob, {
      parsedItemSeparator: " "
    });
    
    const docs = await pdfLoader.load();
    const selectedDocuments = docs.filter((doc) => doc.pageContent !== undefined);
    const texts = selectedDocuments.map((doc) => doc.pageContent);

    return NextResponse.json({ texts }, { status: 200 });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e.message }, { status: 500 });
  }
}
