import type { RouteObject } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { Home } from './pages/public/Home';
import { Dispatches } from './pages/public/Dispatches';
import { NotFound } from './pages/public/NotFound';

// Shared by the browser router (router.tsx) and the build-time prerenderer (entry-server.tsx).
export const routes: RouteObject[] = [
  // Admin: lazy-loaded so none of it ships in the public bundle. Never prerendered.
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
      {
        path: 'analytics',
        lazy: () =>
          import('./pages/admin/AdminAnalytics').then((m) => ({ Component: m.AdminAnalytics })),
      },
      { path: 'blogs', lazy: () => import('./pages/admin/AdminBlogs').then((m) => ({ Component: m.AdminBlogs })) },
      { path: 'blogs/new', lazy: () => import('./pages/admin/AdminBlogEditor').then((m) => ({ Component: m.AdminBlogEditor })) },
      { path: 'blogs/:id', lazy: () => import('./pages/admin/AdminBlogEditor').then((m) => ({ Component: m.AdminBlogEditor })) },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/dispatches', element: <Dispatches /> },
      { path: '/projects/:projectSlug/blogs', lazy: () => import('./pages/public/ProjectBlogs').then((m) => ({ Component: m.ProjectBlogs })) },
      { path: '/blogs/:slug', lazy: () => import('./pages/public/BlogPost').then((m) => ({ Component: m.BlogPost })) },
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
];
