
import Link from "next/link";



// Tutorial Referenced: https://www.youtube.com/watch?v=ukpgxEemXsk&t=6s

const TableOfResources = ( {searchParams} : {searchParams : { [key:string]:string | undefined}} ) => {

    const subject = searchParams.subject;
    const resourceType = searchParams.resourceType;


        
    return (
        <div className="flex_col_center gap-2 pb-[1000px]">
            <p className="text-xl">{subject}</p>
            <p className="text-xl">{resourceType}</p>
            



        </div>
    )
}

export default TableOfResources