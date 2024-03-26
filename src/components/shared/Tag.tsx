import Image from "next/image";

type TagType = {
  title?: string;
  tooltip?: string;
  icon?: string;
  onClickUrl?:string;
};

const Tag = ({ title, tooltip, icon, onClickUrl }: TagType) => {
  return (
    <div className={`tooltip flex_center ${onClickUrl ? 'cursor-pointer' : ''}`} data-tooltip={tooltip} onClick={() => {window.open(onClickUrl, '_blank');}}>
      {icon && <Image src={icon} alt="tag icon" height={24} width={24} />}
      {title && <p>{title}</p>}
    </div>
  );
};

export default Tag;
