"use client";

import { useActionState } from "react";

import { type LoginState, login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form className="mt-8 grid gap-5" action={formAction}>
      <Field className="gap-[.45rem]">
        <FieldLabel
          className="text-[.76rem] font-bold text-brand-violet"
          htmlFor="login-email"
        >
          E-mail
        </FieldLabel>
        <Input
          className="min-h-11 w-full rounded-[.45rem] border border-[#d6dce8] bg-white px-3 text-[.85rem] text-brand-black outline-none transition-colors placeholder:text-[#9ca6b9] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(state.erros?.email)}
          aria-describedby={
            state.erros?.email ? "login-email-error" : undefined
          }
          required
        />
        <FieldError
          className="text-[.72rem] text-[#bd3d45]"
          id="login-email-error"
        >
          {state.erros?.email}
        </FieldError>
      </Field>

      <Field className="gap-[.45rem]">
        <FieldLabel
          className="text-[.76rem] font-bold text-brand-violet"
          htmlFor="login-password"
        >
          Senha
        </FieldLabel>
        <Input
          className="min-h-11 w-full rounded-[.45rem] border border-[#d6dce8] bg-white px-3 text-[.85rem] text-brand-black outline-none transition-colors placeholder:text-[#9ca6b9] focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15"
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(state.erros?.password)}
          aria-describedby={
            state.erros?.password ? "login-password-error" : undefined
          }
          required
        />
        <FieldError
          className="text-[.72rem] text-[#bd3d45]"
          id="login-password-error"
        >
          {state.erros?.password}
        </FieldError>
      </Field>

      {state.erro ? (
        <p
          className="rounded-[.45rem] bg-[#fff0f0] px-3 py-2 text-[.75rem] text-[#bd3d45]"
          role="alert"
        >
          {state.erro}
        </p>
      ) : null}

      <Button
        className="mt-2 inline-flex min-h-11 items-center justify-center rounded-[.55rem] border border-brand-blue bg-brand-blue px-4 text-[.78rem] font-bold text-brand-white transition-transform hover:-translate-y-0.5 hover:bg-[#1039a9] disabled:cursor-wait disabled:opacity-60"
        type="submit"
        isDisabled={pending}
      >
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
