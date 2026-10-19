import type { NextConfig } from "next";

// Vídeos de conteúdo vão até 50 MB; a folga cobre o overhead do multipart.
const uploadBodyLimit = "51mb";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: { bodySizeLimit: uploadBodyLimit },
    // O proxy cobre /admin e, acima do limite, entregaria o body truncado.
    proxyClientMaxBodySize: uploadBodyLimit,
  },
};

export default nextConfig;
