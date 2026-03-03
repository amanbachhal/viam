"use client";

import { saveSiteConfig } from "@/actions/site-config.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_LOGOS } from "@/lib/default-logos";
import { THEME_TEMPLATES, type ThemeTemplateKey } from "@/lib/theme-templates";
import { siteConfigSchema } from "@/schemas/site-config.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { SiteConfigFormValues } from "@/schemas/site-config.schema";
import { Switch } from "../ui/switch";
import { AmbientMode } from "../ambient-background";

interface Props {
  config?: any;
}

const DEFAULT_HERO_IMAGES = ["/hero1.webp", "/hero2.webp", "/hero3.webp"];

const ANIMATION_OPTIONS: AmbientMode[] = [
  "off",
  "sparkle",
  "snow",
  "holi",
  "diwali",
  "valentine",
  "republic",
];

type ColorFieldKeys =
  | "header_bg"
  | "footer_bg"
  | "cta_bg"
  | "cta_font_color"
  | "menu_option_font_color"
  | "footer_font_color"
  | "hero_bg"
  | "hero_font_color"
  | "banner_bg"
  | "banner_font_color";

const colorFields: { name: ColorFieldKeys; label: string }[] = [
  { name: "header_bg", label: "Header" },
  { name: "footer_bg", label: "Footer" },
  { name: "cta_bg", label: "CTA Background" },
  { name: "cta_font_color", label: "CTA Text" },
  // { name: "menu_option_font_color", label: "Menu Option Text" },
  { name: "footer_font_color", label: "Footer Text" },
  { name: "hero_bg", label: "Hero Background" },
  { name: "hero_font_color", label: "Hero Text" },
  { name: "banner_bg", label: "Banner Background" },
  { name: "banner_font_color", label: "Banner Text" },
];

