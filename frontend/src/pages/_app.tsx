import "@/styles/globals.css";
import "@/components/TextType.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'connectkit';
import { config } from '@/lib/wagmi';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/lib/error-suppression'; // Auto-initialize error suppression

// Create a query client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider
            theme="midnight"
            customTheme={{
              "--ck-font-family": '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              "--ck-border-radius": "12px",
              "--ck-primary-button-border-radius": "12px",
              "--ck-secondary-button-border-radius": "12px",
              "--ck-primary-button-color": "#ffffff",
              "--ck-primary-button-background": "linear-gradient(90deg, #3B82F6, #06B6D4)",
              "--ck-primary-button-hover-background": "linear-gradient(90deg, #2563EB, #0891B2)",
            }}
          >
            <Component {...pageProps} />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
