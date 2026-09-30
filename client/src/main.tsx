import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppRouter } from './router';
import '@fontsource/instrument-serif';
import '@fontsource/instrument-serif/400-italic.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './styles/globals.css';

const queryClient = new QueryClient();

async function start() {
  const router = await createAppRouter();
  const app = (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>
  );

  const container = document.getElementById('root')!;
  // Public pages arrive prerendered (scripts/prerender.mjs): attach to that HTML.
  // Admin pages and `npm run dev` arrive empty: render from scratch.
  if (container.hasChildNodes()) hydrateRoot(container, app);
  else createRoot(container).render(app);
}

void start();
