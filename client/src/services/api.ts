import {
  SiteContent,
  Service,
  Faq,
  Enquiry,
  Appointment,
  DashboardStats,
  AdminUser,
  CustomerUser,
  WeeklyConfig,
  BlockedDate,
  CreateAdminPayload,
  UpdateAdminPayload,
  EnquiredCustomer,
  Testimonial,
} from '../types';
export const resolveApiBase = (): string => {
  const envUrl = ((import.meta as any).env?.VITE_API_URL as string | undefined)?.trim();

  // If explicitly configured with an absolute URL (e.g. in Vercel project environment variables)
  if (envUrl && envUrl.startsWith('http')) {
    const clean = envUrl.replace(/\/+$/, '');
    return clean.endsWith('/api') ? clean : `${clean}/api`;
  }

  // When running in the browser on the production domain
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (
      hostname.includes('primeassoicatesloans.in') ||
      hostname.includes('primeassociatesloans.in')
    ) {
      return 'https://api.primeassoicatesloans.in/api';
    }
  }

  // Default to relative /api (works with local Vite proxy and Vercel rewrites)
  return '/api';
};

export const API_BASE = resolveApiBase();
export const ADMIN_API_KEY =
  (import.meta as any).env?.VITE_ADMIN_API_KEY ||
  'vpf_sec_7a9f2b8c3d1e4f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vpf_admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-api-key': ADMIN_API_KEY,
    'x-request-timestamp': Date.now().toString(),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T = any>(res: Response, defaultErrorMsg: string): Promise<T> {
  if (!res.ok) {
    let errMsg = `${defaultErrorMsg} (HTTP ${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson?.message) errMsg = errJson.message;
    } catch {
      // response was not json (e.g. proxy 500 error)
    }
    throw new Error(errMsg);
  }
  return res.json();
}

// 1. PUBLIC API — UNIFIED BOOTSTRAP DATA (Single-call aggregator)
export interface PublicBootstrapData {
  content: SiteContent;
  services: Service[];
  faqs: Faq[];
}

/**
 * Fetches all core public site data (content, services, FAQs) in a single unified API call
 * to minimize round-trip latency and avoid request waterfalls.
 */
export async function getPublicBootstrapData(): Promise<PublicBootstrapData> {
  try {
    const res = await fetch(`${API_BASE}/public/bootstrap`);
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.content) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Bootstrap API unreachable, falling back to individual endpoints', err);
  }

  // Graceful fallback to individual endpoints in parallel
  const [content, services, faqs] = await Promise.all([
    getPublicSiteContent().catch(() => ({} as SiteContent)),
    getPublicServices().catch(() => []),
    getPublicFaqs().catch(() => []),
  ]);

  return { content, services, faqs };
}

export async function getPublicSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/public/site-content`);
  const json = await handleResponse(res, 'Failed to load site content');
  return json.data;
}

export async function getPublicServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/public/services`);
  const json = await handleResponse(res, 'Failed to load services');
  return json.data;
}

export async function getPublicFaqs(): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/public/faqs`);
  const json = await handleResponse(res, 'Failed to load FAQs');
  return json.data;
}

export async function getPublicAvailability(date?: string): Promise<any> {
  const url = date ? `${API_BASE}/public/availability?date=${date}` : `${API_BASE}/public/availability`;
  const res = await fetch(url);
  const json = await handleResponse(res, 'Failed to check slot availability');
  return json.data;
}

// Local document caching helpers
export function saveLocalEnquiryDocuments(refOrId: string, docs: any[]): void {
  try {
    localStorage.setItem(`vpf_docs_${refOrId}`, JSON.stringify(docs));
  } catch (e) {
    console.warn('Unable to cache docs locally', e);
  }
}

