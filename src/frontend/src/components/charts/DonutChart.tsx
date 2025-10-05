import React from 'react';
import { formatCurrency } from '@/utils/calculations';

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  className?: string;
  showLegend?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, className, showLegend = true }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let currentAngle = -90; // Start at top

  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="15"
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          
          const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
          const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
          const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
          const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M 50 50`,
            `L ${x1} ${y1}`,
            `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `Z`
          ].join(' ');
          
          currentAngle = endAngle;
          
          return (
            <path
              key={index}
              d={pathData}
              fill={item.color}
              opacity="0.9"
            />
          );
        })}
        
        {/* Inner white circle */}
        <circle cx="50" cy="50" r="25" fill="white" />
      </svg>
      
      {/* Legend */}
      {showLegend && (
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
