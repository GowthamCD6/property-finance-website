import {
  SiteContent,
  Service,
  Faq,
  Enquiry,
  Appointment,
  DashboardStats,
  AdminUser,
  WeeklyConfig,
  BlockedDate,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('vpf_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
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

// 1. PUBLIC API
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

export async function submitLoanEnquiry(data: any): Promise<any> {
  const documents = data.documents || [];
  try {
    const res = await fetch(`${API_BASE}/public/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      const errorMsg = json.errors ? json.errors.map((e: any) => e.message).join('. ') : json.message;
      throw new Error(errorMsg || 'Failed to submit loan enquiry');
    }
    const createdEnquiry = json.data?.enquiry || json.data;
    if (createdEnquiry) {
      if (createdEnquiry.id) saveLocalEnquiryDocuments(createdEnquiry.id, documents);
      if (createdEnquiry.referenceNumber) saveLocalEnquiryDocuments(createdEnquiry.referenceNumber, documents);
      saveLocalEnquiry(createdEnquiry, documents);
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
export async function loginAdminApi(email: string, password: string): Promise<{ token: string; admin: AdminUser }> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Authentication failed');
  return json.data;
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
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, note }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update enquiry status');
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

export async function updateWeeklyScheduleApi(id: string, data: { isAvailable: boolean; startTime?: string; endTime?: string }): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/availability/weekly/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to update weekly schedule');
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
