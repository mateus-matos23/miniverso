export function DetectorEvent() {
  return (
    <div className="relative min-h-136 px-0 pb-10 pt-1 before:pointer-events-none before:absolute before:inset-y-0 before:left-[12%] before:right-[12%] before:border-x before:border-[rgba(175,189,216,0.25)] before:border-y-0 before:content-[''] after:pointer-events-none after:absolute after:inset-x-0 after:bottom-[12%] after:top-[12%] after:border-y after:border-[rgba(175,189,216,0.25)] after:border-x-0 after:content-[''] max-[620px]:min-h-92">
      <div className="absolute left-[4%] top-[5%] grid max-w-[42%] gap-[0.35rem] text-[0.58rem] uppercase leading-normal tracking-widest text-brand-muted max-[620px]:text-[0.48rem]">
        <span>evento / 001</span>
        <strong className="text-[0.7rem] font-bold text-brand-white max-[620px]:text-[0.57rem]">
          aprendizagem em movimento
        </strong>
      </div>
      <svg
        aria-hidden="true"
        className="mx-auto block size-[min(52vw,620px)] max-w-full overflow-visible max-[900px]:size-[min(82vw,620px)]"
        fill="none"
        viewBox="0 0 620 620"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-[#203866] stroke-1 [stroke-dasharray:2_12]"
          cx="310"
          cy="310"
          r="276"
        />
        <circle
          className="stroke-[#31548a] stroke-5 [stroke-dasharray:36_8_4_8]"
          cx="310"
          cy="310"
          r="224"
        />
        <circle
          className="stroke-[#203866] stroke-1 [stroke-dasharray:2_12]"
          cx="310"
          cy="310"
          r="174"
        />
        <circle
          className="stroke-[#5279ae] stroke-1 [stroke-dasharray:2_8]"
          cx="310"
          cy="310"
          r="104"
        />
        <path
          className="stroke-brand-cyan stroke-2 [stroke-linecap:round]"
          d="M310 310C364 246 444 143 582 94"
        />
        <path
          className="stroke-brand-cyan stroke-2 [stroke-linecap:round]"
          d="M310 310C400 328 487 370 583 483"
        />
        <path
          className="stroke-[#f4c84a] stroke-2 [stroke-linecap:round]"
          d="M310 310C259 241 171 162 62 132"
        />
        <path
          className="stroke-[#f4c84a] stroke-2 [stroke-linecap:round]"
          d="M310 310C253 363 166 448 83 528"
        />
        <path
          className="stroke-[#83a7ff] stroke-2 [stroke-linecap:round]"
          d="M310 310C311 235 321 130 337 31"
        />
        <path
          className="stroke-[#83a7ff] stroke-2 [stroke-linecap:round]"
          d="M310 310C236 317 133 328 27 355"
        />
        <circle
          className="fill-brand-cyan stroke-brand-white stroke-3"
          cx="310"
          cy="310"
          r="13"
        />
        <circle
          className="animate-detector-pulse stroke-brand-cyan stroke-1 motion-reduce:animate-none"
          cx="310"
          cy="310"
          r="24"
        />
        <path
          className="stroke-1 stroke-[rgba(175,189,216,0.4)] [stroke-dasharray:1_10]"
          d="M34 310H586M310 34V586"
        />
      </svg>
      <div className="absolute bottom-4 right-[4%] grid max-w-[42%] gap-[0.35rem] text-right text-[0.58rem] uppercase leading-normal tracking-widest text-brand-muted max-[620px]:text-[0.48rem]">
        <span>trilhas ativas</span>
        <strong className="text-[0.7rem] font-bold text-brand-white max-[620px]:text-[0.57rem]">
          VR · GAME · PESSOAS
        </strong>
      </div>
      <span className="absolute right-[7%] top-[25%] text-[0.58rem] uppercase tracking-widest text-brand-cyan max-[620px]:text-[0.48rem]">
        01 / explorar
      </span>
      <span className="absolute left-[5%] top-[49%] text-[0.58rem] uppercase tracking-widest text-[#f4c84a] max-[620px]:text-[0.48rem]">
        02 / experimentar
      </span>
      <span className="absolute bottom-[23%] left-[14%] text-[0.58rem] uppercase tracking-widest text-[#83a7ff] max-[620px]:text-[0.48rem]">
        03 / transformar
      </span>
    </div>
  );
}
