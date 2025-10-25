export type CloudinaryPhotoUpload = {
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
  isPrimary: boolean;
};

export type CloudinaryDocumentUpload = {
  documentType: string;
  cloudinaryUrl: string;
  cloudinaryPublicId: string;
};

export type CloudinaryGenericUpload = {
  key: string;
  url: string;
};

export type CloudinaryUploadResult =
  | CloudinaryPhotoUpload
  | CloudinaryDocumentUpload
  | CloudinaryGenericUpload;
