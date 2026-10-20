import type { Database as DatabaseGerado, Tables } from "./database.types";

export type * from "./database.types";

type TabelasGeradas = DatabaseGerado["public"]["Tables"];
type ClientesGerado = TabelasGeradas["clientes"];

/**
 * Tipos gerados (`pnpm db:types`) com os ajustes que o gerador não enxerga.
 * `clientes.ordem` não tem default: a trigger `definir_ordem_cliente` preenche
 * quando o insert não informa, então o campo é opcional no Insert.
 */
export type Database = Omit<DatabaseGerado, "public"> & {
  public: Omit<DatabaseGerado["public"], "Tables"> & {
    Tables: Omit<TabelasGeradas, "clientes"> & {
      clientes: Omit<ClientesGerado, "Insert"> & {
        Insert: Omit<ClientesGerado["Insert"], "ordem"> & { ordem?: number };
      };
    };
  };
};

// Aliases de conveniência usados pelo código da aplicação.
export type ClienteRow = Tables<"clientes">;
// status é text no banco, por isso o union é manual.
export type ClienteStatus = "draft" | "published";
export type ConteudoRow = Tables<"conteudos">;
// categoria é opcional; slug é único e usado nas URLs /projetos/[slug].
export type LandingVersaoRow =
  Database["public"]["Tables"]["landing_versoes"]["Row"];

// Mídias da biblioteca (bucket público `site`). A URL pública é montada em src/features/media/urls.ts.
export type MidiaRow = Database["public"]["Tables"]["midias"]["Row"];

// Leads do formulario de contato. Insercao somente pela funcao registrar_lead.
export type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
// Eventos anonimos (pageview, cta_click e lead). Leitura somente pelo admin.
export type EventoRow = Database["public"]["Tables"]["eventos"]["Row"];
// Web Vitals anonimos. Leitura somente pelo admin.
export type WebVitalRow = Database["public"]["Tables"]["web_vitals"]["Row"];
