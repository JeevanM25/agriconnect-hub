import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Sprout } from 'lucide-react';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="p-3 rounded-xl bg-primary">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">KrishiConnect</h1>
        </div>

        {/* Tagline */}
        <div className="text-center mb-10">
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            Connecting farmers, dealers, drivers, and workers for a better agricultural ecosystem
          </p>
        </div>

        {/* Auth Card */}
        <div className="max-w-lg mx-auto">
          <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
            {mode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>🌾 Supporting Indian Agriculture 🌾</p>
        </div>
      </div>
    </div>
  );
}
