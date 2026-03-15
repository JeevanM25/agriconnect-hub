import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleSelector } from './RoleSelector';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('auth.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    try {
      const success = await register(
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          role: selectedRole,
        },
        formData.password
      );

      if (success) {
        toast.success(t('auth.registrationSuccess'));
        navigate(`/dashboard/${selectedRole}`);
      } else {
        toast.error(t('auth.registrationFailed'));
      }
    } catch (error) {
      toast.error(t('auth.registrationFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {step === 'role' ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground">{t('auth.createAccount')}</h2>
            <p className="text-muted-foreground mt-2">{t('auth.selectRoleToStart')}</p>
          </div>
          <RoleSelector selectedRole={selectedRole} onSelect={handleRoleSelect} />
          <p className="text-center text-sm text-muted-foreground">
            {t('auth.alreadyHaveAccount')}{' '}
            <button onClick={onSwitchToLogin} className="text-primary font-medium hover:underline">
              {t('auth.loginHere')}
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="button"
            onClick={() => setStep('role')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.backToRoleSelection')}
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {t('auth.registerAs', { role: selectedRole ? t(`roles.${selectedRole}`) : '' })}
            </h2>
            <p className="text-muted-foreground mt-2">{t('auth.fillDetails')}</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input id="name" name="name" placeholder={t('auth.enterFullName')} value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input id="email" name="email" type="email" placeholder={t('auth.enterEmail')} value={formData.email} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input id="phone" name="phone" type="tel" placeholder={t('auth.phonePlaceholder')} value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">{t('common.location')}</Label>
              <Input id="location" name="location" placeholder={t('auth.locationPlaceholder')} value={formData.location} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input id="password" name="password" type="password" placeholder={t('auth.createPassword')} value={formData.password} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder={t('auth.confirmYourPassword')} value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('auth.creatingAccount')}
              </>
            ) : (
              t('auth.createAccount')
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
