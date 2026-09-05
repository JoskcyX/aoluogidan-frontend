import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { adminFetchJson } from "@/lib/api";
import { Container } from "@/components/ui/container";
import { UserForm } from "@/components/admin/user-form";

export default async function EditUserPage({ params }: { params: { id: string } }) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== "SUPER_ADMIN") redirect("/admin");

  const { user: row } = await adminFetchJson(`/api/admin/users/${params.id}`).catch(() => ({ user: null }));
  if (!row) notFound();

  return (
    <Container className="max-w-xl px-0">
      <h1 className="font-display text-2xl text-ink">Edit Admin</h1>
      <div className="mt-8">
        <UserForm userId={row.id} defaultValues={{ name: row.name, email: row.email, role: row.role, isActive: row.isActive }} />
      </div>
    </Container>
  );
}
