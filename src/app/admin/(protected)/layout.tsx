import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, COOKIE_NAME } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminToken(token) : null;

  if (!payload) {
    redirect("/admin/login");
  }

  return (
    <div dir="rtl" className="min-h-screen flex bg-paper text-ink font-sans">
      <AdminNav username={payload.username} />
      <main className="flex-1 min-w-0 p-4 pt-18 sm:pt-8 sm:p-8">{children}</main>
    </div>
  );
}
