import Image from "next/image";

type TagType = {
  title?: string;
  tooltip?: string;
  icon?: string;
  onClickUrl?: string;
};

const Tag = ({ title, tooltip, icon, onClickUrl }: TagType) => {
  return (
    <button
      type="button"
      className={`tooltip inline-flex items-center justify-center gap-1.5 h-8 rounded-lg border border-hairline bg-white text-pri_mint_darker transition ease-in-out duration-150 hover:border-pri_mint_main hover:bg-pri_mint_main/10 hover:-translate-y-0.5 ${
        title ? "px-2.5" : "w-8"
      } ${onClickUrl ? "cursor-pointer" : ""}`}
      data-tooltip={tooltip}
      onClick={(e) => {
        e.stopPropagation();
        try {
          const parsed = new URL(onClickUrl ?? "");
          if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
        } catch {
          return;
        }
        window.open(onClickUrl, "_blank", "noopener,noreferrer");
      }}
    >
      {icon && <Image src={icon} alt="tag icon" height={18} width={18} />}
      {title && <span className="text-xs font-semibold">{title}</span>}
    </button>
  );
};

export default Tag;
