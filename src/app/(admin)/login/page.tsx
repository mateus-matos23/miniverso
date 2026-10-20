import Image from "next/image";
import LoginForm from "@/features/auth/components/login-form";
import { redirectIfAdmin } from "@/features/auth/require-admin";
import logoColor from "../../../../public/brand/logo-horizontal-color.webp";
import logoWhite from "../../../../public/brand/logo-vertical-white.webp";

export default async function LoginPage() {
  await redirectIfAdmin();

  return (
    <main className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.1fr)_minmax(28rem,0.9fr)]">
      <aside
        aria-hidden="true"
        className="relative isolate hidden overflow-hidden bg-brand-aurora p-12 text-brand-white lg:flex lg:flex-col lg:justify-between"
        data-surface="dark"
      >
        <div className="mask-delineado absolute right-[-30%] bottom-[-8%] -z-10 aspect-1600/930 w-[140%] bg-brand-white/25" />
        <Image
          alt=""
          className="h-24 w-auto self-start"
          preload
          src={logoWhite}
        />
        <p className="max-w-[12ch] font-display text-display-lg font-bold">
          Cada conteúdo publicado abre um novo mundo.
        </p>
      </aside>

      <div className="flex flex-col justify-center px-5 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-104">
          <Image
            alt="Miniverso"
            className="h-8 w-auto lg:hidden"
            preload
            src={logoColor}
          />
          <h1 className="mt-10 font-display lg:mt-0 text-display-md font-bold text-heading">
            Entrar no painel
          </h1>
          <p className="mt-3 text-muted-foreground">
            Use as credenciais de administrador para gerenciar o conteúdo da
            landing page.
          </p>
          <LoginForm />
          <a
            className="mt-10 inline-flex h-10 items-center text-sm font-medium text-primary underline-offset-4 hover:underline"
            href="/"
          >
            Voltar para o site
          </a>
        </div>
      </div>
    </main>
  );
}
