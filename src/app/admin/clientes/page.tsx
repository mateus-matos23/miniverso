import { requireAdmin } from "@/lib/auth";

import type { Cliente } from "./actions";
import ClientesTable from "./clientes-table";

const bucket = "miniverso";

export default async function ClientesPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("clientes")
    .select("id,nome,caminho_logo,status,ordem")
    .returns<Cliente[]>()
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true });

  if (error) throw error;

  const clientes = await Promise.all(
    (data ?? []).map(async (cliente) => {
      const { data: signedUrl, error: logoError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(cliente.caminho_logo, 3600);

      if (logoError) throw logoError;
      if (!signedUrl) {
        throw new Error(`URL da logo não gerada para o cliente ${cliente.id}`);
      }

      return { ...cliente, logoUrl: signedUrl.signedUrl };
    }),
  );

  return (
    <main className="mx-auto w-[min(1120px,calc(100%-8rem))] py-[4.5rem] max-[850px]:w-[min(100%-2.5rem,680px)] max-[850px]:py-14">
      <div className="flex items-end justify-between gap-8 max-[700px]:flex-col max-[700px]:items-start">
        <div>
          <p className="mb-3 text-[.68rem] font-bold uppercase tracking-[.14em] text-brand-blue">
            Mapa de mundos / clientes
          </p>
          <h1 className="m-0 font-display text-[clamp(2.25rem,4vw,4rem)] leading-[.95] tracking-[-.08em] text-brand-violet">
            Clientes em órbita.
          </h1>
          <p className="mt-[.9rem] max-w-[34rem] text-[.95rem] text-[#6f7890]">
            Gerencie as marcas que recebem os conteúdos do Miniverso.
          </p>
        </div>
      </div>
      <ClientesTable clientes={clientes} />
    </main>
  );
}
