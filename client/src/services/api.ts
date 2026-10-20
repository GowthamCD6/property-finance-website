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

// 1. PUBLIC API
export async function getPublicSiteContent(): Promise<SiteContent> {
  const res = await fetch(`${API_BASE}/public/site-content`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load site content');
  return json.data;
}

export async function getPublicServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/public/services`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load services');
  return json.data;
}

export async function getPublicFaqs(): Promise<Faq[]> {
  const res = await fetch(`${API_BASE}/public/faqs`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to load FAQs');
  return json.data;
}

export async function getPublicAvailability(date?: string): Promise<any> {
  const url = date ? `${API_BASE}/public/availability?date=${date}` : `${API_BASE}/public/availability`;
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to check slot availability');
  return json.data;
}

export async function submitLoanEnquiry(data: any): Promise<any> {
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
  return json;
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

  const res = await fetch(`${API_BASE}/admin/enquiries?${query.toString()}`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch enquiries');
  return json.data;
}

export async function getEnquiryByIdApi(id: string): Promise<Enquiry> {
  const res = await fetch(`${API_BASE}/admin/enquiries/${id}`, {
    headers: getAuthHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Failed to fetch enquiry detail');
  return json.data;
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
