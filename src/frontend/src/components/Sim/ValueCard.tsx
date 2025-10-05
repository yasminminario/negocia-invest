import React from 'react';

interface ValueCardProps {
    title: string;
    value: React.ReactNode;
    subtitle?: string;
    accent?: 'normal' | 'positive' | 'negative';
}

export const ValueCard: React.FC<ValueCardProps> = ({ title, value, subtitle, accent = 'normal' }) => {
    const accentClass = accent === 'positive' ? 'text-green-600 bg-green-50' : accent === 'negative' ? 'text-red-600 bg-red-50' : 'text-gray-900 bg-white';

    return (
        <div className={`p-4 rounded-lg shadow-sm ${accentClass}`}>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-bold mt-2">{value}</div>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
    );
};
