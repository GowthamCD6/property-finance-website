import { config } from '../config';

interface EnquiryNotificationData {
  referenceNumber: string;
  fullName: string;
  mobileNumber: string;
  loanType: string;
  loanAmount: number;
  cityState: string;
  preferredDate: string;
  preferredTimeSlot: string;
  meetingMode: string;
}

export async function notifyAdminNewEnquiry(data: EnquiryNotificationData): Promise<void> {
  const adminDetailUrl = `${config.clientUrl}/admin/enquiries?search=${encodeURIComponent(data.referenceNumber)}`;
  
  // Format formatted INR currency
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(data.loanAmount);

  console.log('\n========================================');
  console.log('🔔 [ADMIN NOTIFICATION - NEW ENQUIRY]');
  console.log(`To Admin: ${config.adminEmail}`);
  console.log(`Reference: ${data.referenceNumber}`);
  console.log(`Applicant: ${data.fullName} (${data.mobileNumber})`);
  console.log(`Location: ${data.cityState}`);
  console.log(`Loan Type: ${data.loanType} | Requested: ${formattedAmount}`);
  console.log(`Preferred Meeting: ${data.preferredDate} at ${data.preferredTimeSlot} (${data.meetingMode})`);
  console.log(`Review Enquiry: ${adminDetailUrl}`);
  console.log('========================================\n');

  // In production with configured SMTP / transactional mailer (SendGrid / AWS SES),
  // this is where the mailer transport is called safely.
  // The system catches and logs failures gracefully so enquiry persistence is never aborted.
}
