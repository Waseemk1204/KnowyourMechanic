import React, { useState } from 'react';
import { Job } from '../context/JobContext';
import { CheckCircleIcon, ClockIcon, AlertCircleIcon, MessageSquareIcon, QrCodeIcon, CreditCardIcon, AlertTriangleIcon } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ReportModal } from './ReportModal';
interface JobItemProps {
  job: Job;
  userRole: 'customer' | 'garage';
  onMarkCompleted?: (jobId: string) => void;
  onViewDetails?: (job: Job) => void;
  onGenerateBarcode?: (job: Job) => void;
}
export const JobItem: React.FC<JobItemProps> = ({
  job,
  userRole,
  onMarkCompleted,
  onViewDetails,
  onGenerateBarcode
}) => {
  const {
    showToast
  } = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const getStatusBadge = (status: Job['status']) => {
    switch (status) {
      case 'pending_creation':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
            <ClockIcon className="h-3 w-3" />
            <span>Draft</span>
          </span>;
      case 'pending_approval':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <QrCodeIcon className="h-3 w-3" />
            <span>Awaiting Approval</span>
          </span>;
      case 'approved':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            <CheckCircleIcon className="h-3 w-3" />
            <span>Approved</span>
          </span>;
      case 'paid':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
            <CreditCardIcon className="h-3 w-3" />
            <span>Paid</span>
          </span>;
      case 'completed':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            <CheckCircleIcon className="h-3 w-3" />
            <span>Completed</span>
          </span>;
      case 'disputed':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
            <AlertCircleIcon className="h-3 w-3" />
            <span>Disputed</span>
          </span>;
      case 'under_investigation':
        return <span className="flex items-center space-x-1 text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
            <AlertTriangleIcon className="h-3 w-3" />
            <span>Under Investigation</span>
          </span>;
      default:
        return null;
    }
  };
  const handleMarkCompleted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkCompleted) {
      onMarkCompleted(job.id);
    }
  };
  const handleGenerateBarcode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerateBarcode) {
      onGenerateBarcode(job);
    }
  };
  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('Messaging feature coming soon!', 'info');
  };
  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReportModalOpen(true);
  };
  return <>
      <div className="border rounded-lg p-4 hover:border-[#F2A900] cursor-pointer transition-all" onClick={() => onViewDetails && onViewDetails(job)}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {userRole === 'garage' ? job.customerName || job.customerPhoneMask : job.garageName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Job #{job.id.split('_')[1]}
            </p>
          </div>
          {getStatusBadge(job.status)}
        </div>
        <div className="mt-3">
          <p className="text-sm line-clamp-2">{job.description}</p>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <div className="text-sm">
            <span className="font-medium">₹{job.amount.toFixed(2)}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2">
              {formatDate(job.createdAt)}
            </span>
          </div>
          <div className="flex space-x-2">
            {userRole === 'garage' && job.status === 'pending_creation' && <button onClick={handleGenerateBarcode} className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-1">
                <QrCodeIcon className="h-3 w-3" />
                <span>Generate Code</span>
              </button>}
            {userRole === 'garage' && job.status === 'paid' && <button onClick={handleMarkCompleted} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                Mark Completed
              </button>}
            <button onClick={handleMessageClick} className="text-xs p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Message">
              <MessageSquareIcon className="h-4 w-4" />
            </button>
            {userRole === 'customer' && (job.status === 'paid' || job.status === 'completed') && <button onClick={handleReportClick} className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center space-x-1">
                  <AlertTriangleIcon className="h-3 w-3" />
                  <span>Report</span>
                </button>}
          </div>
        </div>
      </div>
      {isReportModalOpen && <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} jobId={job.id} />}
    </>;
};