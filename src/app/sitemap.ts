import type { MetadataRoute } from "next";
import { getPublishedConteudoSlugs } from "@/features/projects/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projetos = await getPublishedConteudoSlugs();

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projetos.map((projeto) => ({
      url: `${site.url}/projetos/${projeto.slug}`,
      lastModified: projeto.atualizadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
