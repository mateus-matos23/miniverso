import { getLanding } from "@/features/landing/data";
import { Landing } from "@/features/site/components/landing";

// Clientes publicados no admin entram na landing em até 5 minutos
// (ou imediatamente, via revalidatePath nas actions do admin).
export const revalidate = 300;

export default async function Home() {
  const { doc, versaoId } = await getLanding();

  return <Landing doc={doc} versaoId={versaoId} />;
}
