"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { Button } from "../ui/button";
import { Camera } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/get-initials";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  updateUserProfile,
  uploadImageToCloudinary,
} from "@/lib/actions/profile";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    username?: string | null;
    bio?: string | null;
    avatar?: string | null;
    image?: string | null;
  };
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
}: EditProfileModalProps) {
  const [banner, setBanner] = useState<string | null>(user.image || null);
  const [avatar, setAvatar] = useState<string | null>(user.avatar || null);
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio || "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function handleImageUpload(file: File, type: "avatar" | "banner") {
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      if (type === "avatar") {
        setAvatar(imageUrl);
      } else {
        setBanner(imageUrl);
      }
    } catch (err) {
      console.error("error uploading image:", err);
      toast.error("Failed to upload image");
    }
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner"
  ) {
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

    handleImageUpload(file, type);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);

    try {
      const result = await updateUserProfile({
        ...formData,
        avatar: avatar || undefined,
        banner: banner || undefined,
      });

      if (result.success) {
        router.refresh();
        onClose();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg overflow-hidden relative">
              {banner && (
                <Image
                  src={banner}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "banner")}
              ref={bannerInputRef}
            />
            <Button
              onClick={() => bannerInputRef.current?.click()}
              variant={"ghost"}
              type="button"
              className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-4 -mt-16 ml-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background">
                <AvatarImage src={avatar ?? undefined} />
                <AvatarFallback className="text-xl">
                  {" "}
                  {getInitials(user.name)}{" "}
                </AvatarFallback>
              </Avatar>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "avatar")}
                ref={avatarInputRef}
              />
              <Button
                onClick={() => avatarInputRef.current?.click()}
                variant={"ghost"}
                type="button"
                className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                maxLength={50}
                required
              />
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username ?? ""}
                onChange={handleInputChange}
                placeholder="Enter your username"
                maxLength={30}
                required
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2">
                Bio
              </label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio ?? ""}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
                maxLength={160}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
