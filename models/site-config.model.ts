import mongoose, { Schema, models } from "mongoose";

const SiteConfigSchema = new Schema(
  {
    template: { type: String, required: true, default: "default" },

    header_bg: { type: String, required: true },
    footer_bg: { type: String, required: true },

    cta_bg: { type: String, required: true },
    cta_font_color: { type: String, required: true },
    menu_option_font_color: { type: String, required: true },

    footer_font_color: { type: String, required: true },

    hero_bg: { type: String, required: true },
    hero_font_color: { type: String, required: true },

    hero_title: { type: String, required: true },
    hero_subtitle: { type: String, required: true },

    show_banner: { type: Boolean, default: false },
    banner_bg: { type: String, required: true },
    banner_font_color: { type: String, required: true },
    banner_text: { type: String, default: "" },

    hero_images: [{ type: String }],

    selected_logo: { type: String },

    logos: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

// Prevent re-compilation errors in dev
export default models.SiteConfig ||
  mongoose.model("SiteConfig", SiteConfigSchema);
