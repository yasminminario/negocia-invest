import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from './NotificationBell';
import { Handshake, DollarSign, TrendingUp, Info, CheckCheck, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/contexts/ProfileContext';
import { useTranslation } from 'react-i18next';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClose,
}) => {
  const navigate = useNavigate();
  const { activeProfile, setActiveProfile } = useProfile();
  const { t, i18n } = useTranslation();

  const resolveLocale = () => {
    const language = i18n.resolvedLanguage || i18n.language || 'pt-BR';
    if (language.startsWith('pt')) return 'pt-BR';
    if (language.startsWith('es')) return 'es-ES';
    if (language.startsWith('en')) return 'en-US';
    return language;
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'negotiation':
        return Handshake;
      case 'payment':
        return DollarSign;
      case 'loan':
        return TrendingUp;
      default:
        return Info;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return t('notifications.list.date.older', {
        date: new Intl.DateTimeFormat(resolveLocale(), {
          day: '2-digit',
          month: '2-digit',
        }).format(date),
      });
    } else if (days > 0) {
      return t('notifications.list.date.daysAgo', { count: days });
    } else if (hours > 0) {
      return t('notifications.list.date.hoursAgo', { count: hours });
    } else {
      return t('notifications.list.date.now');
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);

    const goToNotificationTarget = () => {
      if (notification.actionUrl) {
        navigate(notification.actionUrl);
        onClose();
      }
    };

    if (notification.profileType && notification.profileType !== activeProfile) {
      setActiveProfile(notification.profileType);
      setTimeout(goToNotificationTarget, 0);
      return;
    }

    goToNotificationTarget();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-foreground">{t('notifications.list.title')}</h3>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            {t('notifications.list.markAll')}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">
              {t('notifications.list.empty')}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const profileBadgeClass = cn(
                'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide',
                notification.profileType === 'borrower' && 'bg-borrower/10 text-borrower border-borrower/40',
                notification.profileType === 'investor' && 'bg-investor/10 text-investor border-investor/40',
                !notification.profileType && 'bg-primary/10 text-primary border-primary/40'
              );
              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-muted/50 transition-colors',
                    // Unread notifications - full styling with background and border
                    !notification.read && notification.profileType === 'borrower' && 'bg-borrower/5 border-l-4 border-borrower',
                    !notification.read && notification.profileType === 'investor' && 'bg-investor/5 border-l-4 border-investor',
                    !notification.read && !notification.profileType && 'bg-primary/5 border-l-4 border-primary',
                    // Read notifications - just the border for profile type
                    notification.read && notification.profileType === 'borrower' && 'border-l-4 border-borrower/30',
                    notification.read && notification.profileType === 'investor' && 'border-l-4 border-investor/30',
                  )}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        !notification.read && notification.profileType === 'borrower' && 'bg-borrower/10',
                        !notification.read && notification.profileType === 'investor' && 'bg-investor/10',
                        !notification.read && !notification.profileType && 'bg-primary/10',
                        notification.read && 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          !notification.read && notification.profileType === 'borrower' && 'text-borrower',
                          !notification.read && notification.profileType === 'investor' && 'text-investor',
                          !notification.read && !notification.profileType && 'text-primary',
                          notification.read && 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            !notification.read
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0 mt-1',
                            notification.profileType === 'borrower' && 'bg-borrower',
                            notification.profileType === 'investor' && 'bg-investor',
                            !notification.profileType && 'bg-primary'
                          )} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={profileBadgeClass}>
                          {notification.profileType === 'investor'
                            ? t('notifications.list.profile.investor')
                            : notification.profileType === 'borrower'
                              ? t('notifications.list.profile.borrower')
                              : t('notifications.list.profile.generic')}
                        </span>
                        {notification.profileType && notification.profileType !== activeProfile && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {t('notifications.list.profile.switchHint')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
