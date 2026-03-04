"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteProduct } from "@/actions/product.actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  X,
  Search,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  EyeIcon,
  Loader2, // <-- Added Loader2
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableRowSkeletons } from "../loaders/table-skeleton";

export default function ProductTable({ data, filterOptions }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page") || 1);

  const [search, setSearch] = useState(currentSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // <-- 1. Loading States added
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // <-- Turn off skeleton instantly when the URL changes (server responds)
  useEffect(() => {
    setIsFetching(false);
  }, [searchParams]);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

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
      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!("page" in updates)) {
      params.set("page", "1");
    }

    // <-- Turn ON skeleton
    setIsFetching(true);
    router.push(`/admin/products?${params.toString()}`, { scroll: false });
  };

  const resetAll = () => {
    setSearch("");
    setIsFetching(true);
    router.push("/admin/products", { scroll: false });
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    // <-- Turn on delete spinner
    setIsDeleting(true);

    try {
      const res = await deleteProduct(deleteId);
      if (!res?.success) throw new Error(res?.message);
      toast.success("Product deleted successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setIsDeleting(false);
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
          disabled={isFetching}
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
        Products Listing
      </h2>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:block bg-white border rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            {/* SEARCH */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-muted-foreground"
              />
              <Input
                placeholder="Search name or code..."
                value={search}
                disabled={isFetching}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 w-[240px]"
              />
              {search && (
                <X
                  size={16}
                  className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                  onClick={() => {
                    setSearch("");
                    updateQuery({ search: null });
                  }}
                />
              )}
            </div>

            {/* SELECTS */}
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
                disabled={isFetching}
                onValueChange={(v) => updateQuery({ [filter.key]: v })}
              >
                <SelectTrigger className="w-[160px]">
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

            <Button
              variant="outline"
              size="icon"
              disabled={isFetching}
              onClick={resetAll}
            >
              <RotateCcw size={14} />
            </Button>
          </div>

          <Button
            asChild
            className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
          >
            <Link href="/admin/products/new">
              <Plus size={16} className="mr-2" /> Add Product
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
              {/* SEARCH */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-muted-foreground"
                />
                <Input
                  placeholder="Search name or code..."
                  value={search}
                  disabled={isFetching}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-8 w-full"
                />
                {search && (
                  <X
                    size={16}
                    className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                    onClick={() => {
                      setSearch("");
                      updateQuery({ search: null });
                    }}
                  />
                )}
              </div>

              {/* SELECTS */}
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
                  disabled={isFetching}
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

              <div className="flex justify-between items-center pt-2">
                <Button
                  variant="outline"
                  disabled={isFetching}
                  onClick={resetAll}
                >
                  Reset
                </Button>

                <Button
                  asChild
                  className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
                >
                  <Link href="/admin/products/new">
                    <Plus size={16} className="mr-2" /> Add
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* ===== TABLE ===== */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-white shadow-sm border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Style</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* <-- TRIGGER SKELETON MAGIC HERE */}
              {isFetching ? (
                <TableRowSkeletons columns={6} />
              ) : data.products?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-16 text-muted-foreground"
                  >
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                data.products.map((p: any) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>
                      {p.category?.name || p.category || "—"}
                    </TableCell>
                    <TableCell>{p.style?.name || p.style || "—"}</TableCell>
                    <TableCell>{p.type?.name || p.type || "—"}</TableCell>

                    {/* RESTORED ACTION BUTTONS */}
                    <TableCell className="flex gap-2 justify-end">
                      <Link href={`/admin/products/${p._id}`}>
                        <Button size="icon" variant="outline">
                          <EyeIcon size={14} />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteId(p._id)}
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
              products
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage <= 1 || isFetching}
              onClick={() => updateQuery({ page: String(currentPage - 1) })}
            >
              <ChevronLeft size={16} />
            </Button>
            {renderPaginationNumbers()}
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage >= totalPages || isFetching}
              onClick={() => updateQuery({ page: String(currentPage + 1) })}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 w-[80px] flex justify-center"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
