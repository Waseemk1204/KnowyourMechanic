import React, { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Garage } from '../context/JobContext';
import { PaymentModal } from './PaymentModal';
import { useAuth } from '../context/AuthContext';
import { useJob } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  garage: Garage | null;
}
export const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
  isOpen,
  onClose,
  garage
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
  }>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  const {
    createJob
  } = useJob();
  const {
    showToast
  } = useToast();
  if (!isOpen || !garage) return null;
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
    try {
      const newJob = await createJob({
        garageId: garage.id,
        garageName: garage.name,
        customerId: user?.id || 'guest',
        customerPhoneMask: user?.phone ? user.phone.replace(/(\d{2})(\d{6})(\d{2})/, '+91-$1xxxxx$3') : '+91-xxxxxxxx01',
        description,
        amount: Number(amount),
        status: 'pending'
      });
      setJobId(newJob.id);
      setIsPaymentModalOpen(true);
    } catch (error) {
      showToast('Failed to create questionnaire. Please try again.', 'error');
    }
  };
  const handlePaymentComplete = (success: boolean) => {
    setIsPaymentModalOpen(false);
    if (success) {
      showToast('Payment successful! Your questionnaire has been sent to the garage.', 'success');
      setDescription('');
      setAmount('');
      onClose();
    }
  };
  return <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold">Send Questionnaire</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sending questionnaire to:
              </p>
              <p className="font-medium">{garage.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {garage.address}
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Briefly describe the issue (10–500 characters). Be as specific as possible." className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={4} />
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
                  <input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter estimated amount (minimum ₹50)" className="w-full px-3 py-2 pl-7 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800]">
                  Proceed to Pay
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isPaymentModalOpen && jobId && <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} jobId={jobId} amount={Number(amount)} onPaymentComplete={handlePaymentComplete} />}
    </>;
};