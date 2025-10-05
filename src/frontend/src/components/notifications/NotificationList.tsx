import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification } from './NotificationBell';
import { Handshake, DollarSign, TrendingUp, Info, CheckCheck, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }).format(date);
    } else if (days > 0) {
      return `${days}d atrás`;
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else {
      return 'Agora';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-foreground">Notificações</h3>
        {notifications.some((n) => !n.read) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
            <p className="text-sm text-muted-foreground">
              Nenhuma notificação
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type);
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
