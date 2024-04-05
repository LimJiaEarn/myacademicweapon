"use client"

import Image from "next/image";

// User do not exist

const ErrorPage = () => {
    return (
      <div className="flex flex-col items-center gap-8 px-2 md:px-4 min-h-screen relative">

          {/* User meta datas */}
          <section className="flex flex-col md:flex-row items-center gap-8">

              <div className="relative group w-45 h-45 rounded-full overflow-hidden">
                  <Image src="/images/placeholderDP.webp" alt="profile pic" height={180} width={180} className="rounded-full"/>
              </div>


              <div className="flex_col_center gap-4">
                  <div className="flex_col_center">
                      <h1 className="text-3xl font-bold leading-tight sm:text-3xl sm:leading-normal md:text-4xl md:leading-relaxed">NO USER FOUND</h1>
                      <p className="italic">Did you made a typo?</p>

                  </div>
              </div>

              
          </section>

          
          


      </div>
  )
}

export default ErrorPage