
const TestPage = () => {



  return (
    <div className="max-auto grid grid-rows-5 grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 px-2 md:px-4 min-h-screen max-w-[1800px]">

    {/* User Profile */}
    <section className="bg-pri_navy_main rounded-xl row-span-4 col-span-1">

    </section>

    {/* More Stats */}
    <section className="bg-pri_mint_main rounded-xl row-span-1 col-span-2">

    </section>

    {/* More Stats */}
    <section className="bg-pri_red_main rounded-xl row-span-1 col-span-2">

    </section>

    {/* Bookmarks/Completed - https://ui.shadcn.com/docs/components/tabs*/}
    <section className="rounded-xl row-span-4 col-span-4">

      <div className="h-full w-full grid grid-rows-5 gap-2">

        <p className="bg-pri_red_lighter row-span-1 w-full text-center">Test1</p>
        <p className="bg-pri_red_light row-span-1 w-full text-center">Test2</p>
        <p className="bg-pri_red_main row-span-1 w-full text-center">Test3</p>
        <p className="bg-pri_red_dark row-span-1 w-full text-center">Test4</p>
        <p className="bg-pri_red_darker row-span-1 w-full text-center">Test5</p>


      </div>

    </section>


</div>
  )
}

export default TestPage