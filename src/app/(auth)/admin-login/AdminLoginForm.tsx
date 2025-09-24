"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { User } from "@/lib/auth";
import {
  adminLoginSchema,
  AdminLoginFormValues,
} from "@/lib/validations/auth/admin-login.schema";

export default function AdminLoginForm() {
  const router = useRouter();

  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: AdminLoginFormValues) {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Login failed");
      return;
    }

    // Check if user is admin
    const session = await authClient.getSession();
    if (!session.data?.user) {
      toast.error("Authentication failed");
      return;
    }

    const user = session.data.user as User;

    // Ensure user is internal type and has admin role
    if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
      await authClient.signOut();
      toast.error("Access denied. This portal is for administrators only.");
      return;
    }

    toast.success("Admin login successful");
    router.push("/admin");
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                Email Address
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@everkind.com.au"
                  className="h-10 sm:h-11"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  className="h-10 sm:h-11"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          loading={isLoading}
          loadingText="Signing in..."
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
}
