// API Client for Master CRM Backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Company {
    id: number;
    name: string;
    code: string;
    logo_url: string | null;
    is_active: number;
    created_at: string;
    is_deleted: number;
}

export interface Subscription {
    id: string; // Backend uses UUID/String for some generic structures or bigints. Assuming string for safety.
    company_id: number;
    plan: string;
    seats: number;
    start_date: string;
    end_date: string;
    amount: number;
    status: string;
}

export interface MasterRole {
    id: number;
    name: string;
    description: string;
    permissions: string[];
    is_active: number;
}

export interface MasterUser {
    id: number;
    name: string;
    email: string;
    role_id: number;
    is_active: number;
    lastLogin?: string; // Derived field for UI if needed
}

// Custom error for API
export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    // Add auth headers here later if needed

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new ApiError(response.status, `API Error: ${response.statusText}`);
    }

    // Some endpoints might return empty body on 204
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    // --- Companies ---
    getCompanies: () => fetchApi<Company[]>('/companies'),
    getCompany: (id: string | number) => fetchApi<Company>(`/companies/${id}`),
    createCompany: (data: Partial<Company>) => fetchApi<Company>('/companies', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateCompany: (id: string | number, data: Partial<Company>) => fetchApi<Company>(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteCompany: (id: string | number) => fetchApi<void>(`/companies/${id}`, { method: 'DELETE' }),

    // --- Master Roles ---
    getMasterRoles: () => fetchApi<MasterRole[]>('/master-roles'),
    createMasterRole: (data: Partial<MasterRole>) => fetchApi<MasterRole>('/master-roles', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateMasterRole: (id: string | number, data: Partial<MasterRole>) => fetchApi<MasterRole>(`/master-roles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteMasterRole: (id: string | number) => fetchApi<void>(`/master-roles/${id}`, { method: 'DELETE' }),

    // --- Master Users ---
    getMasterUsers: () => fetchApi<MasterUser[]>('/master-users'),
    createMasterUser: (data: Partial<MasterUser> & { password?: string }) => fetchApi<MasterUser>('/master-users', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    updateMasterUser: (id: string | number, data: Partial<MasterUser>) => fetchApi<MasterUser>(`/master-users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    deleteMasterUser: (id: string | number) => fetchApi<void>(`/master-users/${id}`, { method: 'DELETE' }),

    // --- Subscriptions ---
    getSubscriptions: () => fetchApi<Subscription[]>('/subscriptions'),
    createSubscription: (data: Partial<Subscription>) => fetchApi<Subscription>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
};
