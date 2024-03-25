import Image from "next/image";


const LoadingPage = () => {
  return (
    <>
      <div className="py-4 flex_col_center gap-4">
        <Image className="rounded-full opacity-20" src="/images/pickContentCTA.webp" alt="icon" height={300} width={300}/>
        <p className="text-slate-400 text-lg capitalize">Select A Subject To Begin!</p>
      </div>
  </>
  )
}

export default LoadingPage;