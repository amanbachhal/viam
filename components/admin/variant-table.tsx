"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteVariant } from "@/actions/variant.actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  X,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  EyeIcon,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  data: {
    variants: any[];
    total: number;
    pages: number;
    page: number;
  };
  products: { _id: string; name: string; code: string }[];
}

export default function VariantTable({ data, products }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentProduct = searchParams.get("product") || "All";
  const currentCategory = searchParams.get("category") || "All";
  const currentStyle = searchParams.get("style") || "All";
  const currentType = searchParams.get("type") || "All";
  const currentStock = searchParams.get("in_stock") || "All";
  const currentPage = Number(searchParams.get("page") || 1);

  const [search, setSearch] = useState(currentSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => setSearch(currentSearch), [currentSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      updateQuery({ search: debouncedSearch || null });
    }
  }, [debouncedSearch]);

  const updateQuery = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "All") params.delete(key);
      else params.set(key, value);
    });

    if (!("page" in updates)) {
      params.set("page", "1");
    }

    router.push(`/admin/variants?${params.toString()}`);
  };

  const resetAll = () => {
    setSearch("");
    router.push("/admin/variants");
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteVariant(deleteId);
      if (!res?.success) throw new Error(res?.message);

      toast.success("Variant deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const totalPages = data.pages || 1;

  const renderPaginationNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          size="sm"
          variant={i === currentPage ? "default" : "outline"}
          className="w-9 h-9 p-0"
          onClick={() => updateQuery({ page: String(i) })}
        >
          {i}
        </Button>,
      );
    }
    return pages;
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      {/* ===== HEADER ===== */}
      <h2 className="text-2xl font-semibold text-black mb-6">
        Variants Listing
      </h2>

      {/* ===== FILTER BAR ===== */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              placeholder="Search name, code, price..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 w-[260px]"
            />
            {search && (
              <X
                size={16}
                className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                onClick={() => updateQuery({ search: null })}
              />
            )}
          </div>

          {/* Product Combobox Filter */}
          <div className="w-[260px]">
            {(() => {
              const labelToId = new Map(
                products.map((p) => [`${p.name} (${p.code})`, p._id]),
              );

              const idToLabel = new Map(
                products.map((p) => [p._id, `${p.name} (${p.code})`]),
              );

              // What should display in input
              const selectedLabel =
                currentProduct && currentProduct !== "All"
                  ? (idToLabel.get(currentProduct) ?? "")
                  : "";

              return (
                <Combobox
                  items={["All Products", ...labelToId.keys()]}
                  value={selectedLabel || "All Products"}
                  onValueChange={(label) => {
                    if (!label || label === "All Products") {
                      updateQuery({ product: null });
                      return;
                    }

                    const id = labelToId.get(label);
                    if (id) updateQuery({ product: id });
                  }}
                >
                  <ComboboxInput
                    placeholder="Filter by product..."
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
              );
            })()}
          </div>

          {/* Category */}
          <Select
            value={currentCategory}
            onValueChange={(v) => updateQuery({ category: v })}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Earrings">Earrings</SelectItem>
              <SelectItem value="Necklace">Necklace</SelectItem>
              <SelectItem value="Bracelet">Bracelet</SelectItem>
              <SelectItem value="Ring">Ring</SelectItem>
            </SelectContent>
          </Select>

          {/* Style */}
          <Select
            value={currentStyle}
            onValueChange={(v) => updateQuery({ style: v })}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Styles</SelectItem>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Traditional">Traditional</SelectItem>
              <SelectItem value="Party">Party</SelectItem>
              <SelectItem value="Minimal">Minimal</SelectItem>
            </SelectContent>
          </Select>

          {/* Type */}
          <Select
            value={currentType}
            onValueChange={(v) => updateQuery({ type: v })}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Everyday">Everyday</SelectItem>
              <SelectItem value="Anti Tarnish">Anti Tarnish</SelectItem>
            </SelectContent>
          </Select>

          {/* Stock */}
          <Select
            value={currentStock}
            onValueChange={(v) => updateQuery({ in_stock: v })}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Stock</SelectItem>
              <SelectItem value="true">In Stock</SelectItem>
              <SelectItem value="false">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={resetAll}>
            <RotateCcw size={14} />
          </Button>
        </div>

        <Button asChild className="hover:bg-[#E3BB76] hover:text-black">
          <Link href="/admin/variants/new">Add Variant</Link>
        </Button>
      </div>

      {/* ===== TABLE AREA ===== */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.variants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-16 text-muted-foreground"
                  >
                    No variants found
                  </TableCell>
                </TableRow>
              ) : (
                data.variants.map((v: any) => (
                  <TableRow key={v._id}>
                    <TableCell>{v.name}</TableCell>
                    <TableCell>{v.code}</TableCell>
                    <TableCell>
                      {v.product.name} ({v.product.code})
                    </TableCell>
                    <TableCell>{v.product.category}</TableCell>
                    <TableCell>₹ {v.price}</TableCell>
                    <TableCell>
                      {v.in_stock ? (
                        <span className="text-green-600 font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">Out</span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end">
                      <Link href={`/admin/variants/${v._id}`}>
                        <Button size="icon" variant="outline">
                          <EyeIcon size={14} />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteId(v._id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ===== PAGINATION ===== */}
      <div className="border-t pt-4 mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {data.total > 0 && (
            <>
              Showing{" "}
              <span className="font-medium text-black">
                {(currentPage - 1) * 20 + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-black">
                {Math.min(currentPage * 20, data.total)}
              </span>{" "}
              of <span className="font-medium text-black">{data.total}</span>{" "}
              variants
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => updateQuery({ page: String(currentPage - 1) })}
            >
              <ChevronLeft size={16} />
            </Button>

            {renderPaginationNumbers()}

            <Button
              size="icon"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => updateQuery({ page: String(currentPage + 1) })}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this variant?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
