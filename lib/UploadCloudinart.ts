
// 👇 Optional: pull into constants for clarity
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;

export const uploadToCloudinary = async (file: Blob | File, fileName?: string) => {
  const formData = new FormData();
  formData.append('file', file);

  if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
    console.error('❌ Missing Cloudinary environment variables:', {
      CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_CLOUD_NAME,
    });
    throw new Error('Missing Cloudinary config. Please check your .env.local file.');
  }

  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  if (fileName) {
    formData.append('public_id', fileName);
  }

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';

    if (!response.ok) {
      if (contentType.includes('application/json')) {
        const errorData = await response.json();
        console.error('❌ Cloudinary JSON Error:', errorData);
        throw new Error(errorData.error?.message || 'Cloudinary upload failed');
      } else {
        const errorText = await response.text();
        console.error('❌ Cloudinary Text Error:', errorText);
        throw new Error('Cloudinary upload failed: ' + errorText);
      }
    }

    const data = await response.json();
    console.log('✅ Cloudinary upload successful:', data);
    return data.secure_url as string;
  } catch (err: any) {
    console.error('❌ Upload to Cloudinary failed:', err);
    throw new Error(err.message || 'Unknown error uploading to Cloudinary');
  }
};
