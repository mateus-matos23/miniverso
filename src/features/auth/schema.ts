import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Informe um e-mail válido." }),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginState = {
  erro?: string;
  values?: { email?: string };
  erros?: {
    email?: string;
    password?: string;
  };
};
