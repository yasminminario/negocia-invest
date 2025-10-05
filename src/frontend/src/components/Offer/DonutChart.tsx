import React, { useEffect, useState } from 'react';

interface Slice {
    label: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    slices: Slice[];
    size?: number;
    strokeWidth?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ slices, size = 180, strokeWidth = 24 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const total = slices.reduce((s, c) => s + c.value, 0) || 1;

    // compute cumulative offsets
    const segments = slices.map((slice) => ({
        ...slice,
        dash: (slice.value / total) * circumference,
    }));

    // animation state: progress 0..1
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 30); // small delay to trigger CSS transitions
        return () => clearTimeout(t);
    }, [slices]);

    let offsetAcc = 0;

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <style>{`
                        .donut-seg { transition: stroke-dashoffset 700ms cubic-bezier(.2,.9,.3,1), opacity 500ms ease; transform-origin: 50% 50%; }
                    `}</style>
                </defs>
                <g transform={`translate(${size / 2}, ${size / 2})`}>
                    {segments.map((seg, idx) => {
                        const strokeDasharray = `${seg.dash} ${circumference - seg.dash}`;
                        const baseOffset = offsetAcc;
                        const animatedOffset = ready ? -baseOffset : circumference; // animate from full circle to target offset

                        const circle = (
                            <circle
                                key={idx}
                                r={radius}
                                cx={0}
                                cy={0}
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={animatedOffset}
                                strokeLinecap="butt"
                                transform="rotate(-90)"
                                className="donut-seg"
                                style={{ transitionDelay: `${idx * 120}ms` }}
                            />
                        );

                        offsetAcc += seg.dash;
                        return circle;
                    })}

                    <circle r={radius} cx={0} cy={0} fill="transparent" stroke="rgba(255,255,255,0.92)" strokeWidth={Math.max(6, strokeWidth - 6)} />
                </g>
            </svg>

            <div className="mt-3 grid grid-cols-1 gap-1 text-sm w-full max-w-[220px]">
                {slices.map((s, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                        <span className="text-xs text-gray-600 truncate">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DonutChart;
