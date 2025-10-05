import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Notification } from '@/components/notifications/NotificationBell';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'negotiation',
    title: 'Nova proposta recebida',
    message: 'Sofia Mendes enviou uma contraproposta de 1.38% a.m.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
    actionUrl: '/borrower/negotiation/neg-1',
    profileType: 'borrower',
  },
  {
    id: 'notif-2',
    type: 'payment',
    title: 'Pagamento em 3 dias',
    message: 'Sua próxima parcela de R$ 5.642,50 vence em 3 dias.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2h ago
    actionUrl: '/borrower/loan/loan-1',
    profileType: 'borrower',
  },
  {
    id: 'notif-3',
    type: 'loan',
    title: 'Empréstimo aprovado',
    message: 'Seu empréstimo de R$ 192.000,00 foi aprovado e está ativo.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    actionUrl: '/borrower/loans',
    profileType: 'borrower',
  },
  {
    id: 'notif-4',
    type: 'negotiation',
    title: 'Contraproposta do tomador',
    message: 'Carlos Silva enviou uma contraproposta de 1.45% a.m.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 90), // 1.5h ago
    actionUrl: '/investor/negotiation/neg-1',
    profileType: 'investor',
  },
  {
    id: 'notif-5',
    type: 'loan',
    title: 'Novo empréstimo ativo',
    message: 'Um tomador aceitou sua oferta de R$ 50.000,00.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5h ago
    actionUrl: '/investor/loans',
    profileType: 'investor',
  },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
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
