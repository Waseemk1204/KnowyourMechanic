const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to get auth token
const getToken = (): string | null => localStorage.getItem('kym_token');

interface ApiOptions extends RequestInit {
    headers?: Record<string, string>;
}

// Helper for API calls
const apiCall = async (endpoint: string, options: ApiOptions = {}): Promise<any> => {
    const token = getToken();

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(options.headers || {}),
        },
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// ==================== AUTH ====================

export const sendOtp = async (phone: string, role: string = 'customer'): Promise<any> => {
    return apiCall('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, role }),
    });
};

export const verifyOtp = async (phone: string, otp: string, profileData: Record<string, any> = {}): Promise<any> => {
    const response = await apiCall('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phone, otp, ...profileData }),
    });

    if (response.token) {
        localStorage.setItem('kym_token', response.token);
        localStorage.setItem('kym_user', JSON.stringify(response.user));
    }

    return response;
};

export const firebaseLogin = async (data: { phone: string; role: string; uid: string;[key: string]: any }) => {
    const response = await apiCall('/auth/firebase-login', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (response.token) {
        localStorage.setItem('kym_token', response.token);
        localStorage.setItem('kym_user', JSON.stringify(response.user));
    }

    return response;
};


export const getMe = async (): Promise<any> => {
    return apiCall('/auth/me');
};

export const logout = (): void => {
    localStorage.removeItem('kym_token');
    localStorage.removeItem('kym_user');
};

export const getCurrentUser = (): any => {
    const user = localStorage.getItem('kym_user');
    return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// ==================== GARAGE ====================

export const updateGarageProfile = async (profileData: Record<string, any>): Promise<any> => {
    return apiCall('/garage/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
    });
};

export const getGarageStats = async (): Promise<any> => {
    return apiCall('/garage/stats');
};

export const listGarages = async (): Promise<any> => {
    return apiCall('/garage/list');
};

export const getGaragePublic = async (id: string): Promise<any> => {
    return apiCall(`/garage/${id}/public`);
};

// ==================== SERVICES ====================

export const initiateService = async (customerPhone: string, description: string, amount: number): Promise<any> => {
    return apiCall('/services/initiate', {
        method: 'POST',
        body: JSON.stringify({ customerPhone, description, amount }),
    });
};

export const verifyServiceOtp = async (serviceId: string, otp: string): Promise<any> => {
    return apiCall(`/services/${serviceId}/verify`, {
        method: 'POST',
        body: JSON.stringify({ otp }),
    });
};

export const completePayment = async (serviceId: string): Promise<any> => {
    return apiCall(`/services/${serviceId}/complete-payment`, {
        method: 'POST',
    });
};

export const getPortfolio = async (): Promise<any> => {
    return apiCall('/services/portfolio');
};

export const getPendingServices = async (): Promise<any> => {
    return apiCall('/services/pending');
};

export const getMyServices = async (): Promise<any> => {
    return apiCall('/services/my-services');
};

// ==================== HEALTH ====================

export const checkHealth = async (): Promise<any> => {
    return apiCall('/health');
};

export default {
    sendOtp,
    verifyOtp,
    getMe,
    logout,
    getCurrentUser,
    isAuthenticated,
    updateGarageProfile,
    getGarageStats,
    listGarages,
    getGaragePublic,
    initiateService,
    verifyServiceOtp,
    completePayment,
    getPortfolio,
    getPendingServices,
    getMyServices,
    checkHealth,
};