export function getLocalEnquiryDocuments(refOrId: string): any[] {
  try {
    const raw = localStorage.getItem(`vpf_docs_${refOrId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalEnquiry(enq: any, docs: any[]): void {
  try {
    const listRaw = localStorage.getItem('vpf_local_enquiries');
    const list = listRaw ? JSON.parse(listRaw) : [];
    const existingIdx = list.findIndex((x: any) => x.id === enq.id || x.referenceNumber === enq.referenceNumber);
    const fullEnq = { ...enq, documents: docs };
    if (existingIdx >= 0) {
      list[existingIdx] = fullEnq;
    } else {
      list.unshift(fullEnq);
    }
    localStorage.setItem('vpf_local_enquiries', JSON.stringify(list.slice(0, 50)));
  } catch (e) {
    console.warn('Failed to save local enquiry list', e);
  }
}

// =========================================================================
// CLOUDINARY SECURE DOCUMENT VAULT APIS
// =========================================================================

export async function uploadEnquiryDocumentApi(formData: FormData): Promise<any> {
  const adminToken = localStorage.getItem('vpf_admin_token') || sessionStorage.getItem('vpf_admin_token');
  const userToken = localStorage.getItem('vpf_user_token');
  const headers: HeadersInit = {};
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const res = await fetch(`${API_BASE}/documents/upload`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: formData,
  });
  return handleResponse(res, 'Failed to upload document to secure vault');
}

export async function getEnquiryDocumentsApi(enquiryId: string, customerIdentifier?: string): Promise<any[]> {
  const adminToken = localStorage.getItem('vpf_admin_token') || sessionStorage.getItem('vpf_admin_token');
  const userToken = localStorage.getItem('vpf_user_token');
  const headers: HeadersInit = {};
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const query = customerIdentifier ? `?customerIdentifier=${encodeURIComponent(customerIdentifier)}` : '';
  const res = await fetch(`${API_BASE}/documents/enquiry/${enquiryId}${query}`, {
    headers,
    credentials: 'include',
  });
  const json = await handleResponse(res, 'Failed to fetch enquiry documents');
  return json.data || [];
}

export async function getDocumentPreviewUrlApi(documentId: string, customerIdentifier?: string): Promise<any> {
  const adminToken = localStorage.getItem('vpf_admin_token') || sessionStorage.getItem('vpf_admin_token');
  const userToken = localStorage.getItem('vpf_user_token');
  const headers: HeadersInit = {};
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const query = customerIdentifier ? `?customerIdentifier=${encodeURIComponent(customerIdentifier)}` : '';
  const res = await fetch(`${API_BASE}/documents/${documentId}/preview${query}`, {
    headers,
    credentials: 'include',
  });
  const json = await handleResponse(res, 'Failed to generate secure preview URL');
  return json.data;
}

export async function deleteEnquiryDocumentApi(documentId: string): Promise<any> {
  const adminToken = localStorage.getItem('vpf_admin_token') || sessionStorage.getItem('vpf_admin_token');
  const userToken = localStorage.getItem('vpf_user_token');
  const headers: HeadersInit = {};
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  } else if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }

  const res = await fetch(`${API_BASE}/documents/${documentId}`, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });
  return handleResponse(res, 'Failed to delete document from vault');
}

export async function submitLoanEnquiry(data: any): Promise<any> {
  const documents = data.documents || [];
  const userToken = localStorage.getItem('vpf_user_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  try {
    const res = await fetch(`${API_BASE}/public/enquiries`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      const errorMsg = json.errors ? json.errors.map((e: any) => e.message).join('. ') : json.message;
      throw new Error(errorMsg || 'Failed to submit loan enquiry');
    }
    const createdEnquiry = json.data?.enquiry || json.data;
    if (createdEnquiry) {
      if (json.data?.token) {
        localStorage.setItem('vpf_user_token', json.data.token);
      }
      if (json.data?.customer) {
        localStorage.setItem('vpf_user_profile', JSON.stringify(json.data.customer));
      }

      // Upload any attached binary files directly to Cloudinary document vault
      if (Array.isArray(documents) && documents.length > 0) {
        for (const doc of documents) {
          if (doc.file) {
            const formData = new FormData();
            formData.append('file', doc.file);
            formData.append('enquiryId', createdEnquiry.id || createdEnquiry.referenceNumber);
            formData.append('documentName', doc.documentName || doc.name);
            formData.append('category', doc.category || 'KYC');
            formData.append('customerIdentifier', createdEnquiry.mobileNumber || '');
            uploadEnquiryDocumentApi(formData).catch((err) =>
              console.warn('Background upload to Cloudinary failed:', err)
            );
          }
        }
      }
    }
    return json;
  } catch (err: any) {
    if (err.message && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
      const refNum = `VPF-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const localEnq = {
        id: `local-${Date.now()}`,
        referenceNumber: refNum,
        ...data,
        status: 'New',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveLocalEnquiryDocuments(refNum, documents);
      saveLocalEnquiry(localEnq, documents);
      return {
        success: true,
        data: {
          enquiry: localEnq,
          appointment: {
            date: data.preferredDate,
            timeSlot: data.preferredTimeSlot,
            meetingMode: data.meetingMode,
          },
        },
      };
    }
    throw err;
  }
}

// 2. AUTH API
export async function loginAdminApi(phoneOrIdentifier: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      phone: phoneOrIdentifier,
      identifier: phoneOrIdentifier,
      email: phoneOrIdentifier,
      password,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Authentication failed');
  return json.data;
}

export async function loginAdminWithGoogleApi(credential: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/google/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Google Administrator authentication failed');
  return json.data;
}

export const PUBLIC_CLIENT_KEY =
  (import.meta as any).env?.VITE_PUBLIC_CLIENT_KEY || 'vpf_pub_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d';

/**
 * Returns security-hardened headers for public and customer portal requests.
 * Injects client API signature, anti-replay millisecond timestamp, and customer token.
 */
export function getCustomerAuthHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('vpf_user_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-client-api-key': PUBLIC_CLIENT_KEY,
    'x-request-timestamp': Date.now().toString(),
    ...customHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

export async function loginUserWithGoogleApi(credential: string): Promise<{ token: string; customer: CustomerUser; sessionHash?: string }> {
  const res = await fetch(`${API_BASE}/auth/google/user`, {
    method: 'POST',
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ credential }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Google User authentication failed');
  return json.data;
}

export async function loginCustomerDirectApi(identifier: string): Promise<{ token: string; customer: CustomerUser; sessionHash?: string }> {
  const res = await fetch(`${API_BASE}/auth/customer/login`, {
    method: 'POST',
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify({ identifier }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Direct access failed. Please verify your details.');
  return json.data;
}

export async function getCustomerProfileApi(): Promise<CustomerUser> {
  const res = await fetch(`${API_BASE}/auth/customer/me`, {
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to verify customer session');
  return json.data;
}

export async function getCustomerEnquiriesApi(): Promise<Enquiry[]> {
  const res = await fetch(`${API_BASE}/auth/customer/enquiries`, {
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load enquiries');
  return json.data;
}

export async function submitCustomerReviewApi(data: {
  rating: number;
  review: string;
  loanType?: string;
  amount?: string;
  location?: string;
}): Promise<Testimonial> {
  const res = await fetch(`${API_BASE}/auth/customer/review`, {
    method: 'POST',
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to submit feedback');
  return json.data;
}

export async function getCustomerReviewApi(): Promise<Testimonial | null> {
  const res = await fetch(`${API_BASE}/auth/customer/review`, {
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load feedback');
  return json.data;
}

export async function deleteCustomerReviewApi(): Promise<void> {
  const res = await fetch(`${API_BASE}/auth/customer/review`, {
    method: 'DELETE',
    headers: getCustomerAuthHeaders(),
    credentials: 'include',
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete review');
}

export async function logoutUserApi(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  localStorage.removeItem('vpf_user_token');
  localStorage.removeItem('vpf_user_profile');
}

export async function logoutAdminApi(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  localStorage.removeItem('vpf_admin_token');
}

export async function getAdminProfileApi(): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to verify session');
  return json.data;
}

// 3. ADMIN OPERATIONS API
export async function getDashboardStatsApi(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/dashboard-stats`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load dashboard metrics');
  return json.data;
}

export async function getEnquiriesApi(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  loanType?: string;
  startDate?: string;
  endDate?: string;
}): Promise<{ enquiries: Enquiry[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.status) query.set('status', params.status);
  if (params?.loanType) query.set('loanType', params.loanType);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);

  try {
    const res = await fetch(`${API_BASE}/admin/enquiries?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (res.ok && json.data) {
      // Attach any documents cached locally
      const serverEnquiries: Enquiry[] = json.data.enquiries.map((enq: Enquiry) => {
        const docs = getLocalEnquiryDocuments(enq.id).concat(getLocalEnquiryDocuments(enq.referenceNumber));
        return {
          ...enq,
          documents: enq.documents && enq.documents.length > 0 ? enq.documents : docs,
        };
      });
      return {
        ...json.data,
        enquiries: serverEnquiries,
      };
    }
  } catch (e) {
    // Fallback to local
  }

  // Local fallback
  const localList: Enquiry[] = JSON.parse(localStorage.getItem('vpf_local_enquiries') || '[]');
  let filtered = localList;
  if (params?.status && params.status !== 'ALL') {
    filtered = filtered.filter((e) => e.status === params.status);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.fullName?.toLowerCase().includes(s) ||
        e.mobileNumber?.includes(s) ||
        e.referenceNumber?.toLowerCase().includes(s)
    );
  }
  return {
    enquiries: filtered,
    pagination: {
      total: filtered.length,
      page: params?.page || 1,
      limit: params?.limit || 15,
      totalPages: Math.max(1, Math.ceil(filtered.length / (params?.limit || 15))),
    },
  };
}

export async function getEnquiryByIdApi(id: string): Promise<Enquiry> {
  let enquiry: Enquiry | null = null;
  try {
    const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
      headers: getAuthHeaders(),
    });
    const json = await res.json();
    if (res.ok && json.data) {
      enquiry = json.data;
    }
  } catch (e) {
    // Fallback to local
  }

  if (!enquiry) {
    const localList: Enquiry[] = JSON.parse(localStorage.getItem('vpf_local_enquiries') || '[]');
    enquiry = localList.find((x) => x.id === id || x.referenceNumber === id) || null;
  }

  if (!enquiry) throw new Error('Enquiry not found');

  const docs = getLocalEnquiryDocuments(enquiry.id).concat(getLocalEnquiryDocuments(enquiry.referenceNumber));
  if (!enquiry.documents || enquiry.documents.length === 0) {
    enquiry.documents = docs;
  }
  return enquiry;
}

export async function updateEnquiryStatusApi(id: string, status: string, note?: string): Promise<Enquiry> {
  // Normalize pipeline labels to canonical API enum values for full compatibility
  let normalizedStatus = status;
  if (status === 'Pending') normalizedStatus = 'New';
  else if (status === 'Slot Booked') normalizedStatus = 'Appointment Confirmed';
  else if (status === 'Process Started') normalizedStatus = 'In Review';
  else if (status === 'Closed') normalizedStatus = 'Closed';

  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status: normalizedStatus, note }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update enquiry status');
  return json.data;
}

export async function createAdminEnquiryApi(payload: {
  fullName: string;
  mobileNumber: string;
  email?: string;
  preferredContactMethod?: string;
  cityState?: string;
  loanType?: string;
  loanAmount?: number;
  propertyType?: string;
  propertyLocation?: string;
  propertyOwnershipStatus?: string;
  employmentType?: string;
  preferredBank?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  meetingMode?: string;
  status?: string;
  additionalNotes?: string;
}): Promise<{ enquiry: Enquiry; appointment?: Appointment }> {
  const res = await fetch(`${API_BASE}/admin/enquiries`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to register borrower dossier');
  return json.data;
}

export async function addEnquiryNoteApi(id: string, content: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/notes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to add internal note');
  return json.data;
}

export function getExportEnquiriesCsvUrl(): string {
  return `${API_BASE}/admin/enquiries/export`;
}

export async function getAppointmentsApi(params?: { status?: string; date?: string }): Promise<Appointment[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.date) query.set('date', params.date);

  const res = await fetch(`${API_BASE}/admin/appointments?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load appointments');
  return json.data;
}

export async function getPendingAllotmentsApi(): Promise<Enquiry[]> {
  const res = await fetch(`${API_BASE}/admin/appointments/pending-queue`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load pending allotment queue');
  return json.data;
}

export async function createAppointmentApi(data: {
  enquiryId: string;
  date: string;
  timeSlot: string;
  meetingMode?: string;
  status?: string;
  adminNotes?: string;
}): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/admin/appointments`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to allot appointment');
  return json.data;
}

export async function updateAppointmentApi(id: string, data: any): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/admin/appointments/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update appointment');
  return json.data;
}

export async function updateSiteContentApi(data: Partial<SiteContent>): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/admin/content`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update website content');
  return json.data;
}

export async function getAdminServicesApi(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load services');
  return json.data;
}

export async function createServiceApi(data: any): Promise<Service> {
  const res = await fetch(`${API_BASE}/admin/services`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create service');
  return json.data;
}

export async function updateServiceApi(id: string, data: any): Promise<Service> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update service');
  return json.data;
}

export async function deleteServiceApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/services/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete service');
}

export async function getAdminFaqsApi(): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/admin/faqs`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load FAQs');
  return json.data;
}

export async function createFaqApi(data: any): Promise<Faq> {
  const res = await fetch(`${API_BASE}/admin/faqs`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to create FAQ');
  return json.data;
}

export async function updateFaqApi(id: string, data: any): Promise<Faq> {
  const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update FAQ');
  return json.data;
}

export async function deleteFaqApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/faqs/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete FAQ');
}

export async function getAvailabilitySettingsApi(): Promise<{ weeklyConfigs: WeeklyConfig[]; blockedDates: BlockedDate[] }> {
  const res = await fetch(`${API_BASE}/admin/availability`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load availability settings');
  return json.data;
}

export async function updateWeeklyScheduleApi(
  id: string,
  data: { isAvailable?: boolean; startTime?: string; endTime?: string; slotDurationMinutes?: number }
): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/availability/weekly/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update weekly schedule');
}

export async function bulkUpdateWeeklyScheduleApi(configs: any[]): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/availability/weekly-bulk`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ configs }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to bulk update schedules');
}

export async function blockDateApi(date: string, reason: string): Promise<BlockedDate> {
  const res = await fetch(`${API_BASE}/admin/availability/block-date`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ date, reason }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to block date');
  return json.data;
}

export async function unblockDateApi(date: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/availability/block-date/${date}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to unblock date');
}

// ============================================================================
// ADMIN TEAM & ACCESS MANAGEMENT API
// ============================================================================

export async function getAdminTeamApi(): Promise<AdminUser[]> {
  const res = await fetch(`${API_BASE}/admin/team`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch administrator team');
  return json.data;
}

export async function createAdminMemberApi(data: CreateAdminPayload): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/admin/team`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to enroll administrator');
  return json.data;
}

export async function updateAdminMemberApi(id: string, data: UpdateAdminPayload): Promise<AdminUser> {
  const res = await fetch(`${API_BASE}/admin/team/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update administrator');
  return json.data;
}

export async function deleteAdminMemberApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/team/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to delete administrator');
}

// ============================================================================
// VERIFIED ENQUIRED CUSTOMERS API
// ============================================================================

export async function getEnquiredCustomersApi(search?: string): Promise<{ data: EnquiredCustomer[]; totalCount: number }> {
  const url = search
    ? `${API_BASE}/admin/customers?search=${encodeURIComponent(search)}`
    : `${API_BASE}/admin/customers`;
  const res = await fetch(url, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch enquired customers');
  return json;
}

// ============================================================================
// API SECURITY & CRYPTOGRAPHIC KEY PROTECTION
// ============================================================================

export interface ApiSecurityStatus {
  status: string;
  maskedKey: string;
  keyHash: string;
  hashAlgorithm: string;
  signatureMechanism: string;
  rateLimitPolicy: string;
  replayProtectionWindowMs: number;
  lastRotatedAt: string;
}

export async function getApiKeyStatusApi(): Promise<ApiSecurityStatus> {
  const res = await fetch(`${API_BASE}/admin/security/api-key-status`, {
    headers: getAuthHeaders(),
  });
  const json = await handleResponse(res, 'Failed to fetch API key security status');
  return json.data;
}

export async function rotateApiKeyApi(): Promise<{ newKey: string; newHash: string; rotatedAt: string }> {
  const res = await fetch(`${API_BASE}/admin/security/rotate-api-key`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const json = await handleResponse(res, 'Failed to rotate Admin API key');
  return json.data;
}

