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
  Plus,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
  filterOptions: {
    categories: any[];
    styles: any[];
    types: any[];
  };
}

export default function VariantTable({ data, products, filterOptions }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentProduct = searchParams.get("product") || "All";
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
      if (value === null || value === undefined || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
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
      <h2 className="text-2xl font-semibold text-black mb-6">
        Variants Listing
      </h2>

      {/* ===== FILTER BAR ===== */}

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:block bg-white border rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-muted-foreground"
              />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 w-[200px]"
              />
              {search && (
                <X
                  size={16}
                  className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                  onClick={() => updateQuery({ search: null })}
                />
              )}
            </div>

            {/* Product Combobox */}
            <div className="w-[220px]">
              {(() => {
                const labelToId = new Map(
                  products.map((p) => [`${p.name} (${p.code})`, p._id]),
                );
                const idToLabel = new Map(
                  products.map((p) => [p._id, `${p.name} (${p.code})`]),
                );
                const selectedLabel =
                  currentProduct !== "All" ? idToLabel.get(currentProduct) : "";

                return (
                  <Combobox
                    items={["All Products", ...labelToId.keys()]}
                    value={selectedLabel || "All Products"}
                    onValueChange={(label: string | null) => {
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

            {/* Master Filters */}
            {[
              {
                key: "category",
                label: "Category",
                options: filterOptions?.categories,
              },
              { key: "style", label: "Style", options: filterOptions?.styles },
              { key: "type", label: "Type", options: filterOptions?.types },
            ].map((filter) => (
              <Select
                key={filter.key}
                value={searchParams.get(filter.key) || "All"}
                onValueChange={(v) => updateQuery({ [filter.key]: v })}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All {filter.label}s</SelectItem>
                  {filter.options?.map((opt: any) => (
                    <SelectItem key={opt._id} value={opt._id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {/* Stock */}
            <Select
              value={currentStock}
              onValueChange={(v) => updateQuery({ in_stock: v })}
            >
              <SelectTrigger className="w-[130px]">
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

          <Button
            asChild
            className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
          >
            <Link href="/admin/variants/new">
              <Plus size={16} className="mr-2" /> Add Variant
            </Link>
          </Button>
        </div>
      </div>

      {/* ---------- MOBILE (ACCORDION) ---------- */}
      <div className="md:hidden mb-6">
        <Accordion type="single" collapsible>
          <AccordionItem value="filters" className="border rounded-xl">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium">
              Search & Filters
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 pt-2 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-8 w-full"
                />
                {search && (
                  <X
                    size={16}
                    className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                    onClick={() => updateQuery({ search: null })}
                  />
                )}
              </div>

              {/* Product Combobox */}
              <div>
                {(() => {
                  const labelToId = new Map(
                    products.map((p) => [`${p.name} (${p.code})`, p._id]),
                  );
                  const idToLabel = new Map(
                    products.map((p) => [p._id, `${p.name} (${p.code})`]),
                  );
                  const selectedLabel =
                    currentProduct !== "All"
                      ? idToLabel.get(currentProduct)
                      : "";

                  return (
                    <Combobox
                      items={["All Products", ...labelToId.keys()]}
                      value={selectedLabel || "All Products"}
                      onValueChange={(label: string | null) => {
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

              {/* Master Filters */}
              {[
                {
                  key: "category",
                  label: "Category",
                  options: filterOptions?.categories,
                },
                {
                  key: "style",
                  label: "Style",
                  options: filterOptions?.styles,
                },
                { key: "type", label: "Type", options: filterOptions?.types },
              ].map((filter) => (
                <Select
                  key={filter.key}
                  value={searchParams.get(filter.key) || "All"}
                  onValueChange={(v) => updateQuery({ [filter.key]: v })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All {filter.label}s</SelectItem>
                    {filter.options?.map((opt: any) => (
                      <SelectItem key={opt._id} value={opt._id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}

              {/* Stock */}
              <Select
                value={currentStock}
                onValueChange={(v) => updateQuery({ in_stock: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Stock</SelectItem>
                  <SelectItem value="true">In Stock</SelectItem>
                  <SelectItem value="false">Out of Stock</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={resetAll}>
                  Reset
                </Button>

                <Button
                  asChild
                  className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
                >
                  <Link href="/admin/variants/new">
                    <Plus size={16} className="mr-2" /> Add
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ===== TABLE AREA ===== */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-white border-b shadow-sm">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Product</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Style</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="text-right font-semibold"></TableHead>
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
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.code}</TableCell>
                    <TableCell className="text-xs">
                      <div className="font-semibold text-black">
                        {v.product?.name}
                      </div>
                      <div className="text-muted-foreground">
                        {v.product?.code}
                      </div>
                    </TableCell>
                    <TableCell>
                      {v.product?.categoryName ||
                        (typeof v.product?.category === "string"
                          ? v.product?.category
                          : "—")}
                    </TableCell>

                    {/* STYLE - UPDATED */}
                    <TableCell>
                      {v.product?.styleName ||
                        (typeof v.product?.style === "string"
                          ? v.product?.style
                          : "—")}
                    </TableCell>

                    {/* TYPE - UPDATED */}
                    <TableCell>
                      {v.product?.typeName ||
                        (typeof v.product?.type === "string"
                          ? v.product?.type
                          : "—")}
                    </TableCell>
                    <TableCell className="font-medium">
                      ₹{v.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {v.in_stock ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                          In Stock
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                          Out
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="flex gap-2 justify-end items-center">
                      <Link href={`/admin/variants/${v._id}`}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <EyeIcon size={14} />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
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
              <span className="font-bold text-black">
                {(currentPage - 1) * 20 + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-black">
                {Math.min(currentPage * 20, data.total)}
              </span>{" "}
              of <span className="font-bold text-black">{data.total}</span>{" "}
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
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
