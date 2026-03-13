import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import farmxLogo from '@/assets/farmx-logo.png';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Language Switcher */}
        <div className="flex justify-end mb-4">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img src={farmxLogo} alt="FarmX Logo" className="h-14 w-14" />
          <h1 className="text-3xl font-bold text-foreground">FarmX</h1>
        </div>

        {/* Tagline */}
        <div className="text-center mb-10">
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">
            {t('tagline')}
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
        <div className="text-center mt-12 text-sm text-muted-foreground space-y-1">
          <p>🌾 Supporting Indian Agriculture 🌾</p>
          <p className="text-xs opacity-70">Idea Initiated by Jeevan M & Rihan</p>
          <p className="text-xs opacity-70">Developed & Designed by Jeevan M</p>
        </div>
      </div>
    </div>
  );
}
