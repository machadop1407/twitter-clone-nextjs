"use client";

import { SessionUser } from "@/lib/auth/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ImageIcon, X } from "lucide-react";
import { useState } from "react";
import { createTweet } from "@/lib/actions/tweets";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface TweetComposerProps {
  user?: SessionUser;
  placeholder?: string;
  onSubmit?: (content: string, imageUrl?: string) => void;
  onCancel?: () => void;
}

export default function TweetComposer({
  user,
  placeholder = "What's Happening?",
  onSubmit,
  onCancel,
}: TweetComposerProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const router = useRouter();

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // validate file is image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    // validate file size
    if (file.size > 1024 * 1024 * 5) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const previewURL = URL.createObjectURL(file);
    setSelectedImage(previewURL);
  }

  function removeImage() {
    setSelectedFile(null);
    setSelectedImage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    try {
      let imageUrl: string | undefined;

      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("upload_preset", "twitter-clone");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          toast.error("Failed to upload image");
          return;
        }

        const data = await response.json();
        imageUrl = data.secure_url;
        setIsUploading(false);
      }

      if (onSubmit) {
        onSubmit(content.trim(), imageUrl);
        setContent("");
        setSelectedFile(null);
        setSelectedImage(null);
      } else {
        const result = await createTweet(content.trim(), imageUrl);
        if (result.success) {
          setContent("");
          setSelectedFile(null);
          setSelectedImage(null);
          // Dispatch custom event to refresh tweets
          window.dispatchEvent(new CustomEvent("refreshTweets"));
          router.refresh();
        } else {
          toast.error("Failed to create tweet");
        }
      }
    } catch (err) {
      toast.error("Failed to create tweet");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-b border-border p-4">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {user && (
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar ?? undefined} />
              <AvatarFallback> {getInitials(user.name ?? "")} </AvatarFallback>
            </Avatar>
          )}
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder={placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] border-0 resize-none text-lg placeholder:text-muted-foreground focus-visible:ring-0"
              maxLength={280}
            />

            {selectedImage && (
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  width={800}
                  height={320}
                  className="max-w-full max-h-80 rounded-lg object-cover"
                />
                <Button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  id="image-upload"
                />
                <Button
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  variant={"ghost"}
                  type="button"
                  className="text-blue-500 hover:text-blue-600 p-2"
                >
                  <ImageIcon className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  {content.length}/280
                </span>

                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  type="submit"
                  className="rounded-full px-6"
                  disabled={!content.trim() || content.length > 280}
                >
                  {isLoading
                    ? "Posting..."
                    : isUploading
                    ? "Uploading..."
                    : "Tweet"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