export default function SiteConfigForm({ config }: Props) {
  const [isPending, startTransition] = useTransition();

  // ===== LOGO STATE =====
  const [newLogos, setNewLogos] = useState<
    { file: File; name: string; preview: string }[]
  >([]);
  const [deleteLogoUrls, setDeleteLogoUrls] = useState<string[]>([]);

  // ===== HERO IMAGE STATE =====
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);

  const [deleteFlags, setDeleteFlags] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // ===== INITIAL TEMPLATE =====
  const initialTemplate: ThemeTemplateKey =
    (config?.template as ThemeTemplateKey) || "default";

  // ===== FORM =====
  const form = useForm<SiteConfigFormValues>({
    resolver: zodResolver(siteConfigSchema) as any,
    defaultValues: {
      template: initialTemplate,
      ...THEME_TEMPLATES[initialTemplate],
      show_banner: false,
      ...(config || {}),
    },
  });

  // ===== RESET FIELD =====
  function resetToTemplate(name: keyof SiteConfigFormValues) {
    const template = form.getValues("template") as ThemeTemplateKey;
    const templateValue = (THEME_TEMPLATES[template] as any)[name];

    // Safely fallback to an empty string if the template doesn't explicitly define the property
    form.setValue(name, templateValue !== undefined ? templateValue : "");
  }

  // ===== HERO IMAGE REPLACE =====
  function handleReplace(index: number, file: File) {
    if (!file.type.includes("webp")) {
      toast.error("Only WEBP images allowed");
      return;
    }

    const updated = [...imageFiles];
    updated[index] = file;
    setImageFiles(updated);

    const del = [...deleteFlags];
    del[index] = false;
    setDeleteFlags(del);
  }

  // ===== HERO IMAGE DELETE =====
  function handleDelete(index: number) {
    const updated = [...deleteFlags];
    updated[index] = true;
    setDeleteFlags(updated);

    const files = [...imageFiles];
    files[index] = null;
    setImageFiles(files);
  }

  // ===== ADD NEW LOGO =====
  function handleAddLogo(file: File, name: string) {
    if (!file.type.includes("webp")) {
      toast.error("Only WEBP logos allowed");
      return;
    }

    if (!name.trim()) {
      toast.error("Logo name required");
      return;
    }

    const preview = URL.createObjectURL(file);
    const newLogo = { file, name, preview };

    setNewLogos((prev) => [...prev, newLogo]);

    // ⭐ auto select newly uploaded logo
    form.setValue("selected_logo", preview);
  }

  function removeNewLogo(index: number) {
    setNewLogos((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  }

  function markLogoForDelete(url: string) {
    setDeleteLogoUrls((prev) => [...prev, url]);
  }

  // ===== SUBMIT =====
  function onSubmit(values: SiteConfigFormValues) {
    startTransition(async () => {
      try {
        const formData = new FormData();

        Object.entries(values).forEach(([k, v]) => {
          if (v !== undefined && v !== null) {
            formData.append(k, v as string);
          }
        });

        imageFiles.forEach((file, i) => {
          if (file) formData.append(`image_${i}`, file);
        });

        deleteFlags.forEach((flag, i) => {
          if (flag) formData.append(`delete_${i}`, "true");
        });

        newLogos.forEach((logo, i) => {
          formData.append(`logo_file_${i}`, logo.file);
          formData.append(`logo_name_${i}`, logo.name);
        });

        deleteLogoUrls.forEach((url) => {
          formData.append("delete_logo", url);
        });

        const res = await saveSiteConfig(formData);
        if (!res?.success) throw new Error("Save failed");

        toast.success("Site config updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "An error occurred");
      }
    });
  }

  const headerBg = form.watch("header_bg");

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white py-10">
      <Form<SiteConfigFormValues> {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          <div className="flex flex-col sm:flex-row gap-6 w-full">
            {/* TEMPLATE */}
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme Template</FormLabel>

                  <Select
                    onValueChange={(value) => {
                      const templateKey = value as ThemeTemplateKey;
                      field.onChange(templateKey);

                      form.reset({
                        template: templateKey,
                        ...THEME_TEMPLATES[templateKey],
                      });
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="max-w-sm">
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.keys(THEME_TEMPLATES).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.replace("_", " ").toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* ANIMATION (FIXED) */}
            <FormField
              control={form.control}
              name="animation"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Background Animation</FormLabel>

                  <Select
                    onValueChange={field.onChange} // Standard onChange, no form resets!
                    value={field.value || "off"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select animation" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {ANIMATION_OPTIONS.map((key) => (
                        <SelectItem key={key} value={key}>
                          {key.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* LOGO SELECTOR */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Brand Logo</h3>

            <FormField
              control={form.control}
              name="selected_logo"
              render={({ field }) => {
                const dbLogos = config?.logos || [];

                const remainingDbLogos = dbLogos.filter(
                  (l: any) => !deleteLogoUrls.includes(l.url),
                );

                const allLogos = [...DEFAULT_LOGOS, ...remainingDbLogos];

                return (
                  <FormItem>
                    <FormLabel>Select Logo</FormLabel>

                    <div className="flex flex-wrap gap-4">
                      {allLogos.map((logo: any) => {
                        const isSelected = field.value === logo.url;
                        const isCustom = !DEFAULT_LOGOS.find(
                          (d) => d.url === logo.url,
                        );

                        return (
                          <div
                            key={logo.url}
                            className="flex flex-col items-center gap-2 w-[140px]"
                          >
                            {/* ===== LOGO BOX ===== */}
                            <div
                              className={`flex items-center justify-center border rounded-xl p-4 cursor-pointer transition w-full ${
                                isSelected
                                  ? "border-green-600 ring-2 ring-green-500"
                                  : ""
                              }`}
                              style={{ background: headerBg || "#0c0c0c" }}
                              onClick={() => field.onChange(logo.url)}
                            >
                              <Image
                                src={logo.url}
                                alt={logo.name}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                                unoptimized
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="text-green-600 font-bold text-sm">
                                  ✓
                                </div>
                              )}
                              <p className="text-xs">{logo.name}</p>

                              {isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markLogoForDelete(logo.url);
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* {newLogos.map((logo, i) => {
                        const isSelected =
                          form.watch("selected_logo") === logo.preview;

                        return (
                          <div
                            key={`new-${i}`}
                            className="flex flex-col items-center gap-2 w-[140px]"
                          >
                            <div
                              className={`flex items-center justify-center border rounded-xl p-4 cursor-pointer transition w-full ${
                                isSelected
                                  ? "border-green-600 ring-2 ring-green-500"
                                  : ""
                              }`}
                              style={{ background: headerBg || "#0c0c0c" }}
                              onClick={() =>
                                form.setValue("selected_logo", logo.preview)
                              }
                            >
                              <Image
                                src={logo.preview}
                                alt={logo.name}
                                width={120}
                                height={40}
                                className="h-10 w-auto object-contain"
                                unoptimized
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              {isSelected && (
                                <div className="text-green-600 font-bold text-sm">
                                  ✓
                                </div>
                              )}
                              <p className="text-xs">{logo.name}</p>

                              <button
                                type="button"
                                onClick={() => removeNewLogo(i)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })} */}
                    </div>
                  </FormItem>
                );
              }}
            />

            {/* <div className="flex gap-3 items-end">
              <Input
                placeholder="Logo name"
                id="logo-name"
                className="max-w-xs"
              />

              <input
                id="logo-file"
                type="file"
                hidden
                accept="image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const nameInput = document.getElementById(
                    "logo-name",
                  ) as HTMLInputElement;

                  if (!file) return;

                  if (!nameInput?.value) {
                    toast.error("Enter logo name first");
                    return;
                  }

                  handleAddLogo(file, nameInput.value);

                  nameInput.value = "";
                  e.target.value = "";
                }}
              />

              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("logo-file")?.click()}
              >
                <Upload size={16} className="mr-2" />
                Add Logo
              </Button>
            </div> */}
          </div>

          {/* COLORS */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {colorFields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: f }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>

                      <div className="flex items-center gap-2 border rounded-xl p-2">
                        <FormControl>
                          <Input type="color" {...f} className="w-12 h-10" />
                        </FormControl>

                        <span className="text-xs text-muted-foreground">
                          {f.value}
                        </span>

                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="ml-auto"
                          onClick={() => resetToTemplate(field.name)}
                        >
                          <RotateCcw size={14} />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* BANNER SETTINGS */}
          <div className="space-y-4 ">
            <h3 className="text-lg font-medium">Banner</h3>
            <FormField
              control={form.control}
              name="show_banner"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4 gap-4 w-fit">
                  <div className="space-y-0.5">
                    <FormLabel>Show Banner</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Enable banner at top of website
                    </p>
                  </div>

                  <FormControl>
                    <Switch
                      className="ml-4"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="banner_text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Text</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => resetToTemplate("banner_text")}
                    >
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* HERO TEXT */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hero Text</h3>

            <FormField
              control={form.control}
              name="hero_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Title</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => resetToTemplate("hero_title")}
                    >
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hero_subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Subtitle</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => resetToTemplate("hero_subtitle")}
                    >
                      <RotateCcw size={14} />
                    </Button>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* HERO IMAGES */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hero Images</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-3xl">
              {[0, 1, 2].map((index) => {
                const dbImage = config?.hero_images?.[index];
                const previewFile = imageFiles[index];
                const markedDelete = deleteFlags[index];

                const src = markedDelete
                  ? DEFAULT_HERO_IMAGES[index]
                  : previewFile
                    ? URL.createObjectURL(previewFile)
                    : dbImage || DEFAULT_HERO_IMAGES[index];

                const isCustom = !!dbImage && !markedDelete;

                return (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-[4/5]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Hero preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      <input
                        id={`file-${index}`}
                        type="file"
                        hidden
                        accept="image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleReplace(index, file);
                        }}
                      />

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                          document.getElementById(`file-${index}`)?.click()
                        }
                      >
                        <Upload size={16} className="mr-2" />
                        Replace Image
                      </Button>

                      {isCustom && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Image
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SAVE */}
          <div className="flex justify-end pt-6 border-t">
            <Button disabled={isPending} className="min-w-[160px]">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
