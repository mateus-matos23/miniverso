import Image from "next/image";

import logo from "../../../public/miniverso.png";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-brand-violet px-5 py-10 text-brand-black">
      <section className="w-full max-w-[28rem] rounded-[.8rem] bg-brand-white p-8 shadow-2xl shadow-black/20 max-[560px]:p-6">
        <div className="mb-10 flex items-center gap-3">
          <Image
            className="size-12 rounded-[.7rem]"
            src={logo}
            alt="Miniverso"
          />
          <div>
            <p className="font-bold tracking-[.02em] text-brand-violet">
              miniverso
            </p>
            <p className="text-[.68rem] font-medium uppercase tracking-[.08em] text-[#7b8498]">
              painel administrativo
            </p>
          </div>
        </div>

        <p className="mb-3 text-[.68rem] font-bold uppercase tracking-[.14em] text-brand-blue">
          Acesso restrito
        </p>
        <h1 className="font-display text-[clamp(2.4rem,8vw,3.6rem)] leading-[.92] tracking-[-.08em] text-brand-violet">
          Entrar no painel.
        </h1>
        <p className="mt-4 text-[.9rem] leading-relaxed text-[#6f7890]">
          Use as credenciais do administrador para continuar.
        </p>

        <LoginForm />
      </section>
    </main>
  );
}
