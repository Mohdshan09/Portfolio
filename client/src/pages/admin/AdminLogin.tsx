import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { login, useIsAuthenticated } from '../../api/auth';
import { TerminalInput } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { TerminalWindow } from '../../components/ui/TerminalWindow';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useNoIndex } from './useNoIndex';

export function AdminLogin() {
  const authed = useIsAuthenticated();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  useDocumentTitle('Admin login');
  useNoIndex();

  if (authed) return <Navigate to="/admin" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/admin', { replace: true });
    } catch (err) {
      const status = isAxiosError(err) ? err.response?.status : undefined;
      setError(
        status === 401 || status === 400
          ? 'ERR: invalid credentials'
          : status === 429
            ? 'ERR 429: too many attempts. wait 15 minutes.'
            : "ERR: can't reach the server",
      );
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4">
      <TerminalWindow title="~/admin/login.sh" className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          <TerminalInput
            label="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TerminalInput
            label="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="font-mono text-sm text-signal">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? 'CHECKING…' : 'LOG IN ↵'}
          </Button>
        </form>
      </TerminalWindow>
    </main>
  );
}
