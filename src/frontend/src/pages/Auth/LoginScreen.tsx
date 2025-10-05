import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

const LoginScreen = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setError(null);

            // TODO: integrar com backend real de autenticação
            await login({
                id: "1",
                name: "Carlos Silva",
                email: email || "carlos@email.com",
                profiles: ["tomador", "investidor"],
                defaultProfile: "tomador",
            });

            navigate("/app/selecao-perfil", { replace: true });
        } catch (err) {
            console.error("Erro ao realizar login", err);
            setError("Não foi possível autenticar. Tente novamente.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
                <h1 className="text-2xl font-semibold text-gray-900">Acesse sua conta</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Autentique-se para acessar a plataforma negocia.ai.
                </p>

                <div className="mt-8 space-y-4">
                    <label className="block text-sm font-medium text-gray-700">
                        E-mail
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="seu@email.com"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#57D9FF] focus:ring-2 focus:ring-[#57D9FF]/20"
                        />
                    </label>

                    <label className="block text-sm font-medium text-gray-700">
                        Senha
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="********"
                            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#57D9FF] focus:ring-2 focus:ring-[#57D9FF]/20"
                        />
                    </label>
                </div>

                {error ? (
                    <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                ) : null}

                <button
                    type="button"
                    onClick={handleLogin}
                    className="mt-8 w-full rounded-full bg-[#57D9FF] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#3dcaf4]"
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};

export default LoginScreen;
