import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { UsersTable } from "./users-table";
import { Plus } from "lucide-react";

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "SUPER_ADMIN") redirect("/admin");

  const { users: rows = [] } = await adminFetchJson("/api/admin/users");

  return (
    <Container className="max-w-none px-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Admin Users</h1>
          <p className="mt-1 text-sm text-slate">Manage who can access this dashboard.</p>
        </div>
        <Link href="/admin/users/new"><Button size="sm"><Plus size={16} className="mr-1" /> Add Admin</Button></Link>
      </div>
      <div className="mt-8">
        <UsersTable initialRows={rows} currentUserId={currentUser.id} />
      </div>
    </Container>
  );
}
