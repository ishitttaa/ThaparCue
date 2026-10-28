import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,   // 1 min tak data "fresh", dobara fetch nahi hoga
      gcTime: 5 * 60_000,  // unused data 5 min cache mein
      retry: 1,
    },
  },
});
