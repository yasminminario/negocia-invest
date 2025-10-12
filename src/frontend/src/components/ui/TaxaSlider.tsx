export default function TaxaSlider({ value, onChange }: { value: number | string; onChange: (v: number) => void }) {
    const numeric = Number(value) || 0
    const pct = (v: number) => `${v.toFixed(1)}%`
    const marks = [1.1, 2, 3, 5, 7, 10]

    return (
        <div className="w-full">
            <div className="flex items-center gap-4">
                <input
                    type="range"
                    min={1.1}
                    max={10}
                    step={0.1}
                    value={numeric}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full"
                />
                <div className="w-20 text-right font-medium">{numeric ? pct(numeric) : "—"}</div>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                {marks.map((m) => (
                    <div key={m} className="flex-1 text-center">
                        {m}
                    </div>
                ))}
            </div>
        </div>
    )
}
