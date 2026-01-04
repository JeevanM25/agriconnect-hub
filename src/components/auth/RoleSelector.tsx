import { UserRole } from '@/types';
import { Tractor, Briefcase, Truck, HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole | null;
  onSelect: (role: UserRole) => void;
}

const roles: { role: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  {
    role: 'farmer',
    label: 'Farmer',
    icon: <Tractor className="h-8 w-8" />,
    description: 'Sell your crops directly',
  },
  {
    role: 'middleman',
    label: 'Dealer',
    icon: <Briefcase className="h-8 w-8" />,
    description: 'Buy crops from farmers',
  },
  {
    role: 'driver',
    label: 'Driver',
    icon: <Truck className="h-8 w-8" />,
    description: 'Transport goods',
  },
  {
    role: 'worker',
    label: 'Worker',
    icon: <HardHat className="h-8 w-8" />,
    description: 'Find farm work',
  },
];

export function RoleSelector({ selectedRole, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map(({ role, label, icon, description }) => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          className={cn(
            'flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200',
            'hover:shadow-lg hover:-translate-y-1',
            selectedRole === role
              ? role === 'farmer'
                ? 'border-farmer bg-farmer/10 text-farmer'
                : role === 'middleman'
                ? 'border-middleman bg-middleman/10 text-middleman'
                : role === 'driver'
                ? 'border-driver bg-driver/10 text-driver'
                : 'border-worker bg-worker/10 text-worker'
              : 'border-border bg-card hover:border-muted-foreground/50'
          )}
        >
          <div
            className={cn(
              'p-3 rounded-full mb-3',
              selectedRole === role
                ? role === 'farmer'
                  ? 'bg-farmer text-farmer-foreground'
                  : role === 'middleman'
                  ? 'bg-middleman text-middleman-foreground'
                  : role === 'driver'
                  ? 'bg-driver text-driver-foreground'
                  : 'bg-worker text-worker-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {icon}
          </div>
          <span className="font-semibold text-lg">{label}</span>
          <span className="text-sm text-muted-foreground text-center mt-1">{description}</span>
        </button>
      ))}
    </div>
  );
}
