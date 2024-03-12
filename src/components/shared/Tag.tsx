import Image from "next/image";

type TagType = {
  title?: string;
  tooltip?: string;
  icon?: string;
};

const Tag = ({ title, tooltip, icon }: TagType) => {
  return (
    <div className="tooltip flex_center" data-tooltip={tooltip}>
      {icon && <Image src={icon} alt="tag icon" height={24} width={24} />}
      {title && <p>{title}</p>}
    </div>
  );
};

export default Tag;
