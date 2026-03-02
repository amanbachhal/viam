import { z } from "zod";

export const siteConfigSchema = z.object({
  template: z.string(),

  header_bg: z.string().min(1),
  footer_bg: z.string().min(1),

  cta_bg: z.string().min(1),
  cta_font_color: z.string().min(1),
  menu_option_font_color: z.string().min(1),

  footer_font_color: z.string().min(1),

  hero_bg: z.string().min(1),
  hero_font_color: z.string().min(1),

  hero_title: z.string().min(3).max(120),
  hero_subtitle: z.string().min(3).max(300),

  show_banner: z.coerce.boolean().default(false),
  banner_bg: z.string().min(1),
  banner_font_color: z.string().min(1),
  banner_text: z.string().max(200),

  selected_logo: z.string().optional(),
});

export type SiteConfigFormValues = z.infer<typeof siteConfigSchema>;
