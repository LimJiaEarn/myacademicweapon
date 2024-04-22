"use client"

import React from 'react';
import Slice from '@/components/shared/Slice';  // Adjust the import path as needed

interface PieProps {
  radius: number;
  data: number[];
  colors: string[];
  hole: number;
  strokeWidth: number;
}

const Pie: React.FC<PieProps> = ({ radius, data, colors, hole, strokeWidth }) => {
  const sum = data.reduce((acc, curr) => acc + curr, 0);
  let startAngle = 0;

  // Calculate adjusted dimensions
  const extraPadding = strokeWidth * 2;  // Add extra padding equal to twice the stroke width
  const viewBoxDimension = radius * 2 + extraPadding;
  const viewBoxOffset = -extraPadding / 2;

  return (
    <svg
      width={viewBoxDimension}
      height={viewBoxDimension}
      viewBox={`${viewBoxOffset} ${viewBoxOffset} ${viewBoxDimension} ${viewBoxDimension}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {data.map((item, index) => {
        const angle = (item / sum) * 360;
        const slice = (
          <Slice
            key={index}
            value={item}
            percent={(item / sum) * 100}
            startAngle={startAngle}
            angle={angle}
            radius={radius}
            hole={radius - hole}
            trueHole={hole}
            fill={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            showLabel={true}
          />
        );
        startAngle += angle;  // Update startAngle for the next slice
        return slice;
      })}
    </svg>
  );
};

export default Pie;

