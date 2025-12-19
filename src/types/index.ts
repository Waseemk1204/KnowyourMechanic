export type Role = 'user' | 'garage';
export type BookingStatus = 'Draft' | 'Awaiting Approval' | 'Approved' | 'Paid' | 'Completed';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    phone?: string;
}

export interface Garage extends User {
    role: 'garage';
    garageName: string;
    address: string;
    description?: string;
    services: string[];
    workingHours: Record<string, boolean>; // day -> isOpen
    photoUrl?: string;
    rating: number;
    reviewCount: number;
}

export interface Booking {
    id: string;
    customerId: string;
    customerName: string;
    garageId: string;
    garageName: string;
    description: string;
    status: BookingStatus;
    date: string; // ISO date string
    price?: number;
    vehicleDetails?: string;
}

export interface Review {
    id: string;
    bookingId: string;
    garageId: string;
    customerId: string;
    rating: number;
    comment: string;
    date: string;
}
