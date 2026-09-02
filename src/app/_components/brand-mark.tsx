import Image from "next/image";
import logo from "../../../public/miniverso.png";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className="inline-flex min-w-0 items-center gap-[0.7rem] tracking-[-0.04em]"
      href="#top"
    >
      <Image
        alt="Logo da Miniverso"
        className="block size-10.5 shrink-0 rounded-full object-cover max-[620px]:size-9"
        height={compact ? 34 : 42}
        src={logo}
        width={compact ? 34 : 42}
      />
      <span
        className={`min-w-0 font-display uppercase leading-[0.8] tracking-[0.02em] ${
          compact
            ? "text-[1.25rem]"
            : "text-[1.55rem] max-[620px]:text-[1.35rem]"
        }`}
      >
        miniverso
        <small className="mt-[0.35rem] block font-body text-[0.52rem] font-bold uppercase leading-[1.4] tracking-[0.13em] text-brand-cyan">
          educação imersiva
        </small>
      </span>
    </a>
  );
}
