import type { NextConfig } from "next";

// Vídeos de conteúdo vão até 50 MB; a folga cobre o overhead do multipart.
const uploadBodyLimit = "51mb";

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

// Imagens do Storage passam pelo otimizador. Os caminhos cobrem as URLs públicas
// (biblioteca do site) e as assinadas (logos e mídias de projetos). Sem `search`
// de propósito: as URLs assinadas levam ?token=, e o padrão fixa só host e caminho.
const imagensSupabase: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = urlSupabase
  ? ["/storage/v1/object/public/**", "/storage/v1/object/sign/**"].map(
      (pathname) => ({
        protocol: urlSupabase.protocol === "http:" ? "http" : "https",
        hostname: urlSupabase.hostname,
        port: urlSupabase.port,
        pathname,
      }),
    )
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
    serverActions: { bodySizeLimit: uploadBodyLimit },
    // O proxy cobre /admin e, acima do limite, entregaria o body truncado.
    proxyClientMaxBodySize: uploadBodyLimit,
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

    return [{ source: "/:path*", headers: cabecalhos }];
  },
};

export default nextConfig;
