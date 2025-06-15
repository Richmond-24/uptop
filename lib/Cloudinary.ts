// lib/cloudinary.ts

export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
export const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`

export const uploadToCloudinary = async (file: Blob | File, fileName?: string) => {
  const formData = new FormData();
  formData.append('file', file);

  // 👇 Use your existing unsigned preset
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'profile_pictures'
  );

  // 👇 Optional: keep original file name
  if (fileName) {
    formData.append('public_id', fileName);
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await res.json();
  return data.secure_url as string; // ✅ Return the public URL
};
