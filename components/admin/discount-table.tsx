"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteDiscount } from "@/actions/discount.actions";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  Search,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  Plus,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { RotateCcw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  data: {
    discounts: any[];
    total: number;
    pages: number;
    page: number;
  };
}

export default function DiscountTable({ data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
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
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    if (!("page" in updates)) params.set("page", "1");

    router.push(`/admin/discount?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteDiscount(deleteId);
      if (!res.success) throw new Error(res.message);
      toast.success("Discount deleted");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const totalPages = data.pages || 1;

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-120px)] bg-white p-6 rounded-xl border border-black/10">
      <h2 className="text-2xl font-semibold mb-6">Discounts</h2>

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
                className="pl-9 pr-8 w-[220px]"
              />
              {search && (
                <X
                  size={16}
                  className="absolute right-2 top-3 cursor-pointer text-muted-foreground"
                  onClick={() => updateQuery({ search: null })}
                />
              )}
            </div>

            {/* TYPE FILTER */}
            <Select
              value={searchParams.get("type") || "All"}
              onValueChange={(v) => updateQuery({ type: v })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="style">Style</SelectItem>
                <SelectItem value="type">Type</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="variant">Variant</SelectItem>
              </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select
              value={searchParams.get("status") || "All"}
              onValueChange={(v) => updateQuery({ status: v })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/admin/discount")}
            >
              <RotateCcw size={14} />
            </Button>
          </div>

          <Button
            asChild
            className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
          >
            <Link href="/admin/discount/new">
              <Plus size={16} className="mr-2" /> Add Discount
            </Link>
          </Button>
        </div>
      </div>

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

              {/* Type */}
              <Select
                value={searchParams.get("type") || "All"}
                onValueChange={(v) => updateQuery({ type: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="style">Style</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="variant">Variant</SelectItem>
                </SelectContent>
              </Select>

              {/* Status */}
              <Select
                value={searchParams.get("status") || "All"}
                onValueChange={(v) => updateQuery({ status: v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/discount")}
                >
                  Reset
                </Button>

                <Button
                  asChild
                  className="hover:bg-[#E3BB76] hover:text-black bg-black text-white"
                >
                  <Link href="/admin/discount/new">
                    <Plus size={16} className="mr-2" /> Add
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* TABLE */}
      <div className="flex-1 border rounded-xl overflow-hidden bg-white flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white border-b">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16">
                    No discounts found
                  </TableCell>
                </TableRow>
              ) : (
                data.discounts.map((d) => {
                  const now = new Date();
                  const active =
                    d.isActive &&
                    new Date(d.startAt) <= now &&
                    new Date(d.endAt) >= now;

                  return (
                    <TableRow key={d._id}>
                      <TableCell className="font-medium">{d.name}</TableCell>
                      <TableCell>{d.value}%</TableCell>
                      <TableCell className="capitalize">{d.type}</TableCell>
                      <TableCell>
                        {new Date(d.startAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(d.endAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {active ? (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                            Active
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="flex gap-2 justify-end">
                        <Link href={`/admin/discount/${d._id}`}>
                          <Button size="icon" variant="outline">
                            <EyeIcon size={14} />
                          </Button>
                        </Link>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => setDeleteId(d._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={currentPage <= 1}
            onClick={() => updateQuery({ page: String(currentPage - 1) })}
          >
            <ChevronLeft size={16} />
          </Button>

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

      {/* DELETE DIALOG */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this discount?</AlertDialogTitle>
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
