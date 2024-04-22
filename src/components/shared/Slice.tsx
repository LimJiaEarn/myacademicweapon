import React, { useState, useEffect } from 'react';

interface SliceProps {
  value: number;
  percent: number;
  startAngle: number;
  angle: number;
  radius: number;
  hole: number;
  trueHole: number;
  fill: string;
  strokeWidth: number;
  showLabel: boolean;
}

const Slice: React.FC<SliceProps> = ({
  value,
  percent,
  startAngle,
  angle,
  radius,
  hole,
  trueHole,
  fill,
  strokeWidth,
  showLabel
}) => {
  const [path, setPath] = useState('');
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const getAnglePoint = (startAngle: number, endAngle: number, radius: number, x: number, y: number) => {
    const x1 = x + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = y + radius * Math.sin((Math.PI * startAngle) / 180);
    const x2 = x + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = y + radius * Math.sin((Math.PI * endAngle) / 180);

    return { x1, y1, x2, y2 };
  };

  useEffect(() => {
    const draw = (s: number) => {
      if (s > angle) s = angle;

      const { x1, y1, x2, y2 } = getAnglePoint(startAngle, startAngle + s, radius, radius, radius);
      const { x1: bx1, y1: by1, x2: bx2, y2: by2 } = getAnglePoint(startAngle, startAngle + s, radius - hole, radius, radius);

      let d = [
        `M${x1},${y1}`, // Move to start
        `A${radius},${radius} 0 ${s > 180 ? 1 : 0},1 ${x2},${y2}`, // Arc to end
        `L${bx2},${by2}`, // Line to inner arc
        `A${radius - hole},${radius - hole} 0 ${s > 180 ? 1 : 0},0 ${bx1},${by1}`, // Inner arc
        "Z" // Close path
      ].join(' ');

      setPath(d);

      if (s < angle) {
        setTimeout(() => draw(s + (angle / 30)), 16);
      } else if (showLabel && percent > 5) {
        // Update label coordinates only if the label should be shown and is meaningful (more than 5%)
        const { x2: labelX, y2: labelY } = getAnglePoint(startAngle, startAngle + angle / 2, radius / 2 + trueHole / 2, radius, radius);
        setCoords({ x: labelX, y: labelY });
      }
    };

    draw(0);
  }, [startAngle, angle, radius, hole, trueHole, showLabel, percent]);

  return (
    <g>
      <path d={path} fill={fill} stroke={fill} strokeWidth={strokeWidth} />
      {showLabel && percent > 5 && (
        <text x={coords.x} y={coords.y} fill="#fff" textAnchor="middle">
          {`${percent.toFixed(1)}%`}
        </text>
      )}
    </g>
  );
};

export default Slice;
