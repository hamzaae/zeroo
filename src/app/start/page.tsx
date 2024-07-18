"use client";

import { ThemeProvider } from "@/components/theme-provider";
import UploadFile from "./UploadFile";
import { Navbar } from "@/components/Navbar";
import { CardUpload } from "@/components/CardUpload";


export default function Home() {


  return (
    <ThemeProvider>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
        {/* <UploadFile /> */}
        <CardUpload />
        </div>
    </ThemeProvider>
  )
}
