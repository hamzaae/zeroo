"use client";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
]

type CardProps = React.ComponentProps<typeof Card>

export function CardUpload({ className, ...props }: CardProps) {

  const [file, setFile] = useState<Blob | File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();

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
        // router.push('/start/' + JSON.stringify(data));
        // router.push(`/start/${id}`, { query: { quiz: JSON.stringify(data) } });
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
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Upload</CardTitle>
        <CardDescription>{isLoading ? "Document uploaded, please wait a moment." : "Upload your file and get started!"}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isLoading ?
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
          :
          <>
            <form onSubmit={handleSubmit} className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="file">File</Label>
              <Input id="file" type="file" onChange={(e) => setFile(e?.target?.files?.[0])} />
              <Button type="submit" disabled={isLoading}>
                Upload
              </Button>
              {/* {error && <p>{error}</p>} */}
            </form>

            <div>
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                >
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        }
      </CardContent>
      {/* <CardFooter>
        <UploadFile />
      </CardFooter> */}
    </Card>
  )
}
