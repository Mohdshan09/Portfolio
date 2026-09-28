import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/public/Home';
import { Dispatches } from './pages/public/Dispatches';
import { NotFound } from './pages/public/NotFound';

const router = createBrowserRouter([
  // Admin: lazy-loaded so none of it ships in the public bundle.
  {
    path: '/admin/login',
    lazy: () => import('./pages/admin/AdminLogin').then((m) => ({ Component: m.AdminLogin })),
  },
  {
    path: '/admin',
    lazy: () => import('./pages/admin/AdminLayout').then((m) => ({ Component: m.AdminLayout })),
    children: [
      {
        index: true,
        lazy: () => import('./pages/admin/AdminInbox').then((m) => ({ Component: m.AdminInbox })),
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/dispatches', element: <Dispatches /> },
      // Lazy: these pull in the Markdown renderer, which Home doesn't need.
      {
        path: '/dispatches/:slug',
        lazy: () => import('./pages/public/Dispatch').then((m) => ({ Component: m.Dispatch })),
      },
      {
        path: '/now',
        lazy: () => import('./pages/public/Now').then((m) => ({ Component: m.Now })),
      },
      {
        path: '/changelog',
        lazy: () => import('./pages/public/Changelog').then((m) => ({ Component: m.Changelog })),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
