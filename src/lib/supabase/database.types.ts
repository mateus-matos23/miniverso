export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17";
  };
  public: {
    Tables: {
      clientes: {
        Row: {
          atualizado_em: string;
          criado_em: string;
          id: string;
          logo_id: string;
          nome: string;
          ordem: number;
          status: string;
        };
        Insert: {
          atualizado_em?: string;
          criado_em?: string;
          id?: string;
          logo_id: string;
          nome: string;
          ordem: number;
          status?: string;
        };
        Update: {
          atualizado_em?: string;
          criado_em?: string;
          id?: string;
          logo_id?: string;
          nome?: string;
          ordem?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "clientes_logo_id_fkey";
            columns: ["logo_id"];
            isOneToOne: false;
            referencedRelation: "midias";
            referencedColumns: ["id"];
          },
        ];
      };
      conteudos: {
        Row: {
          atualizado_em: string;
          categoria: string | null;
          cliente_id: string;
          criado_em: string;
          descricao: string;
          id: string;
          midia_id: string;
          ordem: number;
          slug: string;
          status: string;
          titulo: string;
        };
        Insert: {
          atualizado_em?: string;
          categoria?: string | null;
          cliente_id: string;
          criado_em?: string;
          descricao: string;
          id?: string;
          midia_id: string;
          ordem?: number;
          slug: string;
          status?: string;
          titulo: string;
        };
        Update: {
          atualizado_em?: string;
          categoria?: string | null;
          cliente_id?: string;
          criado_em?: string;
          descricao?: string;
          id?: string;
          midia_id?: string;
          ordem?: number;
          slug?: string;
          status?: string;
          titulo?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conteudos_cliente_id_fkey";
            columns: ["cliente_id"];
            isOneToOne: false;
            referencedRelation: "clientes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "conteudos_midia_id_fkey";
            columns: ["midia_id"];
            isOneToOne: false;
            referencedRelation: "midias";
            referencedColumns: ["id"];
          },
        ];
      };
      eventos: {
        Row: {
          alvo: string | null;
          caminho: string;
          criado_em: string;
          dispositivo: string;
          id: number;
          referrer_host: string | null;
          tipo: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
          visitante_hash: string;
        };
        Insert: {
          alvo?: string | null;
          caminho: string;
          criado_em?: string;
          dispositivo: string;
          id?: never;
          referrer_host?: string | null;
          tipo: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          visitante_hash: string;
        };
        Update: {
          alvo?: string | null;
          caminho?: string;
          criado_em?: string;
          dispositivo?: string;
          id?: never;
          referrer_host?: string | null;
          tipo?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
          visitante_hash?: string;
        };
        Relationships: [];
      };
      landing_versoes: {
        Row: {
          atualizado_em: string;
          conteudo: Json;
          criado_em: string;
          id: string;
          nota: string | null;
          publicado_em: string | null;
          status: string;
        };
        Insert: {
          atualizado_em?: string;
          conteudo: Json;
          criado_em?: string;
          id?: string;
          nota?: string | null;
          publicado_em?: string | null;
          status?: string;
        };
        Update: {
          atualizado_em?: string;
          conteudo?: Json;
          criado_em?: string;
          id?: string;
          nota?: string | null;
          publicado_em?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          atualizado_em: string;
          cargo: string | null;
          criado_em: string;
          email: string;
          escola: string | null;
          id: string;
          interesse: string;
          ip_hash: string;
          mensagem: string;
          nome: string;
          notas: string;
          pagina: string | null;
          status: string;
          utm_campaign: string | null;
          utm_medium: string | null;
          utm_source: string | null;
        };
        Insert: {
          atualizado_em?: string;
          cargo?: string | null;
          criado_em?: string;
          email: string;
          escola?: string | null;
          id?: string;
          interesse: string;
          ip_hash: string;
          mensagem: string;
          nome: string;
          notas?: string;
          pagina?: string | null;
          status?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Update: {
          atualizado_em?: string;
          cargo?: string | null;
          criado_em?: string;
          email?: string;
          escola?: string | null;
          id?: string;
          interesse?: string;
          ip_hash?: string;
          mensagem?: string;
          nome?: string;
          notas?: string;
          pagina?: string | null;
          status?: string;
          utm_campaign?: string | null;
          utm_medium?: string | null;
          utm_source?: string | null;
        };
        Relationships: [];
      };
      midias: {
        Row: {
          alt: string;
          altura: number | null;
          atualizado_em: string;
          caminho: string;
          criado_em: string;
          id: string;
          largura: number | null;
          mime: string;
          tamanho: number;
          tipo: string;
        };
        Insert: {
          alt?: string;
          altura?: number | null;
          atualizado_em?: string;
          caminho: string;
          criado_em?: string;
          id?: string;
          largura?: number | null;
          mime: string;
          tamanho: number;
          tipo: string;
        };
        Update: {
          alt?: string;
          altura?: number | null;
          atualizado_em?: string;
          caminho?: string;
          criado_em?: string;
          id?: string;
          largura?: number | null;
          mime?: string;
          tamanho?: number;
          tipo?: string;
        };
        Relationships: [];
      };
      web_vitals: {
        Row: {
          caminho: string;
          criado_em: string;
          dispositivo: string;
          id: number;
          metrica: string;
          navegacao: string | null;
          rating: string;
          valor: number;
          versao_id: string | null;
          visitante_hash: string;
        };
        Insert: {
          caminho: string;
          criado_em?: string;
          dispositivo: string;
          id?: never;
          metrica: string;
          navegacao?: string | null;
          rating: string;
          valor: number;
          versao_id?: string | null;
          visitante_hash: string;
        };
        Update: {
          caminho?: string;
          criado_em?: string;
          dispositivo?: string;
          id?: never;
          metrica?: string;
          navegacao?: string | null;
          rating?: string;
          valor?: number;
          versao_id?: string | null;
          visitante_hash?: string;
        };
        Relationships: [
          {
            foreignKeyName: "web_vitals_versao_id_fkey";
            columns: ["versao_id"];
            isOneToOne: false;
            referencedRelation: "landing_versoes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      descartar_rascunho_landing: { Args: never; Returns: undefined };
      metricas_resumo: {
        Args: { p_fim: string; p_inicio: string };
        Returns: Json;
      };
      publicar_landing: { Args: { p_nota?: string }; Returns: string };
      registrar_lead: {
        Args: {
          p_cargo: string;
          p_email: string;
          p_escola: string;
          p_interesse: string;
          p_ip_hash: string;
          p_mensagem: string;
          p_nome: string;
          p_pagina: string;
          p_utm_campaign: string;
          p_utm_medium: string;
          p_utm_source: string;
        };
        Returns: string;
      };
      registrar_telemetria: {
        Args: {
          p_dispositivo: string;
          p_eventos: Json;
          p_visitante_hash: string;
          p_vitals: Json;
        };
        Returns: undefined;
      };
      reordenar_clientes: { Args: { p_ids: string[] }; Returns: undefined };
      reordenar_conteudos: { Args: { p_ids: string[] }; Returns: undefined };
      restaurar_versao_landing: { Args: { p_id: string }; Returns: string };
      salvar_rascunho_landing: { Args: { p_conteudo: Json }; Returns: string };
      web_vitals_por_versao: {
        Args: { p_inicio: string };
        Returns: {
          amostras: number;
          dispositivo: string;
          metrica: string;
          nota: string;
          p75: number;
          publicado_em: string;
          versao_id: string;
        }[];
      };
      web_vitals_resumo: {
        Args: { p_fim: string; p_inicio: string };
        Returns: {
          amostras: number;
          dispositivo: string;
          metrica: string;
          p75: number;
          pct_bom: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
