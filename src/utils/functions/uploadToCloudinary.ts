import { toScreamingSnakeCase } from ".";
import { CloudinaryUploadResult } from "@/types";
// --- Cloudinary Upload Function (Same as Step 3) ---
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;




export const uploadToCloudinary = async ( formData: FormData, fileType:string): Promise<(CloudinaryUploadResult | undefined)[]>=> {
  const entries = Array.from(formData.entries())
  
// Create an array of upload promises
  const uploadPromises = entries.map(async ([key, value]) => {
    if (value instanceof File ) {
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
      if(fileType === "photos"){
         return {
          cloudinaryUrl:data.secure_url, 
          cloudinaryPublicId: data.public_id, 
          isPrimary:true
         }     

      }
      else if(fileType === "documents"){
        return {
            documentType:toScreamingSnakeCase(key),
            cloudinaryUrl:data.secure_url, 
            cloudinaryPublicId: data.public_id, 
        }
      } 
      else {
          return { key, url: data.secure_url };

      }
      
    }

  });

  // Wait for all uploads in parallel
  const results = await Promise.all(uploadPromises);

    return results;

}