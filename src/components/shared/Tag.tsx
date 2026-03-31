import Image from "next/image";

type TagType = {
  title?: string;
  tooltip?: string;
  icon?: string;
  onClickUrl?:string;
};

const Tag = ({ title, tooltip, icon, onClickUrl }: TagType) => {
  
  return (

    <div className={`tooltip flex_center ${onClickUrl ? 'cursor-pointer' : ''}`} data-tooltip={tooltip} onClick={() => {
      try {
        const parsed = new URL(onClickUrl ?? '');
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return;
      } catch { return; }
      window.open(onClickUrl, '_blank', 'noopener,noreferrer');
    }}>
      {icon && <Image src={icon} alt="tag icon" height={28} width={28} className="hover:scale-[1.15]" />}
      {title && <p>{title}</p>}
    </div>
  );
};

export default Tag;
