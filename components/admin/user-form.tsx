"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { userSchema, type UserFormValues } from "@/lib/validations/misc";
import { Input, Label, FieldError, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function UserForm({ defaultValues, userId }: { defaultValues?: Partial<UserFormValues>; userId?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({ resolver: zodResolver(userSchema), defaultValues: { role: "EDITOR", isActive: true, ...defaultValues } });

  const onSubmit = async (values: UserFormValues) => {
    const res = await fetch(userId ? `/api/admin/users/${userId}` : "/api/admin/users", {
      method: userId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return toast.error(body.error ?? "Something went wrong.");
    toast.success(userId ? "Admin updated." : "Admin added.");
    router.push("/admin/users");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 border border-line bg-white p-6" noValidate>
      <div>
        <Label htmlFor="name" required>Full Name</Label>
        <Input id="name" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>
      <div>
        <Label htmlFor="email" required>Email</Label>
        <Input id="email" type="email" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>
      <div>
        <Label htmlFor="password">{userId ? "New Password (leave blank to keep current)" : "Password"}</Label>
        <Input id="password" type="password" {...register("password")} autoComplete="new-password" />
        <FieldError message={errors.password?.message} />
      </div>
      <div>
        <Label htmlFor="role" required>Role</Label>
        <Select id="role" {...register("role")}>
          <option value="EDITOR">Editor — manages content, not admin accounts or critical settings</option>
          <option value="SUPER_ADMIN">Super Admin — full access, including managing other admins</option>
        </Select>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" {...register("isActive")} /> Active (can sign in)
      </label>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/users")}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving…" : userId ? "Save Changes" : "Add Admin"}</Button>
      </div>
    </form>
  );
}
