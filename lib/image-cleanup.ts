import { deleteImage } from "./blob";

export async function deleteImages(urls: string[]) {
  await Promise.all(urls.map(deleteImage));
}
