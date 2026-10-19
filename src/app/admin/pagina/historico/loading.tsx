import {
  EsqueletoCabecalho,
  EsqueletoLinhas,
  EsqueletoTela,
} from "../../esqueleto";

/** Espelha o histórico: lista de versões publicadas. */
export default function HistoricoPaginaLoading() {
  return (
    <EsqueletoTela>
      <EsqueletoCabecalho />

      <div className="mt-8">
        <EsqueletoLinhas quantidade={4} altura="h-20" />
      </div>
    </EsqueletoTela>
  );
}
