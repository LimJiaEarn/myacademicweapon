"use client"

import { useState } from "react"
import Thinker from "./thinker";

const page = () => {
  
    const [TEST, setTEST] = useState(0);



  
    return (
    <div className="w-full mx-auto flex flex-col gap-2">

        <button onClick={()=>{
            setTEST(TEST+1);
        }}>
            +1
        </button>

        <p className="w-full text-center">{TEST}</p>
        
        <Thinker Value={TEST} setValue={setTEST} displayText={TEST===5 ? 'Is 5' : 'not 5'}/>



    </div>

    )

}

export default page