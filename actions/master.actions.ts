"use server";

import { connectDB } from "@/lib/mongodb";
import Master from "@/models/master.model";
import { serialize } from "@/lib/serialize";
import { revalidatePath } from "next/cache";

// =========================================================================
// 1. GET FILTER OPTIONS (Storefront & Product Form Dropdowns)
// Returns lists sorted by 'order' and filters out inactive items
// =========================================================================
export async function getFilterOptions() {
  try {
    await connectDB();
    const master = await Master.findOne().lean();

    const format = (items: any[]) =>
      (items || []).filter((i) => i.isActive).sort((a, b) => a.order - b.order);

    return {
      success: true,
      data: serialize({
        categories: format(master?.categories),
        styles: format(master?.styles),
        types: format(master?.types),
      }),
    };
  } catch (error) {
    return { success: false, data: { categories: [], styles: [], types: [] } };
  }
}

// =========================================================================
// 2. GET MASTER CONFIG (Admin Form Initialization)
// Returns raw data including inactive items so they can be edited
// =========================================================================
export async function getMasterConfig() {
  try {
    await connectDB();
    const master = await Master.findOne().lean();

    return {
      success: true,
      data: serialize(master || { categories: [], styles: [], types: [] }),
    };
  } catch (error) {
    return { success: false, data: null };
  }
}

// =========================================================================
// 3. SAVE ALL MASTERS (Admin Form Submission)
// Overwrites the entire document with the new arrays from the form
// =========================================================================
export async function saveAllMasters(data: any) {
  try {
    await connectDB();

    // Find existing or create new singleton document
    let master = await Master.findOne();
    if (!master) master = new Master();

    // Overwrite the arrays entirely with the new sorted/edited data
    master.categories = data.categories;
    master.styles = data.styles;
    master.types = data.types;

    await master.save();

    // Clear caches where these filters might be used
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, message: "Master options saved successfully" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to save master options",
    };
  }
}
