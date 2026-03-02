"use server";

import { connectDB } from "@/lib/mongodb";
import SiteConfig from "@/models/site-config.model";
import { uploadImage, deleteImage } from "@/lib/blob";
import { serialize } from "@/lib/serialize";
import { revalidateTag } from "next/cache";

export async function saveSiteConfig(formData: FormData) {
  try {
    await connectDB();

    // ================= BASIC FIELDS =================
    const template = formData.get("template")?.toString(); // ADDED THIS

    const header_bg = formData.get("header_bg")?.toString();
    const footer_bg = formData.get("footer_bg")?.toString();

    const cta_bg = formData.get("cta_bg")?.toString();
    const cta_font_color = formData.get("cta_font_color")?.toString();

    const menu_option_font_color = formData
      .get("menu_option_font_color")
      ?.toString();

    const footer_font_color = formData.get("footer_font_color")?.toString();

    const hero_bg = formData.get("hero_bg")?.toString();
    const hero_font_color = formData.get("hero_font_color")?.toString();

    const hero_title = formData.get("hero_title")?.toString() || "";
    const hero_subtitle = formData.get("hero_subtitle")?.toString() || "";

    const show_banner = formData.get("show_banner") === "true";
    const banner_bg = formData.get("banner_bg")?.toString();
    const banner_font_color = formData.get("banner_font_color")?.toString();
    const banner_text = formData.get("banner_text")?.toString() || "";

    const selected_logo = formData.get("selected_logo")?.toString();

    // FIXED VALIDATION: Only check strictly required colors/fields.
    // Text fields like banner_text are allowed to be empty ("").
    if (
      !template ||
      !header_bg ||
      !footer_bg ||
      !cta_bg ||
      !cta_font_color ||
      !menu_option_font_color ||
      !footer_font_color ||
      !hero_bg ||
      !hero_font_color ||
      !banner_bg ||
      !banner_font_color
    ) {
      throw new Error("Missing required color or layout fields");
    }

    let config = await SiteConfig.findOne();

    // ============================================================
    // ================= HERO IMAGES (3 FIXED SLOTS) ===============
    // ============================================================

    let imageUrls: (string | null)[] = [
      config?.hero_images?.[0] || null,
      config?.hero_images?.[1] || null,
      config?.hero_images?.[2] || null,
    ];

    for (let i = 0; i < 3; i++) {
      const file = formData.get(`image_${i}`) as File | null;
      const deleteFlag = formData.get(`delete_${i}`);

      // DELETE HERO IMAGE
      if (deleteFlag === "true" && imageUrls[i]) {
        await deleteImage(imageUrls[i]!);
        imageUrls[i] = null;
      }

      // REPLACE HERO IMAGE
      if (file && file.size > 0) {
        if (!file.type.includes("webp")) {
          throw new Error("Only WEBP images allowed");
        }

        if (imageUrls[i]) {
          await deleteImage(imageUrls[i]!);
        }

        const uploaded = await uploadImage(file);
        imageUrls[i] = uploaded;
      }
    }

    // ============================================================
    // ================= LOGOS (UNLIMITED) ========================
    // ============================================================

    let existingLogos = config?.logos || [];

    // ----- DELETE EXISTING LOGOS -----
    const deleteLogoUrls = formData.getAll("delete_logo");

    for (const url of deleteLogoUrls) {
      const logoUrl = url.toString();
      await deleteImage(logoUrl);
      existingLogos = existingLogos.filter((logo: any) => logo.url !== logoUrl);
    }

    // ----- ADD NEW LOGOS -----
    const newLogos: { name: string; url: string }[] = [];
    let index = 0;

    while (formData.get(`logo_file_${index}`)) {
      const file = formData.get(`logo_file_${index}`) as File;
      const name = formData.get(`logo_name_${index}`)?.toString();

      if (file && file.size > 0 && name) {
        if (!file.type.includes("webp")) {
          throw new Error("Only WEBP logos allowed");
        }

        const uploadedUrl = await uploadImage(file);

        newLogos.push({
          name,
          url: uploadedUrl,
        });
      }

      index++;
    }

    existingLogos = [...existingLogos, ...newLogos];

    // ============================================================
    // ================= SAVE CONFIG ===============================
    // ============================================================

    const updated = await SiteConfig.findOneAndUpdate(
      {},
      {
        template, // ADDED THIS
        header_bg,
        footer_bg,
        cta_bg,
        cta_font_color,
        menu_option_font_color,
        footer_font_color,
        hero_bg,
        hero_font_color,
        hero_title,
        hero_subtitle,
        show_banner,
        banner_bg,
        banner_font_color,
        banner_text,
        hero_images: imageUrls,
        selected_logo,
        logos: existingLogos,
      },
      { new: true, upsert: true },
    ).lean();

    // FIXED: revalidateTag only accepts one argument.
    revalidateTag("site-config", "max");

    return {
      success: true,
      data: serialize(updated),
    };
  } catch (err: any) {
    throw new Error(err?.message || "Failed to save config");
  }
}

// ================= GET =================

export async function getSiteConfig() {
  await connectDB();
  const config = await SiteConfig.findOne().lean();

  return {
    success: true,
    data: serialize(config),
  };
}
