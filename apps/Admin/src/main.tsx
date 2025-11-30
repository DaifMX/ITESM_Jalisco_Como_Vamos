import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';

import '@/index.css';
import App from '@/App.tsx';

import { BrowserRouter } from 'react-router';
import { SWRConfig } from 'swr';

import { fetcher } from '@/lib/axios';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SWRConfig value={{ fetcher }}>
        <Suspense>
          <App />
        </Suspense>
      </SWRConfig>
    </BrowserRouter>
  </StrictMode>,
);