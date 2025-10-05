import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api";
import type { Loan } from "@/types";

export const useLoans = () => {
    const { data, isLoading, error, refetch } = useQuery<Loan[], Error>({
        queryKey: ["loans"],
        queryFn: () => api.getLoans(),
        staleTime: 1000 * 60,
    });

    const fetchLoans = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return {
        loans: data ?? [],
        loading: isLoading,
        error: error ? (error.message ?? String(error)) : null,
        fetchLoans,
    };
};
