import { ArrowLeft, User, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/contexts/ProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { HelpDialog } from '@/components/help/HelpDialog';

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBack }) => {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [helpOpen, setHelpOpen] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              className="w-6 h-6 text-primary"
              fill="currentColor"
            >
              <path d="M20 8c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12S26.627 8 20 8zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
              <circle cx="20" cy="20" r="4" />
            </svg>
          </div>
          <span className="text-xl font-bold">
            negoci<span className="text-primary">.ai</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Help Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHelpOpen(true)}
          title="Ajuda"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Notification Bell */}
        <NotificationBell
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />

        {/* Profile Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <User className="h-5 w-5" />
        </Button>

        {/* Back Button */}
        {showBackButton && (
          <Button
            onClick={handleBack}
            className="rounded-full px-6 py-2 ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
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
  );
};
