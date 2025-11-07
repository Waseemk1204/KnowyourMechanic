import React, { useState, createContext, useContext } from 'react';
type ToastType = 'success' | 'error' | 'info' | 'warning';
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextType>({
  toasts: [],
  showToast: () => {},
  hideToast: () => {}
});
export const useToast = () => useContext(ToastContext);
export const ToastProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: ToastType) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, {
      id,
      message,
      type
    }]);
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };
  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  return <ToastContext.Provider value={{
    toasts,
    showToast,
    hideToast
  }}>
      {children}
    </ToastContext.Provider>;
};