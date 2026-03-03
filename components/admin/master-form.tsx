"use client";

import { saveAllMasters } from "@/actions/master.actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { masterFormSchema } from "@/schemas/master.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "../ui/input";

type MasterFormValues = z.infer<typeof masterFormSchema>;

// ===== SUB-COMPONENT FOR SECTIONS =====
const MasterSection = ({
  form,
  name,
  title,
  description,
}: {
  form: UseFormReturn<MasterFormValues>; // Strongly typed instead of 'any'
  name: "categories" | "styles" | "types";
  title: string;
  description: string;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });

  return (
    <div className="space-y-4 rounded-xl border p-6 bg-neutral-50/50">
      <div>
        <h3 className="text-lg font-medium text-black">{title}</h3>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>

      <div className="space-y-3">
        {/* Header Row */}
        {fields.length > 0 && (
          <div className=" hidden sm:grid sm:grid-cols-[1fr_80px_60px_40px] gap-4 px-2 text-sm font-medium text-neutral-500">
            <div>Name</div>
            <div className="text-center">Order</div>
            <div className="text-center">Active</div>
          </div>
        )}

        {/* List Items */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className=" grid gap-3 bg-white p-3 rounded-lg border shadow-sm grid-cols-1 sm:grid-cols-[1fr_80px_60px_40px] items-center"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name={`${name}.${index}.name`}
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <Input
                      className="h-9 border-0 focus-visible:ring-1 bg-transparent"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-[1fr_auto] gap-3 items-center sm:contents">
              {/* ORDER */}
              <FormField
                control={form.control}
                name={`${name}.${index}.order`}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <Input
                        type="number"
                        className="h-9 border-0 focus-visible:ring-1 text-center bg-transparent w-full sm:w-[80px]"
                        // Extract standard props and override onChange to ensure it passes a Number
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* IS ACTIVE */}
              <FormField
                control={form.control}
                name={`${name}.${index}.isActive`}
                render={({ field }) => (
                  <FormItem className="space-y-0 flex justify-center">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {/* Add New Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full border-dashed mt-2"
          onClick={() =>
            append({
              name: "",
              order: fields.length + 1,
              isActive: true,
            })
          }
        >
          <Plus size={16} className="mr-2" />
          Add {title.slice(0, -1)}
        </Button>
      </div>
    </div>
  );
};

// ===== MAIN FORM COMPONENT =====
interface Props {
  initialData?: any;
}

export default function MasterForm({ initialData }: Props) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<MasterFormValues>({
    resolver: zodResolver(masterFormSchema) as any, // Cast to any to bypass Zod input/output mismatch
    defaultValues: {
      categories: initialData?.categories || [],
      styles: initialData?.styles || [],
      types: initialData?.types || [],
    },
  });

  function onSubmit(values: MasterFormValues) {
    startTransition(async () => {
      try {
        const res = await saveAllMasters(values);
        if (!res?.success) throw new Error(res.message);

        toast.success("Master options updated successfully");
      } catch (err: any) {
        toast.error(err.message || "An error occurred while saving");
      }
    });
  }

  return (
    <div className="flex-1 overflow-y-auto mt-6 pr-2 custom-scrollbar">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 relative"
        >
          <MasterSection
            form={form}
            name="categories"
            title="Categories"
            description="Manage product categories."
          />

          <MasterSection
            form={form}
            name="styles"
            title="Styles"
            description="Manage design styles."
          />

          <MasterSection
            form={form}
            name="types"
            title="Types"
            description="Manage product types."
          />

          {/* Sticky Save Button */}
          <div className="flex justify-end pt-6 border-t sticky bottom-0 bg-white/95 backdrop-blur-sm py-4 z-10">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-black text-white hover:bg-[#E3BB76] hover:text-black min-w-[160px]"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
