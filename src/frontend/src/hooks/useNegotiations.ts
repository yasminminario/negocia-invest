import { useCallback, useState } from "react";

import { api } from "@/services/api";
import type { Negotiation } from "@/types";

export const useNegotiations = () => {
    const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNegotiations = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await api.getNegotiations();
            setNegotiations(data);
        } catch (err) {
            console.error("Erro ao buscar negociações", err);
            setError("Não foi possível carregar as negociações.");
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        negotiations,
        loading,
        error,
        fetchNegotiations,
    };
};
