import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useProfile } from './ProfileContext';
import { Notification } from '@/components/notifications/NotificationBell';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, activeProfile } = useProfile();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const storageKey = user?.id ? `notifications-${user.id}` : null;

  const persist = useCallback((items: Notification[]) => {
    if (!storageKey || typeof window === 'undefined') return;

    try {
      const serializable = items.map((notif) => ({
        ...notif,
        createdAt: notif.createdAt.toISOString(),
      }));
      window.localStorage.setItem(storageKey, JSON.stringify(serializable));
    } catch (err) {
      console.error('Error persisting notifications:', err);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') {
      setNotifications([]);
      return;
    }

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) {
        setNotifications([]);
        return;
      }

      type StoredNotification = Omit<Notification, 'createdAt'> & { createdAt: string };
      const parsed = JSON.parse(stored) as StoredNotification[];
      const normalized = parsed.map((notif) => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
      }));

      setNotifications(normalized);
    } catch (err) {
      console.error('Error loading notifications from storage:', err);
      setNotifications([]);
    }
  }, [storageKey]);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      actionUrl: notification.actionUrl,
      read: false,
      createdAt: new Date(),
      profileType: notification.profileType ?? activeProfile,
    };

    setNotifications((prev) => {
      const next = [newNotification, ...prev].slice(0, 50);
      persist(next);
      return next;
    });
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const next = prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif));
      persist(next);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => {
      const next = prev.map((notif) => ({ ...notif, read: true }));
      persist(next);
      return next;
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
    if (storageKey && typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
