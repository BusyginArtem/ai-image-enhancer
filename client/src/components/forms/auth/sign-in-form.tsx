"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useRef } from "react";
import { useForm } from "react-hook-form";

import { signInAction } from "@/actions/auth";
import { AuthFormState } from "@/lib/definitions";
import { signInFormSchema, type SignInFormSchema } from "@/lib/validation";
import { Button } from "../../ui/button";
import FormInput from "../../ui/form-input";

export default function SignInForm() {
  const [formState, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(signInAction, undefined);

  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formRef = useRef<HTMLFormElement>(null);

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

      <Button disabled={isPending} type="submit" className="w-full">
        Sign In
      </Button>

      <span className="inline-block h-4 w-full text-sm text-red-500">
        {!formState?.success ? formState?.message : ""}
      </span>
    </form>
  );
}
