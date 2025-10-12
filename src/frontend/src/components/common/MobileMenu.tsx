import { useState } from 'react';
import { Menu, X, User, HelpCircle, Eye } from 'lucide-react';
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

export const MobileMenu = () => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-4 py-6">
            {/* Perfil */}
            <Button
              variant="ghost"
              className="justify-start gap-3 text-base"
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
              aria-label="Ir para Meu Perfil"
            >
              <User className="h-5 w-5" aria-hidden="true" />
              <span>Meu Perfil</span>
            </Button>

            <Separator />

            {/* Notificações */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">Notificações</span>
              </div>
              <NotificationBell
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
              />
            </div>

            <Separator />

            {/* Acessibilidade */}
            <div className="px-3 py-2">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-5 w-5" aria-hidden="true" />
                <span className="font-medium">Configurações de Acessibilidade</span>
              </div>
              <AccessibilityMenu />
            </div>

            <Separator />

            {/* Ajuda */}
            <Button
              variant="ghost"
              className="justify-start gap-3 text-base"
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
              aria-label="Abrir central de ajuda"
            >
              <HelpCircle className="h-5 w-5" aria-hidden="true" />
              <span>Central de Ajuda</span>
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
