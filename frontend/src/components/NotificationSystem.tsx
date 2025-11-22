import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const CustomToast = ({ message, type }: NotificationProps) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className={`
        ${colors[type]}
        flex items-center gap-3 p-4 rounded-xl border
        backdrop-blur-lg shadow-lg max-w-sm
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </motion.div>
  );
};

export const useNotifications = () => {
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    toast.custom(() => (
      <CustomToast message={message} type={type} />
    ), {
      duration: type === 'error' ? 6000 : 4000,
      position: 'top-right',
    });
  };

  return {
    success: (message: string) => showNotification(message, 'success'),
    error: (message: string) => showNotification(message, 'error'),
    warning: (message: string) => showNotification(message, 'warning'),
    info: (message: string) => showNotification(message, 'info'),
  };
};

export default function NotificationSystem() {
  useEffect(() => {
    // Request notification permission for PWA
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
        },
      }}
    />
  );
}
