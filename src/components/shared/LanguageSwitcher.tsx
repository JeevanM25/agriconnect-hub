import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { SUPPORTED_LANGUAGES } from '@/i18n';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === i18n.language) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('farmx-language', code);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline text-xs font-medium">{currentLang.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t('common.language')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              i18n.language === lang.code && 'bg-primary/10 text-primary font-medium'
            )}
          >
            <div className="flex flex-col">
              <span className="text-sm">{lang.name} - {lang.nativeName}</span>
              {lang.dir === 'rtl' && (
                <span className="text-[10px] text-muted-foreground">RTL</span>
              )}
            </div>
            {i18n.language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
