import { useState } from 'react';
import { Menu, User, HelpCircle, Eye, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { HelpDialog } from '@/components/help/HelpDialog';
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu';
import { useProfile } from '@/contexts/ProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Separator } from '@/components/ui/separator';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const MobileMenu = () => {
  const navigate = useNavigate();
  const { activeProfile, setActiveProfile } = useProfile();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { t } = useTranslation();

  const menuButtonClass =
    'w-full justify-start gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/60 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  const secondaryButtonClass =
    'w-full justify-start gap-3 rounded-xl border border-primary/50 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  const sectionCardClass = 'rounded-xl border border-border/60 bg-muted/10 px-4 py-3 text-sm text-muted-foreground';

  const handleProfileSwitch = () => {
    const isInvestor = activeProfile === 'investor';
    const targetProfile = isInvestor ? 'borrower' : 'investor';
    const targetRoute = isInvestor ? '/borrower/dashboard' : '/investor/dashboard';

    setActiveProfile(targetProfile);
    navigate(targetRoute);
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t('mobileMenu.title')}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('mobileMenu.title')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>{t('mobileMenu.title')}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 py-6">
            <div className="px-3">
              <LanguageSwitcher className="w-full" />
            </div>

            {/* Perfil */}
            <Button
              variant="ghost"
              className={menuButtonClass}
              onClick={() => {
                navigate('/profile');
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/profile');
                  setOpen(false);
                }
              }}
              aria-label={t('mobileMenu.profileAria')}
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span>{t('mobileMenu.profile')}</span>
            </Button>

            <Separator />

            {/* Troca de Perfil */}
            <Button
              variant="ghost"
              className={secondaryButtonClass}
              onClick={handleProfileSwitch}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProfileSwitch();
                }
              }}
              aria-label={t('mobileMenu.switchProfileAria', {
                profile: t(`profiles.${activeProfile === 'investor' ? 'borrower' : 'investor'}`),
              })}
            >
              <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
              <span>
                {t('mobileMenu.switchProfile', {
                  profile: t(`profiles.${activeProfile === 'investor' ? 'borrower' : 'investor'}`),
                })}
              </span>
            </Button>

            <Separator />

            {/* Notificações */}
            <div className={sectionCardClass}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <span>{t('mobileMenu.notifications')}</span>
              </div>
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>

            <Separator />

            {/* Acessibilidade */}
            <div className={sectionCardClass}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Eye className="h-5 w-5" aria-hidden="true" />
                <span>{t('mobileMenu.accessibility')}</span>
              </div>
              <AccessibilityMenu />
            </div>

            <Separator />

            {/* Ajuda */}
            <Button
              variant="ghost"
              className={menuButtonClass}
              onClick={() => {
                setHelpOpen(true);
                setOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setHelpOpen(true);
                  setOpen(false);
                }
              }}
              aria-label={t('header.helpAria')}
            >
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
              <span>{t('mobileMenu.help')}</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Help Dialog */}
      <HelpDialog
        open={helpOpen}
        onOpenChange={setHelpOpen}
        profile={activeProfile}
      />
    </>
  );
};
