"use client"

import { addPracticeNo } from '@/utils/oneTime';

const page = () => {
  return (
    <div><button onClick={()=>{
        try{
      
          addPracticeNo()
          alert("Success");
        }
        catch(error){
          alert("Error");
        }
      
      }}>
        Danger
      </button></div>
  )
}

export default page