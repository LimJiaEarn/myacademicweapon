"use client"

import { useState } from 'react';

import Pie from '@/components/shared/Piechart';

const Page = () => {

  const [goal, setGoal] = useState<number>(10);

  const completed = 5

  const percentShade = Math.min(100, (completed/goal) * 100); 
  const data = percentShade==100 ? [100] : [percentShade, 100 - percentShade];
  const colors =  percentShade==100 ? ['#43A19E'] : ['#43A19E', '#ccc'];
  const radius = 150;
  const hole = 130;
  const strokeWidth = 5;
  const innerText = `${completed}/${goal}`;

  return (
    <div className="flex_center gap-4">

      <input
        type="number"
        onChange={(e)=>{
          setGoal(Number(e.target.value));
        }}
      />
      
      <Pie
        data={goal > 0? data : [50, 50]}
        colors={colors}
        radius={radius}
        hole={hole}
        strokeWidth={strokeWidth}
        innerText={goal > 0? innerText : 'No Goal Set'}
      />
    </div>
  );
};

export default Page;
