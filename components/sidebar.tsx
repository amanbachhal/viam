"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminSidebar() {
  const path = usePathname();

  const linkStyle = (href: string) =>
    `block px-4 py-3 rounded-lg transition ${
      path === href
        ? "bg-white text-black"
        : "text-neutral-300 hover:bg-white/10"
    }`;

  return (
    <aside className="w-64 bg-stone-950 text-white flex flex-col justify-between p-6">
      <div className="space-y-10">
        <Image
          src="/logo.webp"
          alt="Logo"
          width={170}
          height={170}
          className="w-[170px]"
        />

        <nav className="space-y-2">
          <Link href="/admin/products" className={linkStyle("/admin/products")}>
            Products
          </Link>

          <Link
            href="/admin/hero-images"
            className={linkStyle("/admin/hero-images")}
          >
            Hero Images
          </Link>
        </nav>
      </div>

      <LogoutButton />
    </aside>
  );
}

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });

    toast.success("Logged out");
    router.push("/admin/login");
  };

  return (
    <Button variant="outline" className="w-full" onClick={logout}>
      Logout
    </Button>
  );
}
