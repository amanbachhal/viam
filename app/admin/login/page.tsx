"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loginAdmin } from "@/actions/auth.actions";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        return;
      }

      toast.success("Login successful");

      // Force a hard navigation. This bypasses the Next.js client cache
      // and guarantees your middleware receives the fresh cookie.
      window.location.href = "/admin/products";
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false); // Make sure this is here or in a finally block!
    }
    // Remove the `finally { setLoading(false) }` block because
    // window.location.href will navigate away from the page anyway.
    // Setting it to false right before a hard redirect can sometimes cause a flash.
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
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-neutral-400 focus-visible:ring-white/20"
          />

          <Button
            onClick={login}
            disabled={loading}
            className="w-full h-11 rounded-xl bg-white text-black hover:bg-neutral-200"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
