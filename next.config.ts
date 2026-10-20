import type { NextConfig } from "next";

const producao = process.env.NODE_ENV === "production";

// Mídias da biblioteca, logos de clientes e o cliente Supabase falam com esta origem.
// Sem a variável (build sem .env) ela simplesmente fica de fora da CSP.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const urlSupabase = supabaseUrl ? new URL(supabaseUrl) : null;
const origemSupabase = urlSupabase?.origin ?? null;
const supabase = origemSupabase ? [origemSupabase] : [];
const supabaseWs = origemSupabase
  ? [origemSupabase.replace(/^https:/, "wss:")]
  : [];

// Imagens da biblioteca de mídia (bucket público `site`) passam pelo otimizador.
// Sem `search`: a URL pública não leva query string, e o padrão fixa só host e caminho.
const imagensSupabase: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = urlSupabase
  ? [
      {
        protocol: urlSupabase.protocol === "http:" ? "http" : "https",
        hostname: urlSupabase.hostname,
        port: urlSupabase.port,
        pathname: "/storage/v1/object/public/**",
      },
    ]
  : [];

const diretiva = (nome: string, ...fontes: string[]) =>
  [nome, ...fontes].join(" ");

// Sem nonce de propósito: as páginas são estáticas/ISR, e um nonce por requisição
// forçaria renderização dinâmica em todas elas. Por isso 'unsafe-inline' em script/style.
const contentSecurityPolicy = [
  diretiva("default-src", "'self'"),
  // 'unsafe-eval' só em dev: o React usa eval para reconstruir stacks de erro.
  diretiva(
    "script-src",
    "'self'",
    "'unsafe-inline'",
    ...(producao ? [] : ["'unsafe-eval'"]),
  ),
  diretiva("style-src", "'self'", "'unsafe-inline'"),
  diretiva("img-src", "'self'", "data:", "blob:", ...supabase),
  diretiva("media-src", "'self'", "blob:", ...supabase),
  diretiva("font-src", "'self'", "data:"),
  diretiva("connect-src", "'self'", ...supabase, ...supabaseWs),
  // A pré-visualização da landing é embutida em iframe pelo próprio admin.
  diretiva("worker-src", "'self'"),
  diretiva("manifest-src", "'self'"),
  diretiva("frame-ancestors", "'self'"),
  diretiva("base-uri", "'self'"),
  diretiva("form-action", "'self'"),
  diretiva("object-src", "'none'"),
  ...(producao ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: imagensSupabase,
    formats: ["image/avif", "image/webp"],
    // 31 dias: poupa transformações e escritas em cache no plano gratuito da Vercel.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // CSS no <head> em vez de <link>: tira o request que bloqueava a renderização.
    inlineCss: true,
    optimizePackageImports: ["lucide-react", "motion"],
  },
  async headers() {
    const cabecalhos: { key: string; value: string }[] = [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];

    // HSTS só em produção: em dev o localhost roda em http e o header prenderia o navegador.
    if (producao) {
      cabecalhos.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      });
    }

    return [
      { source: "/:path*", headers: cabecalhos },
      // O navegador precisa revalidar o service worker a cada visita para pegar atualizações.
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
