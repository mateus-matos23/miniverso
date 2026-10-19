import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt =
  "Miniverso — educação através da realidade virtual. Logo da Miniverso sobre o gradiente da marca.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [thunder, grotesk, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/og/Thunder-BoldLC.ttf")),
    readFile(join(process.cwd(), "assets/og/RG-StandardMedium.ttf")),
    readFile(join(process.cwd(), "public/brand/logo-horizontal-white.png")),
  ]);
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        color: "#fbfcff",
        backgroundColor: "#0c0407",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.85) 0%, rgba(0,183,227,0.8) 14%, rgba(30,68,136,0) 48%), linear-gradient(115deg, #1e4488 0%, #1e1645 50%, #0c0407 88%)",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse exige <img> */}
      <img
        alt=""
        height={52}
        src={logoSrc}
        style={{ alignSelf: "flex-end" }}
        width={317}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontFamily: "Thunder",
            fontSize: 128,
            lineHeight: 0.88,
            maxWidth: 860,
          }}
        >
          Educação que acontece dentro da realidade virtual
        </div>
        <div style={{ fontFamily: "Grotesk", fontSize: 30, color: "#afbdd8" }}>
          Realidade virtual · gamificação · aprendizagem socioemocional
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Thunder", data: thunder, style: "normal", weight: 700 },
        { name: "Grotesk", data: grotesk, style: "normal", weight: 500 },
      ],
    },
  );
}
