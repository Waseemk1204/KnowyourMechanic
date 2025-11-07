import React, { useState } from 'react';
import { XIcon, FileTextIcon, CheckCircleIcon, QrCodeIcon, AlertTriangleIcon } from 'lucide-react';
import { Job } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { BarcodeGenerator } from './BarcodeGenerator';
import { ReportModal } from './ReportModal';
interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onMarkCompleted?: (jobId: string) => void;
  onGenerateBarcode?: (jobId: string) => void;
  onApprove?: (jobId: string) => void;
}
export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  isOpen,
  onClose,
  job,
  onMarkCompleted,
  onGenerateBarcode,
  onApprove
}) => {
  const {
    showToast
  } = useToast();
  const {
    user
  } = useAuth();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  if (!isOpen || !job) return null;
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleDownloadReceipt = () => {
    showToast('Receipt download feature coming soon!', 'info');
  };
  const handleMarkCompleted = () => {
    if (onMarkCompleted) {
      onMarkCompleted(job.id);
      onClose();
    }
  };
  const handleGenerateBarcode = () => {
    if (onGenerateBarcode) {
      onGenerateBarcode(job.id);
      onClose();
    }
  };
  const handleApprove = () => {
    if (onApprove) {
      onApprove(job.id);
      onClose();
    }
  };
  const handleReport = () => {
    setIsReportModalOpen(true);
  };
  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold">Job Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">
                    Job #{job.id.split('_')[1]}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {formatDate(job.createdAt)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'pending_creation' ? 'bg-gray-100 text-gray-800' : job.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' : job.status === 'approved' ? 'bg-blue-100 text-blue-800' : job.status === 'paid' ? 'bg-green-100 text-green-800' : job.status === 'completed' ? 'bg-purple-100 text-purple-800' : job.status === 'under_investigation' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                  {job.status === 'pending_creation' ? 'Draft' : job.status === 'pending_approval' ? 'Awaiting Approval' : job.status === 'under_investigation' ? 'Under Investigation' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {user?.role === 'garage' ? 'Customer' : 'Garage'}
              </h4>
              <p className="font-medium">
                {user?.role === 'garage' ? job.customerName || job.customerPhoneMask : job.garageName}
              </p>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Description
              </h4>
              <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                {job.description}
              </p>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Amount
                </h4>
                <p className="font-medium text-lg">₹{job.amount.toFixed(2)}</p>
              </div>
              {job.approvedAt && <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Approved Date
                  </h4>
                  <p>{formatDate(job.approvedAt)}</p>
                </div>}
              {job.paidAt && <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Payment Date
                  </h4>
                  <p>{formatDate(job.paidAt)}</p>
                </div>}
              {job.completedAt && <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Completed Date
                  </h4>
                  <p>{formatDate(job.completedAt)}</p>
                </div>}
              {job.reportedAt && <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Reported Date
                  </h4>
                  <p>{formatDate(job.reportedAt)}</p>
                </div>}
            </div>
            {job.status === 'under_investigation' && user?.role === 'customer' && <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900 rounded-md">
                  <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                    Report Under Investigation
                  </h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    We're reviewing your report and will get back to you soon.
                  </p>
                </div>}
            {job.status === 'pending_approval' && user?.role === 'garage' && job.approvalCode && <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <h4 className="text-sm font-medium mb-2">
                    Customer Approval Code
                  </h4>
                  <BarcodeGenerator value={job.approvalCode} size={150} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Ask the customer to scan this code to approve the
                    questionnaire
                  </p>
                </div>}
            {job.status !== 'pending_creation' && job.status !== 'pending_approval' && <div className="mb-6">
                  <button onClick={handleDownloadReceipt} className="flex items-center space-x-2 text-[#F2A900] hover:text-[#E09800]">
                    <FileTextIcon className="h-4 w-4" />
                    <span>Download Receipt</span>
                  </button>
                </div>}
            <div className="flex justify-end space-x-2">
              <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                Close
              </button>
              {user?.role === 'garage' && job.status === 'pending_creation' && <button onClick={handleGenerateBarcode} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1">
                  <QrCodeIcon className="h-4 w-4" />
                  <span>Generate Approval Code</span>
                </button>}
              {user?.role === 'garage' && job.status === 'paid' && <button onClick={handleMarkCompleted} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Mark Completed</span>
                </button>}
              {user?.role === 'customer' && job.status === 'pending_approval' && <button onClick={handleApprove} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800] flex items-center space-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Approve & Pay</span>
                  </button>}
              {user?.role === 'customer' && (job.status === 'paid' || job.status === 'completed') && job.status !== 'under_investigation' && <button onClick={handleReport} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-1">
                    <AlertTriangleIcon className="h-4 w-4" />
                    <span>Report Issue</span>
                  </button>}
            </div>
          </div>
        </div>
      </div>
      {isReportModalOpen && job && <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} jobId={job.id} />}
    </>;
};