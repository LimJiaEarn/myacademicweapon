
import Link from "next/link";



// Tutorial Referenced: https://www.youtube.com/watch?v=ukpgxEemXsk&t=6s
const TableOfResources = ( {searchParams} : {searchParams : { [key:string]:string | undefined}} ) => {



    const test1 = searchParams.test1;
    const test2 = searchParams.test2;


        
    return (
        <div className="flex_col_center gap-2 pb-[1000px]">
            <p className="text-xl">{test1}</p>
            <p className="text-xl">{test2}</p>
            
            <Link href={`?${new URLSearchParams({
                test1:"5sdv/j&*%^",
                test2:"2ve"
            })}`}>
                5, 2
            </Link>


        </div>
    )
}

export default TableOfResources