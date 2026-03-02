"use server";

import { cookies } from "next/headers";

export async function logoutAdmin() {
  (await cookies()).set("admin-auth", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return { success: true };
}

export async function loginAdmin(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    (await cookies()).set("admin-auth", "authenticated", {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  }

  return { success: false, error: "Unauthorized" };
}
