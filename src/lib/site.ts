import { env } from "@/config/env";

export const site = {
  name: "Miniverso",
  title: "Miniverso — educação através da realidade virtual",
  description:
    "A Miniverso cria experiências de aprendizagem em realidade virtual e gamificação para escolas, professores e alunos: aprendizado seguro, criativo e socioemocional.",
  url: env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""),
  locale: "pt_BR",
  contact: {
    email: "miniversoedtech@gmail.com",
    phone: "+55 98 98811-8091",
    phoneHref: "tel:+5598988118091",
    instagram: "https://www.instagram.com/meuminiverso/",
    instagramHandle: "@meuminiverso",
    city: "São Luís",
    region: "Maranhão",
    regionCode: "MA",
    country: "BR",
  },
} as const;
