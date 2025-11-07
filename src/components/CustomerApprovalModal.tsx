import React, { useState } from 'react';
import { XIcon, CheckCircleIcon, AlertCircleIcon, ScanIcon } from 'lucide-react';
import { useJob, Job } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { PaymentModal } from './PaymentModal';
interface CustomerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}
export const CustomerApprovalModal: React.FC<CustomerApprovalModalProps> = ({
  isOpen,
  onClose,
  customerId
}) => {
  const {
    jobs,
    approveJob
  } = useJob();
  const {
    showToast
  } = useToast();
  const [approvalCode, setApprovalCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [foundJob, setFoundJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  if (!isOpen) return null;
  const handleScanBarcode = () => {
    // In a real app, this would use a camera API to scan a QR code
    // For this demo, we'll simulate by showing a text input
    setIsScanning(true);
    setError(null);
  };
  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalCode.trim()) {
      setError('Please enter an approval code');
      return;
    }
    // Find job with this approval code
    const job = jobs.find(j => j.approvalCode === approvalCode && j.status === 'pending_approval');
    if (!job) {
      setError('Invalid or expired approval code');
      return;
    }
    setFoundJob(job);
    setIsScanning(false);
    setError(null);
  };
  const handleApprove = async () => {
    if (!foundJob) return;
    setIsApproving(true);
    try {
      await approveJob(foundJob.id, customerId);
      showToast('Questionnaire approved successfully!', 'success');
      setIsPaymentModalOpen(true);
    } catch (error) {
      showToast('Failed to approve questionnaire. Please try again.', 'error');
    } finally {
      setIsApproving(false);
    }
  };
  const handlePaymentComplete = (success: boolean) => {
    setIsPaymentModalOpen(false);
    if (success) {
      handleClose();
      showToast('Payment successful!', 'success');
    }
  };
  const handleClose = () => {
    setApprovalCode('');
    setIsScanning(false);
    setFoundJob(null);
    setError(null);
    onClose();
  };
  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold">Scan Garage Questionnaire</h2>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            {foundJob ? <div>
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-md">
                  <h3 className="font-medium text-green-800 dark:text-green-200 mb-1">
                    Questionnaire Found
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    From {foundJob.garageName}
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Description of Work
                  </h4>
                  <p className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    {foundJob.description}
                  </p>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Amount
                  </h4>
                  <p className="font-medium text-lg">
                    ₹{foundJob.amount.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button onClick={handleApprove} disabled={isApproving} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800] flex items-center space-x-1">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>
                      {isApproving ? 'Approving...' : 'Approve & Pay'}
                    </span>
                  </button>
                </div>
              </div> : isScanning ? <div>
                <div className="flex items-center justify-center mb-4">
                  <ScanIcon className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-center mb-4">
                  Enter the approval code provided by your garage
                </p>
                <form onSubmit={handleCodeSubmit}>
                  <div className="mb-4">
                    <input type="text" value={approvalCode} onChange={e => setApprovalCode(e.target.value)} placeholder="Enter approval code (e.g., JOB1234-ABCD)" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center font-mono" />
                    {error && <p className="text-red-500 text-sm mt-1 text-center">
                        {error}
                      </p>}
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button type="button" onClick={() => setIsScanning(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                      Find Questionnaire
                    </button>
                  </div>
                </form>
                <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900 rounded-md">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                    In a real app, you would scan the barcode with your camera.
                  </p>
                </div>
              </div> : <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <ScanIcon className="h-16 w-16 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Scan Garage Questionnaire
                </h3>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  Scan the barcode provided by your garage to view and approve
                  their questionnaire
                </p>
                <button onClick={handleScanBarcode} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                  Scan Barcode
                </button>
              </div>}
          </div>
        </div>
      </div>
      {foundJob && isPaymentModalOpen && <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} jobId={foundJob.id} amount={foundJob.amount} onPaymentComplete={handlePaymentComplete} />}
    </>;
};