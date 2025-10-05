import type { ReactNode } from "react";

interface PagePlaceholderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export const PagePlaceholder = ({
    title,
    description = "Conteúdo em desenvolvimento.",
    actions,
}: PagePlaceholderProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="space-y-4 text-center">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                <p className="text-gray-600">{description}</p>
                {actions ? <div className="flex items-center justify-center gap-2">{actions}</div> : null}
            </div>
        </div>
    );
};
