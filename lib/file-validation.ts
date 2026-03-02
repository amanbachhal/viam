export function validateWebp(file: File) {
  if (!file.type.includes("webp")) {
    throw new Error("Only WEBP images allowed");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Max file size 5MB");
  }
}
