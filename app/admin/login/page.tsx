"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        toast.error("Wrong password");
        return;
      }

      document.cookie = "admin-auth=true; path=/";
      toast.success("Login successful");

      router.push("/admin");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
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
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            className="h-11 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:ring-white/20"
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
