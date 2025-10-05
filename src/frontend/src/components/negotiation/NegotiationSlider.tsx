import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NegotiationSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  suggestedMin: number;
  suggestedMax: number;
  step?: number;
  className?: string;
}

export const NegotiationSlider: React.FC<NegotiationSliderProps> = ({
  value,
  onChange,
  min,
  max,
  suggestedMin,
  suggestedMax,
  step = 0.01,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Calcula as posições percentuais
  const valuePercent = ((value - min) / (max - min)) * 100;
  const suggestedMinPercent = ((suggestedMin - min) / (max - min)) * 100;
  const suggestedMaxPercent = ((suggestedMax - min) / (max - min)) * 100;

  // Verifica se o valor está dentro da zona sugerida
  const isInSuggestedZone = value >= suggestedMin && value <= suggestedMax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Rótulo com valor atual */}
      <div className="flex items-center justify-center mb-4">
        <div className={cn(
          'text-3xl font-bold',
          isInSuggestedZone ? 'text-success' : 'text-primary'
        )}>
          {value.toFixed(2).replace('.', ',')}% a.m.
        </div>
      </div>

      {/* Container do slider */}
      <div className="relative h-12">
        {/* Track de fundo com todas as camadas dentro */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full h-3 bg-muted rounded-full overflow-hidden">
          {/* Camada 1: Zona sugerida (verde) - sempre visível e maior */}
          <div
            className="absolute h-full bg-success/50 border-y-2 border-success/70"
            style={{
              left: `${suggestedMinPercent}%`,
              width: `${suggestedMaxPercent - suggestedMinPercent}%`,
              zIndex: 1,
            }}
          />
          
          {/* Camada 2: Track preenchido até o valor atual - passa por cima */}
          <div
            className={cn(
              'absolute h-full transition-colors',
              isInSuggestedZone ? 'bg-success' : 'bg-primary'
            )}
            style={{
              width: `${valuePercent}%`,
              zIndex: 2,
            }}
          />
        </div>

        {/* Input range nativo (invisível mas funcional) */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-1/2 -translate-y-1/2 w-full h-12 opacity-0 cursor-pointer z-10"
        />

        {/* Thumb customizado */}
        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 bg-background transition-all pointer-events-none',
            isInSuggestedZone ? 'border-success' : 'border-primary',
            isDragging && 'scale-125'
          )}
          style={{
            left: `${valuePercent}%`,
          }}
        />
      </div>

      {/* Labels min/max e zona sugerida */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
        <span>{min.toFixed(2)}%</span>
        <span className="text-success font-medium">
          Zona sugerida: {suggestedMin.toFixed(2)}% à {suggestedMax.toFixed(2)}%
        </span>
        <span>{max}%</span>
      </div>
    </div>
  );
};
