export type ClienteStatus = "draft" | "published";

export type ClienteRow = {
  id: string;
  nome: string;
  caminho_logo: string;
  status: ClienteStatus;
  ordem: number;
};

export type Database = {
  public: {
    Tables: {
      clientes: {
        Row: ClienteRow;
        Insert: Omit<ClienteRow, "id">;
        Update: Partial<Omit<ClienteRow, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
