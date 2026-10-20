# REST API Documentation

All requests and responses use standard JSON (`application/json; charset=utf-8`) unless downloading binary assets or CSV exports.

Base API URL: `http://localhost:5000/api`

---

## 1. Public Endpoints (No Authentication Required)

### `GET /api/public/site-content`
Returns the published business configuration, hero copy, about text, contact details, and regulatory disclaimers.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "businessName": "Vardhan Property Finance Advisory",
    "businessPhone": "+91 98765 43210",
    "businessEmail": "contact@vardhanfinance.in",
    "officeAddress": "Suite 402, Prestige Meridian, M.G. Road, Bengaluru, Karnataka 560001",
    "cityState": "Bengaluru, Karnataka, India",
    "heroEyebrow": "PROPERTY FINANCE & LOAN ASSISTANCE",
    "heroHeadline": "Find the Right Funding Path for Your Property.",
    "disclaimerText": "Vardhan Property Finance Advisory is an independent loan consultancy..."
  }
}
```

---

### `GET /api/public/services`
Returns all active loan services ordered by `displayOrder`.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm2...",
      "slug": "home-loans",
      "title": "Home Loans",
      "shortDescription": "Guidance and application assistance for residential property purchase...",
      "iconName": "Home",
      "displayOrder": 1,
      "isActive": true
    }
  ]
}
```

---

### `GET /api/public/faqs`
Returns published FAQs for the accordion component.

---

### `GET /api/public/availability`
Returns consultation schedule or slot availability for a specific date.

- Query params: `?date=YYYY-MM-DD` (optional)

---

### `POST /api/public/enquiries`
Submits a new loan enquiry and schedules an appointment in status `Requested`.
*Rate-limited: 15 submissions / hour / IP.*

**Request Body:**
```json
{
  "fullName": "Vikram Singhania",
  "mobileNumber": "9820045678",
  "email": "vikram.singhania@gmail.com",
  "preferredContactMethod": "phone",
  "cityState": "Bengaluru, Karnataka",
  "loanType": "Home Loan",
  "loanAmount": 7500000,
  "propertyType": "residential",
  "propertyLocation": "Koramangala, Bengaluru",
  "propertyOwnershipStatus": "purchasing",
  "employmentType": "salaried",
  "preferredDate": "2026-10-25",
  "preferredTimeSlot": "11:30 AM - 12:30 PM",
  "meetingMode": "video",
  "additionalNotes": "Preliminary eligibility review",
  "consentGiven": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Your enquiry has been successfully registered. Our advisory team will review your details and contact you.",
  "data": {
    "referenceNumber": "VPF-2026-100496",
    "fullName": "Vikram Singhania",
    "loanType": "Home Loan",
    "loanAmount": 7500000,
    "meetingDate": "2026-10-25",
    "meetingSlot": "11:30 AM - 12:30 PM",
    "appointmentStatus": "Requested"
  }
}
```

---

## 2. Authentication Endpoints

### `POST /api/auth/login`
Authenticates administrator with email & password. Issues JWT and sets HTTP-only secure cookie.
*Rate-limited: 10 attempts / 15 mins.*

**Request Body:**
```json
{
  "email": "admin@vardhanfinance.in",
  "password": "Admin@123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "cm2...",
      "name": "Advisory Operations Manager",
      "email": "admin@vardhanfinance.in",
      "role": "superadmin"
    }
  }
}
```

### `POST /api/auth/logout`
Clears session cookie.

### `GET /api/auth/me`
Returns authenticated admin user profile. Requires Bearer Token or cookie.

---

## 3. Protected Admin Endpoints

All admin endpoints require `Authorization: Bearer <token>` or valid `admin_token` cookie.

### `GET /api/admin/dashboard-stats`
Returns pipeline metrics: `totalEnquiries`, `newEnquiries`, `awaitingFollowUp`, `upcomingAppointments`, `confirmedAppointments`, `recentEnquiries`, `recentActivities`.

### `GET /api/admin/enquiries`
Supports query parameters:
- `page`: default 1
- `limit`: default 15
- `search`: search string across name, phone, reference, location
- `status`: filter by status (`New`, `Contacted`, `Appointment Confirmed`, etc.)
- `loanType`: filter by loan product
- `startDate` & `endDate`: date range filter

### `GET /api/admin/enquiries/:id`
Returns complete enquiry details including relations (`appointments`, `notes`, `statusHistory`).

### `PATCH /api/admin/enquiries/:id/status`
Updates status and writes an audit log to `StatusHistory`.

### `POST /api/admin/enquiries/:id/notes`
Adds an internal consultant case note.

### `GET /api/admin/enquiries/export`
Produces RFC 4180-compliant CSV download containing all filtered enquiries.

### `GET /api/admin/appointments`
Returns appointments filtered by status or date.

### `PATCH /api/admin/appointments/:id`
Confirms, reschedules (with conflict check), or cancels an appointment.

### `PUT /api/admin/content`
Updates all editable public content persistently.

### `GET / POST / PUT / DELETE /api/admin/services`
Full CRUD for services.

### `GET / POST / PUT / DELETE /api/admin/faqs`
Full CRUD for FAQs.

### `GET / PUT / POST / DELETE /api/admin/availability`
Manage weekly schedule and blocked holiday dates.
