import React, { useState } from 'react';
import { XIcon, CreditCardIcon, CheckCircleIcon, AlertCircleIcon, LoaderIcon } from 'lucide-react';
import { useJob } from '../context/JobContext';
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  amount: number;
  onPaymentComplete: (success: boolean) => void;
}
export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  jobId,
  amount,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    processPayment
  } = useJob();
  if (!isOpen) return null;
  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Call mock payment processing
      const result = await processPayment(jobId);
      if (result.success) {
        setTimeout(() => {
          onPaymentComplete(true);
        }, 1000);
      } else {
        setError('Payment failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };
  // Calculate fees and total
  const platformFee = Math.round(amount * 0.02); // 2% platform fee
  const tax = Math.round((amount + platformFee) * 0.18); // 18% GST
  const total = amount + platformFee + tax;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" disabled={isProcessing}>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          {isProcessing ? <div className="flex flex-col items-center justify-center py-8">
              <LoaderIcon className="h-12 w-12 text-[#F2A900] animate-spin" />
              <p className="mt-4 text-lg font-medium">Processing payment...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Please do not close this window.
              </p>
            </div> : error ? <div className="flex flex-col items-center justify-center py-8">
              <AlertCircleIcon className="h-12 w-12 text-red-500" />
              <p className="mt-4 text-lg font-medium text-red-600">{error}</p>
              <button onClick={() => setError(null)} className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md">
                Try Again
              </button>
            </div> : <>
              <div className="mb-6">
                <p className="text-lg font-medium mb-4">
                  Choose Payment Method
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button className={`border p-3 rounded-md flex flex-col items-center justify-center ${paymentMethod === 'razorpay' ? 'border-[#F2A900] bg-yellow-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600'}`} onClick={() => setPaymentMethod('razorpay')}>
                    <img src="https://razorpay.com/blog-content/uploads/2020/10/rzp-glyph-positive.png" alt="Razorpay" className="h-8 object-contain mb-2" />
                    <span className="text-sm">Razorpay</span>
                  </button>
                  <button className={`border p-3 rounded-md flex flex-col items-center justify-center ${paymentMethod === 'stripe' ? 'border-[#F2A900] bg-yellow-50 dark:bg-gray-700' : 'border-gray-200 dark:border-gray-600'}`} onClick={() => setPaymentMethod('stripe')}>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-8 object-contain mb-2" />
                    <span className="text-sm">Stripe</span>
                  </button>
                </div>
              </div>
              <div className="mb-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <h3 className="font-medium mb-2">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service Amount</span>
                    <span>₹{amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (2%)</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t dark:border-gray-600 pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <CreditCardIcon className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700" disabled={isProcessing}>
                  Cancel
                </button>
                <button onClick={handlePaymentSubmit} className="px-4 py-2 bg-[#F2A900] text-white rounded-md hover:bg-[#E09800] flex items-center" disabled={isProcessing}>
                  Pay Now ₹{total.toFixed(2)}
                </button>
              </div>
            </>}
        </div>
      </div>
    </div>;
};