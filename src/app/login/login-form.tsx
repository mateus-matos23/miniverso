"use client";

import { useActionState } from "react";

import { type LoginState, login } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="mt-8" noValidate>
      <FieldGroup className="gap-5">
        {state.erro ? (
          <p
            className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
            role="alert"
          >
            {state.erro}
          </p>
        ) : null}

        <Field data-invalid={Boolean(state.erros?.email) || undefined}>
          <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
          <Input
            aria-describedby={
              state.erros?.email ? "login-email-error" : undefined
            }
            aria-invalid={Boolean(state.erros?.email) || undefined}
            autoComplete="email"
            defaultValue={state.values?.email}
            id="login-email"
            inputMode="email"
            name="email"
            required
            type="email"
          />
          <FieldError id="login-email-error">{state.erros?.email}</FieldError>
        </Field>

        <Field data-invalid={Boolean(state.erros?.password) || undefined}>
          <FieldLabel htmlFor="login-password">Senha</FieldLabel>
          <Input
            aria-describedby={
              state.erros?.password ? "login-password-error" : undefined
            }
            aria-invalid={Boolean(state.erros?.password) || undefined}
            autoComplete="current-password"
            id="login-password"
            name="password"
            required
            type="password"
          />
          <FieldError id="login-password-error">
            {state.erros?.password}
          </FieldError>
        </Field>

        <Button
          className="mt-2 w-full"
          isDisabled={pending}
          size="lg"
          type="submit"
        >
          {pending ? <Spinner data-icon="inline-start" /> : null}
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </FieldGroup>
    </form>
  );
}
