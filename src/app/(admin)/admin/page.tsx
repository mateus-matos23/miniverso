import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPage, PageHeader } from "@/components/admin/page-header";
import { buttonVariants } from "@/components/ui/button-variants";
import { requireAdmin } from "@/features/auth/require-admin";
import { AlertasTopo } from "@/features/dashboard/components/alerts";
import { ResumoConteudo } from "@/features/dashboard/components/content-summary";
import { GraficoDiario } from "@/features/dashboard/components/daily-chart";
import { KpisPeriodo } from "@/features/dashboard/components/kpis";
import { UltimosLeads } from "@/features/dashboard/components/latest-leads";
import { DesempenhoWebVitals } from "@/features/dashboard/components/performance";
import { SeletorPeriodo } from "@/features/dashboard/components/period-selector";
import { RankingsPeriodo } from "@/features/dashboard/components/rankings";
import { Secao } from "@/features/dashboard/components/section";
import { DesempenhoVersoes } from "@/features/dashboard/components/version-performance";
import {
  buscarMetricas,
  buscarResumoConteudo,
  buscarUltimosLeads,
  buscarVitalsPorVersao,
  buscarWebVitals,
  seguro,
  temRascunhoPendente,
} from "@/features/dashboard/data";
import { intervaloDoPeriodo, lerPeriodo } from "@/features/dashboard/period";
import { contarLeadsNovos } from "@/features/leads/data";

export const metadata: Metadata = { title: "Visão geral" };

type VisaoGeralProps = {
  searchParams: Promise<{ periodo?: string | string[] }>;
};

export default async function AdminOverviewPage({
  searchParams,
}: VisaoGeralProps) {
  const { periodo: periodoBruto } = await searchParams;
  const periodo = lerPeriodo(periodoBruto);
  const agora = Date.now();
  const { inicio, fim } = intervaloDoPeriodo(periodo, new Date(agora));
  const { supabase } = await requireAdmin();

  // Cada bloco falha sozinho: `seguro` devolve { ok: false } em vez de derrubar a página.
  const [
    rascunhoPendente,
    leadsNovos,
    metricas,
    vitals,
    versoes,
    conteudo,
    ultimosLeads,
  ] = await Promise.all([
    seguro(() => temRascunhoPendente(supabase)),
    seguro(() => contarLeadsNovos(supabase)),
    seguro(() => buscarMetricas(supabase, inicio, fim)),
    seguro(() => buscarWebVitals(supabase, inicio, fim)),
    seguro(() => buscarVitalsPorVersao(supabase, inicio)),
    seguro(() => buscarResumoConteudo(supabase)),
    seguro(() => buscarUltimosLeads(supabase)),
  ]);

  const rotuloPeriodo = `últimos ${periodo} dias`;

  return (
    <AdminPage>
      <PageHeader
        actions={<SeletorPeriodo atual={periodo} />}
        description="Visitas, conversão e desempenho da landing page, além do resumo do conteúdo e dos leads recebidos."
        title="Visão geral"
      />

      <div className="mt-6 empty:hidden">
        <AlertasTopo
          leadsNovos={leadsNovos}
          rascunhoPendente={rascunhoPendente}
          vitals={vitals}
        />
      </div>

      <Secao
        descricao={`Números de ${rotuloPeriodo}, no fuso de Fortaleza.`}
        id="indicadores"
        semMoldura
        titulo="Indicadores"
      >
        <KpisPeriodo metricas={metricas} />
      </Secao>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Secao
          className="mt-0 xl:col-span-2"
          descricao={`Visitantes e leads de cada dia de ${rotuloPeriodo}.`}
          id="tendencia"
          titulo="Tendência diária"
        >
          <GraficoDiario metricas={metricas} />
        </Secao>

        <Secao
          acao={
            <Link
              className={buttonVariants({ variant: "ghost", size: "sm" })}
              href="/admin/leads"
            >
              Ver todos
              <ArrowRightIcon />
            </Link>
          }
          className="mt-0"
          descricao="Os cinco contatos mais recentes do formulário."
          id="ultimos-leads"
          titulo="Últimos leads"
        >
          <UltimosLeads agora={agora} leads={ultimosLeads} />
        </Secao>
      </div>

      <div className="mt-6 grid gap-6">
        <Secao
          className="mt-0"
          descricao={`Cliques, origens e dispositivos de ${rotuloPeriodo}.`}
          id="origem-e-cliques"
          titulo="Cliques e origem"
        >
          <RankingsPeriodo metricas={metricas} />
        </Secao>

        <Secao
          className="mt-0"
          descricao={`Medições de ${rotuloPeriodo}.`}
          id="desempenho"
          titulo="Desempenho"
        >
          <DesempenhoWebVitals vitals={vitals} />
        </Secao>
      </div>

      <Secao
        descricao="p75 no celular de cada versão publicada, comparado à versão anterior. Piora acima de 20% é destacada."
        id="desempenho-versoes"
        titulo="Desempenho por versão publicada"
      >
        <DesempenhoVersoes versoes={versoes} />
      </Secao>

      <Secao id="resumo-conteudo" semMoldura titulo="Conteúdo">
        <ResumoConteudo conteudo={conteudo} />
      </Secao>
    </AdminPage>
  );
}
