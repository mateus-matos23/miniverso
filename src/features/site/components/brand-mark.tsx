import Image from "next/image";
import { cn } from "@/lib/utils";
import logoColor from "../../../../public/brand/logo-horizontal-color.webp";
import logoWhite from "../../../../public/brand/logo-horizontal-white.webp";

type BrandMarkProps = {
  tone?: "white" | "color";
  href?: string;
  className?: string;
  preload?: boolean;
};

/** Logo horizontal oficial. A área de respiro segue a regra do "o" do manual. */
export function BrandMark({
  tone = "white",
  href = "/",
  className,
  preload = false,
}: BrandMarkProps) {
  return (
    <a
      className={cn("inline-flex shrink-0 items-center p-1", className)}
      href={href}
    >
      <Image
        alt="Miniverso"
        className="h-7 w-auto sm:h-8"
        preload={preload}
        sizes="200px"
        src={tone === "white" ? logoWhite : logoColor}
      />
    </a>
  );
}
