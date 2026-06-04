import { toScreamingSnakeCase } from ".";
import { CloudinaryUploadResult } from "@/types";

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * When NEXT_PUBLIC_USE_PLACEHOLDER_UPLOAD === "true" (e.g. the Muvment NG tagging env),
 * we DO NOT hit Cloudinary (it's costly to call on every upload). Instead every file is
 * resolved to NEXT_PUBLIC_DEFAULT_IMAGE_URL and returned in the same shape the API expects.
 */
const USE_PLACEHOLDER_UPLOAD = process.env.NEXT_PUBLIC_USE_PLACEHOLDER_UPLOAD === "true";
const DEFAULT_IMAGE_URL = process.env.NEXT_PUBLIC_DEFAULT_IMAGE_URL || "";

function buildPlaceholderResult(
  key: string,
  fileType: string
): CloudinaryUploadResult {
  if (fileType === "photos") {
    return {
      cloudinaryUrl: DEFAULT_IMAGE_URL,
      cloudinaryPublicId: "placeholder",
      isPrimary: true,
    } as CloudinaryUploadResult;
  }
  if (fileType === "documents") {
    return {
      documentType: toScreamingSnakeCase(key),
      cloudinaryUrl: DEFAULT_IMAGE_URL,
      cloudinaryPublicId: "placeholder",
    } as CloudinaryUploadResult;
  }
  return { key, url: DEFAULT_IMAGE_URL } as CloudinaryUploadResult;
}

export const uploadToCloudinary = async (
  formData: FormData,
  fileType: string
): Promise<(CloudinaryUploadResult | undefined)[]> => {
  const entries = Array.from(formData.entries());

  // Placeholder mode: skip Cloudinary entirely, return the default image string.
  if (USE_PLACEHOLDER_UPLOAD) {
    return entries
      .filter(([, value]) => value instanceof File)
      .map(([key]) => buildPlaceholderResult(key, fileType));
  }

  // Create an array of upload promises
  const uploadPromises = entries.map(async ([key, value]) => {
    if (value instanceof File) {
      // Prepare a new FormData for each upload
      const uploadData = new FormData();
      uploadData.append("file", value);
      uploadData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

      // Upload to Cloudinary
      const res = await fetch(`${CLOUDINARY_URL}`, {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error(`Failed to upload ${key}`);
      const data = await res.json();
      if (fileType === "photos") {
        return {
          cloudinaryUrl: data.secure_url,
          cloudinaryPublicId: data.public_id,
          isPrimary: true,
        };
      } else if (fileType === "documents") {
        return {
          documentType: toScreamingSnakeCase(key),
          cloudinaryUrl: data.secure_url,
          cloudinaryPublicId: data.public_id,
        };
      } else {
        return { key, url: data.secure_url };
      }
    }
  });

  // Wait for all uploads in parallel
  const results = await Promise.all(uploadPromises);

  return results;
};
