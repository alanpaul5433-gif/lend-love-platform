'use client';

import { useState, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 15_000, retry: 1, refetchOnWindowFocus: false },
        },
      })
  );
  // Cast around React 18.2 vs 18.3 ReactNode mismatch between workspaces.
  const Provider = QueryClientProvider as unknown as React.FC<{
    client: QueryClient;
    children: React.ReactNode;
  }>;
  return <Provider client={client}>{children}</Provider>;
}
