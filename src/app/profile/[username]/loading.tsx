
const LoadingProfilePage = () => {



  return (
    <div className="max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row justify-start gap-4 md:gap-6 px-2 md:px-4 py-2">

    {/* Profile Page Side Bar (lg) */}
    <section className="bg-pri_bg_card rounded-xl w-full px-6 md:px-4 py-4 md:py-6 flex flex-col justify-start gap-4 md:gap-6 lg:max-w-[340px]">
    
        <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center gap-4 md:gap-6">

        </div>

        
        <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
        
          <div className="h-[250px] w-full">

          </div>

        <hr className="h-0.5 border-t-0 bg-transparent bg-gradient-to-r from-transparent via-pri_mint_darker to-transparent opacity-45" />
        
        <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-center lg:items-start gap-4 md:gap-6">

            <p className="w-full text-center text-pri_navy_dark font-bold text-lg lg:text-xl">Don't count the days;<br className="hidden lg:flex"/> Make the days count</p>

        </div>





    </section>

    {/* Profile Page Client Components */}
    <section className="w-full flex-grow">

        <div className="h-[150px] w-full p-4 bg-pri_bg_card">
        </div>

        <div className="min-h-screen w-full p-4 bg-pri_bg_card">

        </div>

    </section>
    

</div>
  )
}

export default LoadingProfilePage