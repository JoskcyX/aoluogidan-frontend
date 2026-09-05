import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // Defense in depth: middleware.ts already protects /admin/* at the edge,
  // but every server component in this tree also checks directly, since a
  // misconfigured matcher shouldn't be the only thing standing between an
  // unauthenticated visitor and firm data.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-surface lg:flex-row">
      <AdminSidebar role={user.role} userName={user.name} />
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
