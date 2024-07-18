"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function UploadFile() {

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
              })
            return;
        }
        setIsLoading(true);
        const formData = new FormData();
        formData.append('pdf', file as Blob);
        try {
            const response = await fetch('/api', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
            }

        } catch (e) {
            console.log(e);
            toast({
                title: "An error occurred",
                description: "Please try again later",
              })
        }
        setIsLoading(false);
    }

    return (
        <>
            {isLoading ?
                <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
                :
                <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">File</Label>
                    <Input id="file" type="file" onChange={(e) => setFile(e?.target?.files?.[0])} />
                    <Button type="submit" disabled={isLoading}>
                        Upload
                    </Button>
                    {/* {error && <p>{error}</p>} */}
                </form>
            }
        </>
    )
}
