import React from 'react';

interface SliderControlProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    suggestedRange?: [number, number];
    suffix?: string;
}

export const SliderControl: React.FC<SliderControlProps> = ({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    suggestedRange,
    suffix,
}) => {
    const percent = ((value - min) / (max - min)) * 100;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-baseline">
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-lg font-bold">{value.toLocaleString('pt-BR')}{suffix ?? ''}</div>
            </div>
            <div className="mt-3">
                <div className="relative">
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="w-full"
                        aria-label={label}
                    />
                    <div className="absolute -top-7 left-[calc(${percent}% - 24px)]">
                        <div className="bg-white border rounded px-2 py-1 text-xs shadow">{value}{suffix ?? ''}</div>
                    </div>
                    {suggestedRange && (
                        <div className="pointer-events-none absolute inset-0 top-5">
                            <div className="h-2 rounded-full bg-[#E6EEF9]">
                                <div
                                    className="h-2 rounded-full"
                                    style={{
                                        marginLeft: `${((suggestedRange[0] - min) / (max - min)) * 100}%`,
                                        width: `${((suggestedRange[1] - suggestedRange[0]) / (max - min)) * 100}%`,
                                        background: 'linear-gradient(90deg, rgba(87,217,255,0.2), rgba(155,89,182,0.2))',
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {suggestedRange && (
                    <div className="mt-6 flex justify-between text-xs text-gray-500">
                        <div>Zona sugerida: {suggestedRange[0]}%</div>
                        <div>{suggestedRange[1]}%</div>
                    </div>
                )}
            </div>
        </div>
    );
};
