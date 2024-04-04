import Image from "next/image";
import Link from "next/link";

type LinkButtonParams = {
    iconUrl?:string;
    buttonMsg:string;
    buttonColorClass: string;
    linksTo: string;
}


const LinkButton = ({iconUrl, buttonMsg, buttonColorClass, linksTo} : LinkButtonParams) => {


  return (
    <>    
      <Link href={linksTo} >
          <div className={`flex_center px-6 py-3 gap-2 cursor-pointer rounded-full bg-gradient-to-r transition-all duration-300 ease-in-out ${buttonColorClass? buttonColorClass : ''}`}>
            <p className="text-white font-weight-500 text-md md:text-lg text-center">{buttonMsg}</p>
            {iconUrl && <Image alt="buttonIcon" src={iconUrl} height={20} width={20}/>}

          </div>
      </Link>
    </>

  )
}

export default LinkButton