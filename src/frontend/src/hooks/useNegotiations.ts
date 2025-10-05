import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "@/services/api";
import type { Negotiation } from "@/types";

export const useNegotiations = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error, refetch } = useQuery<Negotiation[], Error>({
        queryKey: ["negotiations"],
        queryFn: () => api.getNegotiations(),
        // stale for a short while; can be tuned
        staleTime: 1000 * 60,
    });

    const fetchNegotiations = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return {
        negotiations: data ?? [],
        loading: isLoading,
        error: error ? (error.message ?? String(error)) : null,
        fetchNegotiations,
        queryClient,
    };
};
