import { useCallback, useState } from "react";

import { api } from "@/services/api";
import type { Loan } from "@/types";

export const useLoans = () => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.getLoans();
            setLoans(data);
        } catch (err) {
            console.error("Erro ao buscar empréstimos", err);
            setError("Não foi possível carregar os empréstimos disponíveis.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loans,
        loading,
        error,
        fetchLoans,
    };
};
