"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("حدث خطأ في الاتصال");
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-paper px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-ink p-8 flex flex-col gap-5"
      >
        <h1 className="font-display font-extrabold text-2xl text-center mb-2">
          لوحة تحكم <span className="text-clay">حلب خان</span>
        </h1>
        <label className="flex flex-col gap-2">
          <span className="font-bold text-sm">اسم المستخدم</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-ink px-4 py-3 focus:outline-none focus:bg-mustard/10"
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="font-bold text-sm">كلمة المرور</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-ink px-4 py-3 focus:outline-none focus:bg-mustard/10"
            required
          />
        </label>
        {error && <p className="text-clay text-sm font-bold">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-paper font-bold py-3 hover:bg-clay transition-colors disabled:opacity-50"
        >
          {loading ? "جاري الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}
