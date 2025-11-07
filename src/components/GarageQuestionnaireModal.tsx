import React, { useState } from 'react';
import { XIcon, FileTextIcon, UserIcon, PhoneIcon } from 'lucide-react';
import { useJob } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { BarcodeGenerator } from './BarcodeGenerator';
interface GarageQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  customerName: string;
  customerPhone: string;
}
export const GarageQuestionnaireModal: React.FC<GarageQuestionnaireModalProps> = ({
  isOpen,
  onClose,
  customerId,
  customerName,
  customerPhone
}) => {
  const {
    createJob,
    generateApprovalCode
  } = useJob();
  const {
    showToast
  } = useToast();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [approvalCode, setApprovalCode] = useState<string | null>(null);
  if (!isOpen) return null;
  const validateForm = () => {
    const newErrors: {
      description?: string;
      amount?: string;
    } = {};
    if (!description || description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters.';
    } else if (description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters.';
    }
    const amountValue = Number(amount);
    if (!amount || isNaN(amountValue)) {
      newErrors.amount = 'Please enter a valid amount.';
    } else if (amountValue < 50) {
      newErrors.amount = 'Amount must be at least ₹50.';
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
      const newJob = await createJob({
        garageId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : 'garage_001',
        garageName: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).name : 'Shiv Auto Care',
        customerId,
        customerName,
        customerPhoneMask: customerPhone.replace(/(\d{2})(\d{6})(\d{2})/, '+91-$1xxxxx$3'),
        description,
        amount: Number(amount),
        status: 'pending_creation'
      });
      setJobId(newJob.id);
      showToast('Questionnaire created successfully!', 'success');
    } catch (error) {
      showToast('Failed to create questionnaire. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGenerateBarcode = async () => {
    if (!jobId) return;
    try {
      const code = await generateApprovalCode(jobId);
      setApprovalCode(code);
      showToast('Approval barcode generated successfully!', 'success');
    } catch (error) {
      showToast('Failed to generate barcode. Please try again.', 'error');
    }
  };
  const handleClose = () => {
    setJobId(null);
    setApprovalCode(null);
    setDescription('');
    setAmount('');
    setErrors({});
    onClose();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Create Questionnaire</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {approvalCode ? <div className="text-center">
              <h3 className="text-lg font-medium mb-4">
                Approval Barcode Generated
              </h3>
              <BarcodeGenerator value={approvalCode} />
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Ask the customer to scan this barcode to view and approve the
                  questionnaire.
                </p>
              </div>
              <button onClick={handleClose} className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                Close
              </button>
            </div> : jobId ? <div className="text-center">
              <div className="flex items-center justify-center">
                <FileTextIcon className="h-16 w-16 text-green-500 mb-4" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Questionnaire Created!
              </h3>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Generate a barcode for customer approval
              </p>
              <button onClick={handleGenerateBarcode} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                Generate Approval Barcode
              </button>
            </div> : <>
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <p className="font-medium">{customerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {customerPhone}
                  </p>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description of Work
                  </label>
                  <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the required repairs or service (10–500 characters)" className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={4} />
                  {errors.description && <p className="text-red-500 text-xs mt-1">
                      {errors.description}
                    </p>}
                  <p className="text-xs text-gray-500 mt-1">
                    {description.length}/500 characters
                  </p>
                </div>
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter repair cost (minimum ₹50)" className="w-full px-3 py-2 pl-7 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                  </div>
                  {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                    {isSubmitting ? 'Creating...' : 'Create Questionnaire'}
                  </button>
                </div>
              </form>
            </>}
        </div>
      </div>
    </div>;
};