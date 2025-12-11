'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    allowedRoles?: string[];
  }
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuthStore();
    const redirectTo = options?.redirectTo || '/login';

    useEffect(() => {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (options?.allowedRoles && user) {
        if (!options.allowedRoles.includes(user.role)) {
          router.push('/unauthorized');
        }
      }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (options?.allowedRoles && user && !options.allowedRoles.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}

