import { useNavigate } from "react-router-dom";

import { useAuth, type ProfileType } from "@/contexts/AuthContext";

const profiles: Array<{
    key: ProfileType;
    title: string;
    description: string;
    accent: string;
}> = [
        {
            key: "tomador",
            title: "Perfil de Tomador",
            description: "Ideal para quem busca empréstimos personalizados com possibilidade de negociação.",
            accent: "from-[#57D9FF]/10 to-transparent border-[#57D9FF]",
        },
        {
            key: "investidor",
            title: "Perfil de Investidor",
            description: "Acompanhe solicitações e negociações para maximizar seus retornos.",
            accent: "from-[#9B59B6]/10 to-transparent border-[#9B59B6]",
        },
    ];

const ProfileSelectionScreen = () => {
    const navigate = useNavigate();
    const { switchProfile } = useAuth();

    const handleSelectProfile = (profile: ProfileType) => {
        switchProfile(profile);
        navigate(`/app/${profile}/dashboard`, { replace: true });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
            <div className="w-full max-w-3xl space-y-8">
                <header className="text-center">
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Escolha como deseja usar a negocia.ai hoje
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Você pode alternar entre os perfis a qualquer momento.
                    </p>
                </header>

                <div className="grid gap-6 md:grid-cols-2">
                    {profiles.map(({ key, title, description, accent }) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => handleSelectProfile(key)}
                            className={`group relative overflow-hidden rounded-3xl border bg-white p-8 text-left shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${accent}`}
                        >
                            <span className="absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-100" />
                            <div className="relative space-y-3">
                                <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
                                <p className="text-sm text-slate-600">{description}</p>
                                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    Acessar dashboard
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProfileSelectionScreen;
