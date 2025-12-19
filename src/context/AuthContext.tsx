import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
    onAuthStateChanged,
    signOut
} from 'firebase/auth';
import type { ConfirmationResult, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as api from '../services/api';

interface User {
    id: string;
    phone: string;
    name: string;
    role: 'customer' | 'garage';
    garageName?: string;
    address?: string;
    isProfileComplete: boolean;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setupRecaptcha: (containerId: string) => void;
    sendOtp: (phone: string) => Promise<ConfirmationResult>;
    verifyOtp: (confirmationResult: ConfirmationResult, otp: string, role: 'customer' | 'garage', profileData?: any) => Promise<any>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize Auth State from LocalStorage and Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setFirebaseUser(currentUser);

            if (currentUser) {
                // If firebase user exists, check for backend session
                const storedUser = api.getCurrentUser();
                if (storedUser) {
                    setUser(storedUser);
                } else {
                    // If no stored user but firebase is logged in, try to fetch profile or logout
                    try {
                        // Using the phone number from firebase to sync with backend
                        // For now, we rely on the verifyOtp flow to set the user
                        // But on refresh, we might want to refetch.
                        // Leaving as is: if no local user, they might need to re-login or we fetch
                    } catch (e) {
                        console.error(e);
                    }
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const setupRecaptcha = (containerId: string) => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                'size': 'invisible',
                'callback': () => {
                    // reCAPTCHA solved
                }
            });
        }
    };

    const sendOtp = async (phone: string) => {
        if (!window.recaptchaVerifier) {
            throw new Error('Recaptcha not initialized');
        }
        // Format phone number for Firebase (needs +91)
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        return signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
    };

    const verifyOtp = async (
        confirmationResult: ConfirmationResult,
        otp: string,
        role: 'customer' | 'garage',
        profileData: any = {}
    ) => {
        // 1. Verify with Firebase
        const result = await confirmationResult.confirm(otp);
        const firebaseUser = result.user;
        setFirebaseUser(firebaseUser);

        // 2. Sync with Backend
        // We send the phone number to backend to get/create our custom user session
        // Ideally we would send the ID Token, but keeping it simple for prototype alignment
        // with previous backend structure.
        const phone = firebaseUser.phoneNumber?.replace('+91', '') || '';

        // Call backend login to get JWT and User object
        const response = await api.firebaseLogin({
            phone,
            role,
            uid: firebaseUser.uid,
            ...profileData
        });

        if (response.user) {
            setUser(response.user);
        }

        return response;
    };

    const logout = async () => {
        await signOut(auth);
        api.logout();
        setUser(null);
        setFirebaseUser(null);
    };

    const refreshUser = async () => {
        try {
            const response = await api.getMe();
            if (response.user) {
                setUser(response.user);
                localStorage.setItem('kym_user', JSON.stringify(response.user));
            }
        } catch (error) {
            console.error('Failed to refresh user:', error);
            // Don't auto logout on refresh error, might just be network
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                firebaseUser,
                isAuthenticated: !!user,
                isLoading,
                setupRecaptcha,
                sendOtp,
                verifyOtp,
                logout,
                refreshUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Add types for window object
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
