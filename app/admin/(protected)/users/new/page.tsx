import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";
import { Container } from "@/components/ui/container";
import { UserForm } from "@/components/admin/user-form";

export default async function NewUserPage() {
  const user = await getCurrentUser();
  if (user?.role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <Container className="max-w-xl px-0">
      <h1 className="font-display text-2xl text-ink">Add Admin</h1>
      <div className="mt-8"><UserForm /></div>
    </Container>
  );
}
