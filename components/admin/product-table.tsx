"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteProduct } from "@/actions/product.actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Trash2,
  Pencil,
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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductTable({ data }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "All";
  const currentStyle = searchParams.get("style") || "All";
  const currentType = searchParams.get("type") || "All";
  const currentPage = Number(searchParams.get("page") || 1);

  const [search, setSearch] = useState(currentSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(currentSearch);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

    // Reset page ONLY if page is NOT explicitly being updated
    if (!("page" in updates)) {
      params.set("page", "1");
    }

    router.push(`/admin/products?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearch("");
    updateQuery({ search: null });
  };

  const resetAll = () => {
    setSearch("");
    router.push("/admin/products");
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteProduct(deleteId);
      if (!res?.success) throw new Error(res?.message);

      toast.success("Product deleted successfully");
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
        Products Listing
      </h2>

      {/* ===== FILTER BAR ===== */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              placeholder="Search name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8 w-[260px]"
            />
            {search && (
              <X
                size={16}
                className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                onClick={clearSearch}
              />
            )}
          </div>

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

          <Button variant="outline" size="icon" onClick={resetAll}>
            <RotateCcw size={14} />
          </Button>
        </div>

        <Button asChild className="hover:bg-[#E3BB76] hover:text-black">
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      {/* ===== TABLE AREA (FLEX GROW) ===== */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          <Table>
            {/* Sticky Header */}
            <TableHeader className="sticky top-0 z-20 bg-white shadow-sm border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Code</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Style</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold text-right"></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.products.length === 0 ? (
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
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>{p.style}</TableCell>
                    <TableCell>{p.type}</TableCell>
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

      {/* ===== FIXED PAGINATION STRIP ===== */}
      <div className="border-t pt-4 mt-4 flex items-center justify-between">
        {/* Left - Total Records */}
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

        {/* Right - Pagination */}
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

      {/* ===== DELETE DIALOG ===== */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this product?
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
