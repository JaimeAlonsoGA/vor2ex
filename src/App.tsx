import Providers from './providers/providers.jsx';
import { AuthenticatedApp } from './routes/authenticated-app-routes.jsx';
import { UnauthenticatedApp } from './routes/unauthenticated-app-routes.jsx';
import { useAuth } from './providers/auth-provider.jsx';
import './App.css';
import { IconLoading } from './components/layout/branding.jsx';

export function AppContent() {
  const { user, userWithStrategy, loading, isAuthenticated, isSigningOut } = useAuth();

  if (loading || isSigningOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <IconLoading />
        </div>
      </div>
    );
  }

  const isAuthenticatedUser = isAuthenticated && !!user && !!userWithStrategy;
  const toRender = isAuthenticatedUser ? <AuthenticatedApp /> : <UnauthenticatedApp />;

  // test();
  return toRender
}

export default function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}