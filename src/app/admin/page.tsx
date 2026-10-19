import type { Metadata } from "next";

import { requireAdmin } from "@/lib/auth";
import { AlertasTopo } from "./_dashboard/alertas";
import {
  buscarMetricas,
  buscarResumoConteudo,
  buscarUltimosLeads,
  buscarVitalsPorVersao,
  buscarWebVitals,
  seguro,
  temRascunhoPendente,
} from "./_dashboard/dados";
import { DesempenhoWebVitals } from "./_dashboard/desempenho";
import { DesempenhoVersoes } from "./_dashboard/desempenho-versoes";
import { GraficoDiario } from "./_dashboard/grafico-diario";
import { KpisPeriodo } from "./_dashboard/kpis";
import { intervaloDoPeriodo, lerPeriodo } from "./_dashboard/periodo";
import { RankingsPeriodo } from "./_dashboard/rankings";
import { ResumoConteudo } from "./_dashboard/resumo-conteudo";
import { Secao } from "./_dashboard/secao";
import { SeletorPeriodo } from "./_dashboard/seletor-periodo";
import { UltimosLeads } from "./_dashboard/ultimos-leads";
import { contarLeadsNovos } from "./leads/contagem";
import { AdminPage, PageHeader } from "./page-header";

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

      <div className="mt-8">
        <AlertasTopo
          leadsNovos={leadsNovos}
          rascunhoPendente={rascunhoPendente}
          vitals={vitals}
        />
      </div>

      <Secao
        descricao={`Números de ${rotuloPeriodo}, no fuso de Fortaleza.`}
        id="indicadores"
        titulo="Indicadores"
        className="mt-8"
      >
        <KpisPeriodo metricas={metricas} />
      </Secao>

      <Secao
        descricao={`Visitantes e leads de cada dia de ${rotuloPeriodo}.`}
        id="tendencia"
        titulo="Tendência diária"
      >
        <GraficoDiario metricas={metricas} />
      </Secao>

      <Secao
        descricao={`Cliques, origens e dispositivos de ${rotuloPeriodo}.`}
        id="origem-e-cliques"
        titulo="Cliques e origem"
      >
        <RankingsPeriodo metricas={metricas} />
      </Secao>

      <Secao
        descricao={`Medições de ${rotuloPeriodo}.`}
        id="desempenho"
        titulo="Desempenho"
      >
        <DesempenhoWebVitals vitals={vitals} />
      </Secao>

      <Secao
        descricao="p75 no celular de cada versão publicada, comparado à versão anterior. Piora acima de 20% é destacada."
        id="desempenho-versoes"
        titulo="Desempenho por versão publicada"
      >
        <DesempenhoVersoes versoes={versoes} />
      </Secao>

      <Secao id="conteudo" titulo="Conteúdo">
        <ResumoConteudo conteudo={conteudo} />
      </Secao>

      <Secao
        descricao="Os cinco contatos mais recentes do formulário."
        id="ultimos-leads"
        titulo="Últimos leads"
      >
        <UltimosLeads agora={agora} leads={ultimosLeads} />
      </Secao>
    </AdminPage>
  );
}
