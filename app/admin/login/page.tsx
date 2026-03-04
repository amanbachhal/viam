"use client";

import { loginAdmin } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // <-- Added Loader2
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const isValid = password.length >= 1 && password.length <= 20;

    if (!isValid) {
      toast.error("Password must be 1–20 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await loginAdmin(password);

      if (!res.success) {
        toast.error("Wrong password");
        setLoading(false); // Reset loading if password is wrong
        return;
      }

      toast.success("Login successful");
      window.location.href = "/admin/products";
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false); // Reset loading on network/server error
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-400 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-3xl bg-stone-950 p-12 shadow-2xl border border-white/5">
        <div className="flex flex-col items-center space-y-5">
          <Image
            src="/logo.webp"
            alt="Logo"
            width={170}
            height={170}
            priority
            className="w-[170px] object-contain"
          />

          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold text-white tracking-wide">
              Admin Panel
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            minLength={1}
            maxLength={20}
            disabled={loading} // <-- Disable input while loading
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-neutral-400 focus-visible:ring-white/20"
          />

          <Button
            onClick={login}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-white text-black hover:bg-neutral-200 flex items-center justify-center"
          >
            {/* <-- Added Spinner */}
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-black" />
            )}
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// EXPORTED SKELETON FOR INITIAL PAGE LOAD
// ==========================================
export function AdminLoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-400 px-4">
      <div className="w-full max-w-sm space-y-8 rounded-3xl bg-stone-950 p-12 shadow-2xl border border-white/5">
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center space-y-5">
          <Skeleton className="h-[40px] w-[170px] bg-white/10" />
          <Skeleton className="h-7 w-32 bg-white/10" />
        </div>

        {/* INPUT & BUTTON */}
        <div className="space-y-4">
          <Skeleton className="h-11 w-full rounded-md bg-white/5" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/20" />
        </div>
      </div>
    </div>
  );
}
