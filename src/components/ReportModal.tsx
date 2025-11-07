import React, { useState } from 'react';
import { XIcon, AlertTriangleIcon } from 'lucide-react';
import { useJob } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}
export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  jobId
}) => {
  const {
    reportJob
  } = useJob();
  const {
    showToast
  } = useToast();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    reason?: string;
    details?: string;
  }>({});
  if (!isOpen) return null;
  const reportReasons = ['Overcharging', 'Poor quality service', 'Unnecessary repairs', 'Delayed service', 'Rude behavior', 'Parts replacement without consent', 'Other'];
  const validateForm = () => {
    const newErrors: {
      reason?: string;
      details?: string;
    } = {};
    if (!reason) {
      newErrors.reason = 'Please select a reason for reporting';
    }
    if (!details || details.length < 10) {
      newErrors.details = 'Please provide details (minimum 10 characters)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      await reportJob(jobId, reason, details);
      showToast("We'll get back to you about your report soon.", 'info');
      onClose();
    } catch (error) {
      showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold flex items-center">
            <AlertTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
            Report Garage
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium mb-1">
              Reason for Reporting
            </label>
            <select id="reason" value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <option value="">Select a reason</option>
              {reportReasons.map(r => <option key={r} value={r}>
                  {r}
                </option>)}
            </select>
            {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-medium mb-1">
              Details
            </label>
            <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} placeholder="Please provide specific details about the issue" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={4} />
            {errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {details.length} characters (minimum 10)
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900 p-3 rounded-md mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Your report will be reviewed by our team. The job status will be
              changed to "Under Investigation" during this process.
            </p>
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};