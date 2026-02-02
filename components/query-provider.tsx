"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // En desarrollo, reintentar menos y no refetch en window focus agresivo
                retry: 1,
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5, // 5 minutos de caché por defecto
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
