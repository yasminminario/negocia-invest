import { ArrowLeft, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { HelpDialog } from '@/components/help/HelpDialog';
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu';
import { MobileMenu } from '@/components/common/MobileMenu';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBack }) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [helpOpen, setHelpOpen] = useState(false);
  const { t } = useTranslation();
  const [brandName, brandSuffix] = t('app.name').split('.') as [string, string?];

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const homeRoute = activeProfile === 'borrower'
    ? '/borrower/dashboard'
    : activeProfile === 'investor'
      ? '/investor/dashboard'
      : '/';

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-50 bg-background border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <button
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1 -m-1"
            onClick={() => navigate(homeRoute)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(homeRoute);
              }
            }}
            aria-label={t('header.goHomeAria')}
            tabIndex={0}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <svg
                viewBox="0 0 40 40"
                className="w-6 h-6 text-primary"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                <circle cx="20" cy="20" r="4" />
              </svg>
            </div>
            <span className="text-xl font-bold">
              {brandName}
              <span className="text-primary">{brandSuffix ? `.${brandSuffix}` : ''}</span>
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-end gap-4">
            <div className="flex flex-col items-center gap-1">
              <LanguageSwitcher className="w-48" />
            </div>

            <div className="flex flex-col items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setHelpOpen(true)}
                    aria-label={t('header.helpAria')}
                    className="gap-2"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">{t('header.help')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('header.help')}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground">{t('header.help')}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <AccessibilityMenu />
              <span className="text-xs text-muted-foreground">{t('header.accessibility')}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
              <span className="text-xs text-muted-foreground">{t('header.notifications')}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/profile')}
                    aria-label={t('header.profileAria')}
                    className="gap-2"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">{t('header.profile')}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('header.profile')}</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground">{t('header.profile')}</span>
            </div>

            {/* Back Button */}
            {showBackButton && (
              <Button
                onClick={handleBack}
                className="rounded-full px-6 py-2 ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('header.back')}
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />

          {/* Mobile Back Button */}
          {showBackButton && (
            <Button
              onClick={handleBack}
              className="md:hidden rounded-full px-4 py-2"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {t('header.back')}
            </Button>
          )}
        </div>

        {/* Help Dialog */}
        <HelpDialog
          open={helpOpen}
          onOpenChange={setHelpOpen}
          profile={activeProfile}
        />
      </header>
    </TooltipProvider>
  );
};
