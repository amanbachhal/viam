"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockIcon, Pencil, Loader2 } from "lucide-react"; // <-- Added Loader2
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

import { createDiscount, updateDiscount } from "@/actions/discount.actions";
import { discountSchema } from "@/schemas/discount.schema";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton

type FormType = z.infer<typeof discountSchema>;

interface Props {
  discount?: any;
  categories?: any[];
  styles?: any[];
  types?: any[];
  products?: any[];
  variants?: any[];
}

export default function DiscountForm({
  discount,
  categories = [],
  styles = [],
  types = [],
  products = [],
  variants = [],
}: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(!discount);
  const [isPending, startTransition] = useTransition();

  const isEditMode = !!discount;

  const form = useForm<FormType>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      name: discount?.name || "",
      value: discount?.value || 0,
      startAt: discount?.startAt
        ? new Date(discount.startAt).toISOString().slice(0, 16)
        : "",
      endAt: discount?.endAt
        ? new Date(discount.endAt).toISOString().slice(0, 16)
        : "",
      type: discount?.type || "all",
      categories: discount?.categories || [],
      styles: discount?.styles || [],
      types: discount?.types || [],
      products: discount?.products || [],
      variants: discount?.variants || [],
      isActive: discount?.isActive ?? true,
    },
  });

  const watchType = form.watch("type");

  // ================= SUBMIT =================
  function onSubmit(values: FormType) {
    startTransition(async () => {
      try {
        if (isEditMode) {
          const res = await updateDiscount(discount._id, values);
          if (!res?.success) throw new Error(res.message);
          toast.success("Discount updated");
        } else {
          const res = await createDiscount(values);
          if (!res?.success) throw new Error(res.message);
          toast.success("Discount created");
        }

        router.push("/admin/discount");
      } catch (err: any) {
        toast.error(err.message || "Failed");
      }
    });
  }

  return (
    <div className="h-[calc(100vh-140px)] overflow-y-auto bg-white p-2">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">
          {isEditMode ? "Discount Details" : "Create Discount"}
        </h2>

        {isEditMode && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditing((prev) => !prev)}
            >
              {!editing ? <Pencil size={18} /> : <LockIcon size={18} />}
            </Button>
          </div>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 py-10"
        >
          {/* NAME */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount Name</FormLabel>
                <FormControl>
                  <Input disabled={!editing} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* VALUE */}
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount %</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    disabled={!editing}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DATE RANGE */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={!editing}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      disabled={!editing}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* TYPE */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apply To</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={!editing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="style">Style</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="variant">Variant</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* DYNAMIC SELECTORS */}
          {watchType === "category" && (
            <MultiSelect
              label="Categories"
              items={categories}
              name="categories"
              form={form}
              disabled={!editing}
            />
          )}

          {watchType === "style" && (
            <MultiSelect
              label="Styles"
              items={styles}
              name="styles"
              form={form}
              disabled={!editing}
            />
          )}

          {watchType === "type" && (
            <MultiSelect
              label="Types"
              items={types}
              name="types"
              form={form}
              disabled={!editing}
            />
          )}

          {watchType === "product" && (
            <MultiSelect
              label="Products"
              items={products}
              name="products"
              form={form}
              disabled={!editing}
            />
          )}

          {watchType === "variant" && (
            <MultiSelect
              label="Variants"
              items={variants}
              name="variants"
              form={form}
              disabled={!editing}
            />
          )}

          {/* ACTIVE */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel>Active</FormLabel>
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

          {editing && (
            <div className="flex justify-end">
              <Button disabled={isPending} className="w-[120px]">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

function MultiSelect({
  label,
  items,
  name,
  form,
  disabled,
}: {
  label: string;
  items: any[];
  name: keyof FormType;
  form: any;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const buildLabel = (item: any) =>
          item.code ? `${item.name} - ${item.code}` : item.name;

        const labelToId = new Map(
          items.map((i: any) => [buildLabel(i), i._id]),
        );

        const idToLabel = new Map(
          items.map((i: any) => [i._id, buildLabel(i)]),
        );

        const selectedLabels = field.value
          .map((id: string) => idToLabel.get(id))
          .filter(Boolean);

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <div className="space-y-2">
                <Combobox
                  items={[...labelToId.keys()]}
                  value=""
                  onValueChange={(label) => {
                    if (!label) return;

                    const id = labelToId.get(label);
                    if (!id) return;

                    if (!field.value.includes(id)) {
                      field.onChange([...field.value, id]);
                    }
                  }}
                >
                  <ComboboxInput
                    placeholder={`Search ${label}...`}
                    disabled={disabled}
                    showTrigger
                    showClear
                  />

                  <ComboboxContent>
                    <ComboboxEmpty>No results found.</ComboboxEmpty>

                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                {selectedLabels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedLabels.map((labelText: string) => {
                      const id = labelToId.get(labelText);

                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-full text-xs"
                        >
                          {labelText}
                          {!disabled && (
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((v: string) => v !== id),
                                )
                              }
                              className="ml-1 text-white/70 hover:text-white"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

// ==========================================
// EXPORTED SKELETON FOR THIS SPECIFIC FORM
// ==========================================
export function DiscountFormSkeleton() {
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
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* VALUE */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* DATE RANGE */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* APPLY TO */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* ACTIVE SWITCH */}
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-6 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}
