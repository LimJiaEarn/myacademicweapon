import Image from "next/image";
import Link from "next/link";

type LinkButtonParams = {
    iconUrl?:string;
    buttonMsg:string;
    buttonMsgClass?: string;
    buttonColorClass?: string;
    linksTo: string;
}


const LinkButton = ({iconUrl, buttonMsg, buttonMsgClass, buttonColorClass, linksTo} : LinkButtonParams) => {


  return (
    <>    
      <Link href={linksTo} >
          <div
            className={`flex_center gap-2 cursor-pointer rounded-full transition-all duration-300 ease-in-out ${buttonColorClass? buttonColorClass : ''}`}
          >
            
            <p className={`text-center ${buttonMsgClass? buttonMsgClass : 'text-white font-weight-500 text-md md:text-lg '}`}>{buttonMsg}</p>
            {iconUrl && <Image alt="buttonIcon" src={iconUrl} height={20} width={20}/>}

          </div>
      </Link>
    </>

  )
}

export default LinkButton