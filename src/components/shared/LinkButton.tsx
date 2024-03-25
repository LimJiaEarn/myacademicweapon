import Image from "next/image";
import Link from "next/link";

type LinkButtonParams = {
    iconUrl:string;
    buttonMsg:string;
    buttonColorClass: string;
    linksTo: string;
}


const LinkButton = ({iconUrl, buttonMsg, buttonColorClass, linksTo} : LinkButtonParams) => {


  return (
    <>
        <Link href={linksTo} >
            <div className={`flex_center px-4 py-2 gap-2 cursor-pointer rounded-xl bg-gradient-to-r transition-all duration-300 ease-in-out ${buttonColorClass? buttonColorClass : ''}`}>
              {iconUrl && <Image alt="buttonIcon" src={iconUrl} height={20} width={20}/>}
              
              <p className="text-white font-weight-500 text-lg">{buttonMsg}</p>
            </div>
        </Link>
    </>

  )
}

export default LinkButton