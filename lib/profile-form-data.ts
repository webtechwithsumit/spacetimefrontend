type ProfileFields = {
  name: string;
  email: string;
  phone: string;
  aadharNo: string;
  password?: string;
  currentPassword?: string;
};

type ProfileMediaState = {
  existingImage: string;
  existingKycDocuments: string[];
  imageFile: File | null;
  kycFiles: File[];
};

export function buildProfileFormData(
  fields: ProfileFields,
  media: ProfileMediaState,
) {
  const formData = new FormData();

  formData.append("name", fields.name);
  formData.append("email", fields.email);
  formData.append("phone", fields.phone);
  formData.append("aadharNo", fields.aadharNo);
  formData.append("existingImage", media.existingImage);
  formData.append(
    "existingKycDocuments",
    JSON.stringify(media.existingKycDocuments),
  );

  if (fields.password) {
    formData.append("password", fields.password);
    formData.append("currentPassword", fields.currentPassword ?? "");
  }

  if (media.imageFile) {
    formData.append("image", media.imageFile);
  }

  media.kycFiles.forEach((file) => formData.append("kycDocuments", file));

  return formData;
}
