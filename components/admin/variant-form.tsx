"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema } from "@/schemas/variant.schema";
import { z } from "zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LockIcon, Pencil, Trash2, Loader2 } from "lucide-react"; // <-- Added Loader2

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton

import {
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/actions/variant.actions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "../ui/combobox";
import FileUpload01 from "@/components/file-upload-01";

type FormType = z.infer<typeof variantSchema>;

interface Props {
  products?: { _id: string; name: string; code: string }[];
  variant?: any;
}

export default function VariantForm({ products = [], variant }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(!variant);
  const [files, setFiles] = useState<File[]>([]);
  const [replaceImages, setReplaceImages] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!variant;

  const form = useForm<FormType>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      product_id: variant?.product_id?._id || "",
      name: variant?.name || "",
      price: variant?.price || 0,
      in_stock: variant?.in_stock ?? true,
    },
  });

  // ================= SUBMIT =================
  function onSubmit(values: FormType) {
    startTransition(async () => {
      try {
        const formData = new FormData();

        formData.append("product_id", values.product_id);
        formData.append("name", values.name);
        formData.append("price", String(values.price));
        formData.append("in_stock", String(values.in_stock));

        // validate webp
        files.forEach((file) => {
          if (!file.type.includes("webp")) {
            throw new Error("Only WEBP images allowed");
          }
          formData.append("images", file);
        });

        if (isEditMode) {
          const res = await updateVariant(variant._id, formData, replaceImages);

          if (!res?.success) throw new Error(res?.message);

          toast.success(`Variant Updated — ${res.data.code}`);
          router.push("/admin/variants");
        } else {
          const res = await createVariant(formData);

          if (!res?.success) throw new Error(res?.message);

          toast.success(`Variant Created — ${res.data.code}`);
          form.reset();
          router.push("/admin/variants");
        }
      } catch (err: any) {
        toast.error(err?.message || "Failed to save variant");
      }
    });
  }

  // ================= DELETE =================
  function handleDelete() {
    if (!variant) return;

    startTransition(async () => {
      try {
        const res = await deleteVariant(variant._id);

        if (!res?.success) throw new Error(res?.message);

        toast.success("Variant deleted");
        router.push("/admin/variants");
      } catch (err: any) {
        toast.error(err?.message || "Delete failed");
      }
    });
  }

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white p-2">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">
          {isEditMode ? "Variant Details" : "Create Variant"}
        </h2>

        {isEditMode && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditing((prev) => !prev)}
          >
            {!editing ? <Pencil size={18} /> : <LockIcon size={18} />}
          </Button>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 py-10"
        >
          {/* ================= PRODUCT FIELD ================= */}
          {isEditMode ? (
            <div>
              <FormLabel className="text-black">Product</FormLabel>
              <Input
                disabled
                value={
                  variant?.product_id
                    ? `${variant.product_id.name} (${variant.product_id.code})`
                    : "—"
                }
                className="h-11 border-black/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Product cannot be changed after creation
              </p>
            </div>
          ) : (
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => {
                const labelToId = new Map(
                  products.map((p) => [`${p.name} (${p.code})`, p._id]),
                );

                const idToLabel = new Map(
                  products.map((p) => [p._id, `${p.name} (${p.code})`]),
                );

                const selectedLabel = idToLabel.get(field.value) ?? "";

                return (
                  <FormItem>
                    <FormLabel>Product</FormLabel>

                    <FormControl>
                      <Combobox
                        items={[...labelToId.keys()]}
                        value={selectedLabel}
                        onValueChange={(label) => {
                          if (!label) return; // ⭐ TS fix

                          const id = labelToId.get(label);
                          if (id) field.onChange(id);
                        }}
                      >
                        <ComboboxInput
                          placeholder="Search product..."
                          disabled={!editing}
                          showTrigger
                          showClear
                        />

                        <ComboboxContent>
                          <ComboboxEmpty>No product found.</ComboboxEmpty>

                          <ComboboxList>
                            {(item) => (
                              <ComboboxItem key={item} value={item}>
                                {item}
                              </ComboboxItem>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}

          {/* ================= VARIANT CODE ================= */}
          <div>
            <FormLabel className="text-black">Variant Code</FormLabel>
            <Input
              disabled
              value={variant?.code || "AUTO-GENERATED"}
              className="h-11 border-black/20"
            />
          </div>

          {/* ================= NAME ================= */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Variant Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={!editing}
                    placeholder="Gold Finish"
                    className="h-11 border-black/20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ================= PRICE ================= */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Price (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={!editing}
                    className="h-11 border-black/20"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ================= STOCK ================= */}
          <FormField
            control={form.control}
            name="in_stock"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="text-black">In Stock</FormLabel>
                <FormControl>
                  <Switch
                    disabled={!editing}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ================= REPLACE IMAGES ================= */}
          {isEditMode && editing && variant?.images?.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-sm">Replace Images</span>
              <Switch
                checked={replaceImages}
                onCheckedChange={setReplaceImages}
              />
              <span className="text-xs text-muted-foreground">
                Delete existing images and use new uploads
              </span>
            </div>
          )}

          {/* ================= EXISTING IMAGES ================= */}
          {variant?.images?.length > 0 && !replaceImages && (
            <div className="flex gap-3 flex-wrap">
              {variant.images.map((url: string) => (
                <img
                  key={url}
                  src={url}
                  className="w-24 h-24 object-cover rounded-md border"
                  alt="Variant Image"
                />
              ))}
            </div>
          )}

          {/* ================= FILE UPLOAD ================= */}
          {editing && (
            <div>
              <FormLabel className="text-black mb-2 block">
                Upload Images (WEBP only)
              </FormLabel>

              <FileUpload01
                multiple
                accept="image/webp"
                value={files}
                onValueChange={setFiles}
              />
            </div>
          )}

          {/* ================= ACTIONS ================= */}
          {editing && (
            <div className="flex justify-end gap-3">
              <Button
                disabled={isPending}
                className="bg-black text-white hover:bg-[#E3BB76] hover:text-black min-w-[160px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Variant"
                ) : (
                  "Create Variant"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

// ==========================================
// EXPORTED SKELETON FOR THIS SPECIFIC FORM
// ==========================================
export function VariantFormSkeleton() {
  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white p-2">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between mb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-9" /> {/* Icon button */}
      </div>

      <div className="space-y-6">
        {/* PRODUCT */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* VARIANT CODE */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* NAME */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* PRICE */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* IN STOCK SWITCH */}
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>

        {/* IMAGES AREA */}
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-[200px] w-full rounded-xl border-dashed" />
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-[160px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
