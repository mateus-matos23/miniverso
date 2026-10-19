"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useActionState, useState } from "react";

import { type LoginState, login } from "@/app/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <form action={formAction} className="mt-8" noValidate>
      <FieldGroup className="gap-5">
        {state.erro ? (
          <Alert className="font-medium" variant="destructive">
            {state.erro}
          </Alert>
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
          <InputGroup>
            <InputGroupInput
              aria-describedby={
                state.erros?.password ? "login-password-error" : undefined
              }
              aria-invalid={Boolean(state.erros?.password) || undefined}
              autoComplete="current-password"
              id="login-password"
              name="password"
              required
              type={mostrarSenha ? "text" : "password"}
            />
            <InputGroupAddon
              align="inline-end"
              className="self-stretch py-0 pr-1"
            >
              <InputGroupButton
                aria-controls="login-password"
                className="h-full px-2.5"
                onPress={() => setMostrarSenha((atual) => !atual)}
                size="sm"
                variant="ghost"
              >
                {mostrarSenha ? (
                  <EyeOffIcon aria-hidden="true" data-icon="inline-start" />
                ) : (
                  <EyeIcon aria-hidden="true" data-icon="inline-start" />
                )}
                {mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
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
