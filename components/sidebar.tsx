"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useEffect, useTransition } from "react"; // <-- Added useTransition
import { Menu, X, Loader2 } from "lucide-react"; // <-- Added Loader2
import { cn } from "@/lib/utils";
import { logoutAdmin } from "@/actions/auth.actions";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton

export default function AdminSidebar() {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Automatically close sidebar when navigation happens on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [path]);

  const linkStyle = (href: string) =>
    `block px-4 py-3 rounded-lg transition ${
      path === href
        ? "bg-white text-black"
        : "text-neutral-300 hover:bg-white/10"
    }`;

  return (
    <>
      {/* Mobile Toggle Button (Floating) */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 bg-white text-black shadow-md"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-stone-950 text-white flex-col justify-between p-6 z-50",
          // Mobile state: Full screen overlay when open, otherwise hidden
          isOpen ? "fixed inset-0 flex w-full h-full" : "hidden",
          // Desktop state: Always visible, fixed width, relative positioning
          "md:flex md:relative md:w-64 md:h-auto",
        )}
      >
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <Image
              src="/logo.webp"
              alt="Logo"
              width={170}
              height={40}
              className="w-[170px] h-auto object-contain unoptimized"
            />

            {/* Mobile Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="space-y-2">
            <Link
              href="/admin/products"
              className={linkStyle("/admin/products")}
            >
              Products
            </Link>

            <Link
              href="/admin/variants"
              className={linkStyle("/admin/variants")}
            >
              Variants
            </Link>

            <Link
              href="/admin/discount"
              className={linkStyle("/admin/discount")}
            >
              Discount
            </Link>

            <Link href="/admin/master" className={linkStyle("/admin/master")}>
              Master
            </Link>

            <Link
              href="/admin/site-config"
              className={linkStyle("/admin/site-config")}
            >
              Website Config
            </Link>
          </nav>
        </div>

        <LogoutButton />
      </aside>
    </>
  );
}

export function LogoutButton() {
  const router = useRouter();
  // <-- 1. Added useTransition for the logout action
  const [isPending, startTransition] = useTransition();

  const logout = () => {
    // <-- 2. Wrap the async call in startTransition
    startTransition(async () => {
      try {
        await logoutAdmin();

        toast.success("Logged out");
        router.push("/admin/login");
      } catch (error) {
        toast.error("Failed to logout");
      }
    });
  };

  return (
    // <-- 3. Add disabled state and Loader2
    <Button
      variant="destructive"
      className="w-full"
      onClick={logout}
      disabled={isPending}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}

// ==========================================
// EXPORTED SKELETON FOR THE SIDEBAR
// ==========================================
export function AdminSidebarSkeleton() {
  return (
    <aside className="bg-stone-950 text-white flex-col justify-between p-6 z-50 hidden md:flex md:relative md:w-64 md:h-auto min-h-screen">
      <div className="space-y-10">
        {/* LOGO SKELETON */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-[170px] bg-white/20 rounded-md" />
        </div>

        {/* NAV LINKS SKELETON */}
        <nav className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="h-[48px] w-full bg-white/10 rounded-lg"
            />
          ))}
        </nav>
      </div>

      {/* LOGOUT BUTTON SKELETON */}
      <div className="mt-auto pt-10">
        <Skeleton className="h-10 w-full bg-red-900/40 rounded-md" />
      </div>
    </aside>
  );
}
