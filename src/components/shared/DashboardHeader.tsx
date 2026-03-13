import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import farmxLogo from '@/assets/farmx-logo.png';
import { LanguageSwitcher } from './LanguageSwitcher';

export function DashboardHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleColors = {
    farmer: 'bg-farmer',
    middleman: 'bg-middleman',
    driver: 'bg-driver',
    worker: 'bg-worker',
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={farmxLogo} alt="FarmX Logo" className="h-10 w-10" />
            <div>
              <span className="text-lg font-bold text-foreground block leading-tight">FarmX</span>
              <span className="text-[10px] text-muted-foreground leading-none">by Jeevan M</span>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={cn('p-2 rounded-full', user?.role ? roleColors[user.role] : 'bg-primary')}>
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
