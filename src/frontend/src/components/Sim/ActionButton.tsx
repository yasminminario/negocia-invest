import React from 'react';

interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ children, onClick, variant = 'primary', className }) => {
    const base = 'px-4 py-3 rounded-md font-bold inline-flex items-center justify-center';
    const variantClass = variant === 'primary' ? 'bg-[var(--primary-color)] text-white' : variant === 'secondary' ? 'border border-[var(--primary-color)] text-[var(--primary-color)] bg-white' : 'bg-transparent text-[var(--primary-color)]';

    return (
        <button onClick={onClick} className={`${base} ${variantClass} ${className ?? ''}`}>{children}</button>
    );
};
