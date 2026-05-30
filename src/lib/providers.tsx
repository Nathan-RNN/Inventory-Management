'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import frFR from 'antd/locale/fr_FR';

const antdTheme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  },
  components: {
    Button: {
      controlHeight: 40,
    },
    Card: {
      borderRadiusLG: 12,
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme} locale={frFR}>
        <AntApp>{children}</AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
