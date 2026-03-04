"use client";

import { createProduct, updateProduct } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { productSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, Pencil, Loader2 } from "lucide-react"; // <-- Added Loader2
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton

type FormType = z.infer<typeof productSchema>;

// Define types for your Master options
interface MasterItem {
  _id: string;
  name: string;
}

interface MasterOptions {
  categories: MasterItem[];
  styles: MasterItem[];
  types: MasterItem[];
}

interface Props {
  product?: any;
  masterOptions: MasterOptions; // Add this new prop
}

export default function ProductForm({ product, masterOptions }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(!product);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!product;

  // Helper to safely extract ID whether the product field is a string ID or populated object
  const getSafeId = (fieldValue: any) => fieldValue?._id || fieldValue || "";

  const form = useForm<FormType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      code: product?.code?.replace("VJ-", "") || "",
      description: product?.description || "",
      // Use the safe ID helper to set the initial selected values
      category: getSafeId(product?.category),
      style: getSafeId(product?.style),
      type: getSafeId(product?.type),
    },
  });

  async function onSubmit(values: FormType) {
    try {
      setIsLoading(true);

      if (isEditMode) {
        const payload = {
          ...values,
          code: product?.code || `VJ-${values.code}`,
        };

        const result = await updateProduct(product._id, payload);

        if (!result?.success) {
          throw new Error(result?.message || "Failed to update product");
        }

        toast.success(`Product Updated - Code: ${result.data.code}`);

        router.push("/admin/products");
        return;
      }

      const payload = {
        ...values,
        code: `VJ-${values.code}`,
      };

      const result = await createProduct(payload);

      if (!result?.success) {
        throw new Error(result?.message || "Failed to create product");
      }

      toast.success(`Product Created - Code: ${result.data.code}`);

      form.reset();
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white p-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">
          {isEditMode ? "Product Details" : "Create Product"}
        </h2>

        {isEditMode && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setEditing((prev) => !prev)}
            className="text-black hover:bg-black/5"
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
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Name (max 80 chars)
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={!editing}
                    maxLength={80}
                    placeholder="Elegant Gold Necklace"
                    className="h-11 bg-white border-black/20 text-black placeholder:text-neutral-500 "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-black" />
              </FormItem>
            )}
          />

          {/* Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">Product Code</FormLabel>

                <FormControl>
                  <div className="flex items-center border border-black/20 rounded-md h-11 overflow-hidden">
                    {/* PREFIX */}
                    <div className="px-3 text-black/80 text-sm font-medium border-r">
                      VJ-
                    </div>

                    {/* INPUT */}
                    <Input
                      disabled={!editing || isEditMode}
                      value={field.value?.replace("VJ-", "") || ""}
                      onChange={(e) => {
                        // allow numbers only
                        const numeric = e.target.value.replace(/\D/g, "");
                        field.onChange(numeric);
                      }}
                      placeholder="12345"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </FormControl>

                <FormMessage />

                {isEditMode && (
                  <p className="text-xs text-black/60">
                    Code cannot be changed after creation
                  </p>
                )}
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-black">
                  Description (max 500 chars)
                </FormLabel>
                <FormControl>
                  <Textarea
                    disabled={!editing}
                    maxLength={500}
                    rows={4}
                    placeholder="Product details..."
                    className="bg-white border-black/20 text-black placeholder:text-neutral-500"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-black" />
              </FormItem>
            )}
          />

          {/* Category / Style / Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {(["category", "style", "type"] as const).map((fieldName) => {
              // Get the corresponding list of options from the masterOptions prop
              // using a fallback to an empty array so it doesn't break
              const optionsKey =
                fieldName === "category" ? "categories" : `${fieldName}s`;
              const options =
                masterOptions[optionsKey as keyof MasterOptions] || [];

              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem className="w-full space-y-2 min-h-[88px]">
                      <FormLabel className="text-black capitalize">
                        {fieldName}
                      </FormLabel>
                      <Select
                        disabled={!editing}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-11 bg-white border-black/20 text-black focus:ring-black">
                            <SelectValue placeholder={`Select ${fieldName}`} />
                          </SelectTrigger>
                        </FormControl>

                        <SelectContent>
                          {options.length === 0 && (
                            <SelectItem value="none" disabled>
                              No options available
                            </SelectItem>
                          )}
                          {options.map((opt) => (
                            <SelectItem key={opt._id} value={opt._id}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-black" />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          {/* Save Button */}
          {editing && (
            <div className="flex justify-end pt-4">
              <Button
                className="bg-black text-white hover:bg-[#E3BB76] hover:text-black min-w-[160px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Product"
                ) : (
                  "Create Product"
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
export function ProductFormSkeleton() {
  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white p-2">
      {/* HEADER SKELETON */}
      <div className="flex items-center justify-between mb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-9" /> {/* Icon button */}
      </div>

      <div className="space-y-6">
        {/* NAME */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* CODE */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full" />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-[104px] w-full" /> {/* Textarea height */}
        </div>

        {/* CATEGORY / STYLE / TYPE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-11 w-full" />
            </div>
          ))}
        </div>

        {/* BUTTON */}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-[160px] rounded-md" />
        </div>
      </div>
    </div>
  );
}
