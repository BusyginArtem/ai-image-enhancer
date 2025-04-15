"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { signUpAction } from "@/actions/auth";
import { APP_PATH } from "@/lib/constants";
import { AuthFormState } from "@/lib/definitions";
import { signUpFormSchema, type SignUpFormSchema } from "@/lib/validation";
import { Button } from "../../ui/button";
import FormInput from "../../ui/form-input";

export default function SignUpForm() {
  const [formState, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(signUpAction, undefined);

  const form = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formState?.success) {
      if (formState?.errors?.email) {
        form.setError("email", {
          type: "custom",
          message: formState.errors.email?.[0],
        });
      }
    }
  }, [formState, form]);

  useEffect(() => {
    if (formState?.success) {
      toast.success(formState.message);
      router.push(APP_PATH.SIGN_IN);
    }
  }, [formState?.success, router]);

  return (
    <form
      action={formAction}
      ref={formRef}
      onSubmit={(evt) => {
        evt.preventDefault();
        form.handleSubmit(() => {
          startTransition(() => {
            formAction(new FormData(formRef.current!));
          });
        })(evt);
      }}
      className="space-y-2"
    >
      <FormInput
        placeholder="Email"
        type="email"
        autoComplete="email"
        error={form.formState?.errors?.email}
        {...form.register("email")}
      />

      <FormInput
        placeholder="Password"
        type="password"
        autoComplete="new-password"
        error={form.formState?.errors?.password}
        {...form.register("password")}
      />

      <FormInput
        placeholder="Confirm Password"
        type="password"
        autoComplete="new-password"
        error={form.formState?.errors?.password_confirmation}
        {...form.register("password_confirmation")}
      />

      <Button disabled={isPending} type="submit" className="w-full">
        Sign Up
      </Button>

      <span className="inline-block h-4 w-full text-sm text-red-400">
        {!formState?.success ? formState?.message : ""}
      </span>
    </form>
  );
}
