import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Building2, User, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import type { ConfirmationResult } from 'firebase/auth';

type Step = 'phone' | 'otp' | 'profile';

export default function Auth() {
    const navigate = useNavigate();
    const { setupRecaptcha, sendOtp, verifyOtp } = useAuth();

    const [step, setStep] = useState<Step>('phone');
    const [role, setRole] = useState<'customer' | 'garage'>('customer');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [garageName, setGarageName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

    // Initialize ReCaptcha on mount
    useEffect(() => {
        setupRecaptcha('recaptcha-container');
    }, [setupRecaptcha]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await sendOtp(phone);
            setConfirmationResult(result);
            setStep('otp');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // For the "Profile" step, the user is already Firebase-verified and has a token (or we have the user state)
        // We need to update their profile on the backend.
        // My previous verifyOtp handled this in one go. 
        // I should probably call a separate "updateProfile" or re-call verifyOtp with profile data?
        // Let's call verifyOtp again with profile data, reusing the same confirmation? 
        // No, OTP can't be used twice.

        // BETTER APPROACH:
        // If we land on 'profile' step, it means we are already logged in (firebase-wise) 
        // but need to send profile data to backend to 'complete' the registration.
        // I'll use the existing `updateGarageProfile` API or a `register` API.

        try {
            // We can use the verifyOtp function again ONLY IF I change how it works or use a different function.
            // Actually, let's just use the `updateGarageProfile` from api service directly since we should be authenticated now?
            // Wait, `verifyOtp` in context set the user state.

            // But if `verifyOtp` returned "isNewUser", did it set the session? 
            // Yes, usually.

            // Let's use the context to verify again? No.
            // Let's assume `verifyOtp` logged us in.

            const { updateGarageProfile } = await import('../services/api');
            await updateGarageProfile({
                name,
                garageName,
                address,
                role // Ensure role is set
            });

            // Refresh user to get updated fields
            // Then redirect

            navigate('/garage/dashboard');
        } catch (err: any) {
            console.error(err);
            // Backup: maybe we need to call the login endpoint again with data?
            // Let's try to verifyOtp again with the same confirmation? No that fails.

            // Let's just catch the error and say "Registration failed".
            setError(err.message || 'Failed to complete registration');
        } finally {
            setLoading(false);
        }
    };

    // Custom wrapper for verify that handles the logic
    const onVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!confirmationResult) return;

        try {
            // Pass profile data if we have it (e.g. if we did profile first? No, we do phone first)
            // We don't have profile data yet.
            const response = await verifyOtp(confirmationResult, otp, role);

            if (response.isNewUser && role === 'garage') {
                setStep('profile');
            } else {
                // Existing user or customer (auto-create)
                if (response.user.role === 'garage') {
                    navigate('/garage/dashboard');
                } else {
                    navigate('/customer/find-garages');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">KnowyourMechanic</h1>
                    <p className="text-gray-400">Find trusted garages near you</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                    {/* Role Selector (only on phone step) */}
                    {step === 'phone' && (
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setRole('customer')}
                                className={clsx(
                                    "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                                    role === 'customer' ? 'text-primary bg-yellow-50/50' : 'text-gray-500 hover:bg-gray-50'
                                )}
                            >
                                <User size={18} /> Customer
                            </button>
                            <button
                                onClick={() => setRole('garage')}
                                className={clsx(
                                    "flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors",
                                    role === 'garage' ? 'text-primary bg-yellow-50/50' : 'text-gray-500 hover:bg-gray-50'
                                )}
                            >
                                <Building2 size={18} /> Garage
                            </button>
                        </div>
                    )}

                    {/* Header */}
                    <div className="bg-primary p-6 text-center">
                        <h2 className="text-xl font-bold text-white">
                            {step === 'phone' && 'Enter your phone number'}
                            {step === 'otp' && 'Verify OTP'}
                            {step === 'profile' && 'Complete your profile'}
                        </h2>
                        {step === 'otp' && (
                            <p className="text-white/80 text-sm mt-1">
                                OTP sent to +91 {phone}
                            </p>
                        )}
                    </div>

                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Phone Step */}
                        {step === 'phone' && (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-500">
                                            <Phone size={18} />
                                            <span className="text-sm font-medium">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                            placeholder="9876543210"
                                            className="w-full pl-20 pr-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-lg"
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                </div>

                                {/* ReCaptcha Container */}
                                <div id="recaptcha-container"></div>

                                <button
                                    type="submit"
                                    disabled={phone.length !== 10 || loading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            Continue <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {/* OTP Step */}
                        {step === 'otp' && (
                            <form onSubmit={onVerifySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="• • • • • •"
                                        className="w-full text-center text-2xl tracking-[0.5em] py-4 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        required
                                        maxLength={6}
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-500 text-center mt-2">
                                        Enter the 6-digit code sent by Google/Firebase
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={otp.length !== 6 || loading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            Verify <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep('phone'); setOtp(''); }}
                                    className="w-full py-2 text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Change phone number
                                </button>
                            </form>
                        )}

                        {/* Profile Step (Garage Registration) */}
                        {step === 'profile' && (
                            <form onSubmit={handleCompleteProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Raju Kumar"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Garage Name
                                    </label>
                                    <input
                                        type="text"
                                        value={garageName}
                                        onChange={(e) => setGarageName(e.target.value)}
                                        placeholder="Raju Auto Care"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Shop 12, Main Road, Kothrud"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!name || !garageName || !address || loading}
                                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        <>
                                            Complete Registration <ArrowRight size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    By continuing, you agree to our Terms of Service
                </p>
            </div>
        </div>
    );
}
