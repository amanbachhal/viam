import { put, del } from "@vercel/blob";

export async function uploadImage(file: File) {
  const blob = await put(`variants/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return blob.url;
}

export async function deleteImage(url: string) {
  try {
    await del(url);
  } catch (err) {
    console.error("Image delete failed", err);
  }
}
