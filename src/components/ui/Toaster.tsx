import React from 'react';
import { useToast } from '../../context/ToastContext';
import { XIcon, CheckCircleIcon, AlertCircleIcon, InfoIcon, AlertTriangleIcon } from 'lucide-react';
export const Toaster: React.FC = () => {
  const {
    toasts,
    hideToast
  } = useToast();
  if (toasts.length === 0) return null;
  return <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      {toasts.map(toast => <div key={toast.id} className={`p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md animate-fade-in ${toast.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : toast.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'}`}>
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
            {toast.type === 'error' && <AlertCircleIcon className="h-5 w-5 text-red-500" />}
            {toast.type === 'warning' && <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />}
            {toast.type === 'info' && <InfoIcon className="h-5 w-5 text-blue-500" />}
            <p>{toast.message}</p>
          </div>
          <button onClick={() => hideToast(toast.id)} className="ml-4 text-gray-500 hover:text-gray-700 transition" aria-label="Close notification">
            <XIcon className="h-4 w-4" />
          </button>
        </div>)}
    </div>;
};