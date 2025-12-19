import { useState } from 'react';
import { X, Phone, FileText, IndianRupee, Loader2, ArrowRight, Check, ExternalLink } from 'lucide-react';
import * as api from '../../services/api';

type Step = 'form' | 'waiting_otp' | 'payment' | 'success';

interface AddServiceModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddServiceModal({ onClose, onSuccess }: AddServiceModalProps) {
    const [step, setStep] = useState<Step>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form data
    const [customerPhone, setCustomerPhone] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');

    // Service data from API
    const [serviceId, setServiceId] = useState('');
    const [devOtp, setDevOtp] = useState('');
    const [customerOtp, setCustomerOtp] = useState('');
    const [whatsappUrl, setWhatsappUrl] = useState('');

    const handleInitiate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.initiateService(customerPhone, description, parseFloat(amount));
            setServiceId(response.serviceId);
            if (response.devOtp) {
                setDevOtp(response.devOtp);
            }
            setStep('waiting_otp');
        } catch (err: any) {
            setError(err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.verifyServiceOtp(serviceId, customerOtp);
            setStep('payment');
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePayment = async () => {
        setError('');
        setLoading(true);

        try {
            const response = await api.completePayment(serviceId);
            setWhatsappUrl(response.whatsappUrl);
            setStep('success');
        } catch (err: any) {
            setError(err.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="bg-primary p-5 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold">
                            {step === 'form' && 'Add Service'}
                            {step === 'waiting_otp' && 'Enter Customer OTP'}
                            {step === 'payment' && 'Collect Payment'}
                            {step === 'success' && 'Service Added!'}
                        </h2>
                        {step === 'form' && (
                            <p className="text-white/80 text-sm">Record a completed service</p>
                        )}
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Service Form */}
                    {step === 'form' && (
                        <form onSubmit={handleInitiate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Customer Phone Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="9876543210"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                                        required
                                        maxLength={10}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service Description
                                </label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Oil change and brake pad replacement"
                                        rows={2}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary outline-none resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Amount (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="500"
                                        min="1"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={customerPhone.length !== 10 || !description || !amount || loading}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Send OTP to Customer <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Waiting for OTP */}
                    {step === 'waiting_otp' && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-gray-600">
                                    An OTP has been sent to <strong>+91 {customerPhone}</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    Ask the customer to share the OTP with you
                                </p>
                            </div>

                            {devOtp && (
                                <div className="p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm text-center">
                                    <span className="font-bold">Dev Mode:</span> Customer OTP is <code className="bg-blue-100 px-2 py-1 rounded">{devOtp}</code>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                                    Enter Customer's OTP
                                </label>
                                <input
                                    type="text"
                                    value={customerOtp}
                                    onChange={(e) => setCustomerOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    placeholder="• • • •"
                                    className="w-full text-center text-2xl tracking-[0.5em] py-4 border border-gray-200 rounded-xl focus:border-primary outline-none"
                                    required
                                    maxLength={4}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={customerOtp.length !== 4 || loading}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Verify OTP <ArrowRight size={20} /></>}
                            </button>
                        </form>
                    )}

                    {/* Step 3: Payment */}
                    {step === 'payment' && (
                        <div className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-gray-600">Customer verified! Collect payment:</p>
                                <p className="text-4xl font-bold text-gray-900 mt-2">₹{amount}</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <p className="text-sm text-gray-500 mb-2">Payment Options:</p>
                                <div className="flex gap-2 justify-center">
                                    <span className="px-3 py-1 bg-white border rounded-full text-sm">UPI</span>
                                    <span className="px-3 py-1 bg-white border rounded-full text-sm">Cash</span>
                                    <span className="px-3 py-1 bg-white border rounded-full text-sm">Card</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCompletePayment}
                                disabled={loading}
                                className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 disabled:opacity-50 shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : <>Payment Received <Check size={20} /></>}
                            </button>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <div className="space-y-4 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check size={32} className="text-green-600" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900">Service Added to Portfolio!</h3>
                            <p className="text-gray-600">
                                This service is now part of your verified portfolio.
                            </p>

                            {whatsappUrl && (
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={18} />
                                    Send WhatsApp Receipt
                                </a>
                            )}

                            <button
                                onClick={() => { onSuccess(); onClose(); }}
                                className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
