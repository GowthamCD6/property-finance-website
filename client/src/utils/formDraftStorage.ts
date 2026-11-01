import { UploadedDocument } from '../types';

export const VPF_LOAN_APPLICATION_DRAFT_KEY = 'vpf_loan_application_draft_v1';

export interface LoanApplicationDraft {
  // Personal & Contact
  fullName: string;
  mobileNumber: string;
  email: string;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  cityState: string;

  // KYC
  panNumber: string;
  aadhaarNumber: string;

  // Loan & Property
  loanType: string;
  loanAmount: string;
  propertyType: 'residential' | 'commercial' | 'land' | 'other';
  propertyLocation: string;
  propertyOwnershipStatus: 'owned' | 'jointly_owned' | 'purchasing' | 'other';
  employmentType: 'salaried' | 'self_employed' | 'cash_salary' | 'business_owner' | 'other';

  // Bank & Vehicle
  preferredBank: string;
  carType: 'new' | 'used' | 'refinance';
  carOnRoadPrice: string;
  carShowroomName: string;
  carArea: string;
  carModelYear: string;
  carOwnersCount: string;
  carPurchaseValue: string;

  // Attached Documents
  documents: UploadedDocument[];

  // Consultation & Meeting
  meetingMode: 'phone' | 'video' | 'in_person';
  offlineMeetingAddress: string;
  preferredCallbackWindow: string;
  additionalNotes: string;
  consentGiven: boolean;

  // Metadata
  savedAt: string; // ISO String
}

/**
 * Compresses an image file (data URL) using HTML5 Canvas
 * Keeps text in documents sharp while drastically reducing payload from 5-10MB to ~150-250KB
 */
export const compressImageFile = (file: File, maxDimension = 1400, quality = 0.78): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If not an image (e.g. PDF), read as raw base64 data URL
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if canvas context unavailable
          resolve(e.target?.result as string);
          return;
        }

        // Use high-quality smoothing for legible document text
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        // Fallback to raw data url if image failed to decode
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Checks if a draft has any meaningful content entered by the user
 */
export const hasDraftContent = (draft: Partial<LoanApplicationDraft>): boolean => {
  if (!draft) return false;
  return Boolean(
    (draft.fullName && draft.fullName.trim()) ||
    (draft.mobileNumber && draft.mobileNumber.trim()) ||
    (draft.email && draft.email.trim()) ||
    (draft.cityState && draft.cityState.trim()) ||
    (draft.panNumber && draft.panNumber.trim()) ||
    (draft.aadhaarNumber && draft.aadhaarNumber.trim()) ||
    (draft.propertyLocation && draft.propertyLocation.trim()) ||
    (draft.additionalNotes && draft.additionalNotes.trim()) ||
    (draft.offlineMeetingAddress && draft.offlineMeetingAddress.trim()) ||
    (draft.documents && draft.documents.length > 0) ||
    (draft.carShowroomName && draft.carShowroomName.trim()) ||
    (draft.carOnRoadPrice && draft.carOnRoadPrice.trim())
  );
};

/**
 * Save draft into LocalStorage with QuotaExceeded fallback protection
 */
export const saveLoanDraft = (draft: LoanApplicationDraft): boolean => {
  try {
    const serialized = JSON.stringify(draft);
    localStorage.setItem(VPF_LOAN_APPLICATION_DRAFT_KEY, serialized);
    return true;
  } catch (err: any) {
    console.warn('Primary localStorage draft save encountered quota limits, attempting fallback:', err);
    // If quota exceeded, save text fields and document metadata (stripped previewUrl if too large)
    try {
      const lightweightDocs = draft.documents.map((doc) => ({
        ...doc,
        // Keep preview if short, or keep metadata
        previewUrl: doc.previewUrl && doc.previewUrl.length > 500000 ? '' : doc.previewUrl,
      }));
      const fallbackDraft: LoanApplicationDraft = {
        ...draft,
        documents: lightweightDocs,
      };
      localStorage.setItem(VPF_LOAN_APPLICATION_DRAFT_KEY, JSON.stringify(fallbackDraft));
      return true;
    } catch (fallbackErr) {
      console.error('Could not save draft even with lightweight documents', fallbackErr);
      return false;
    }
  }
};

/**
 * Load draft from LocalStorage
 */
export const loadLoanDraft = (): LoanApplicationDraft | null => {
  try {
    const raw = localStorage.getItem(VPF_LOAN_APPLICATION_DRAFT_KEY);
    if (!raw) return null;
    const parsed: LoanApplicationDraft = JSON.parse(raw);
    if (hasDraftContent(parsed)) {
      return parsed;
    }
    return null;
  } catch (err) {
    console.warn('Failed to parse loan draft from localStorage', err);
    return null;
  }
};

/**
 * Clear draft from LocalStorage
 */
export const clearLoanDraft = (): void => {
  try {
    localStorage.removeItem(VPF_LOAN_APPLICATION_DRAFT_KEY);
  } catch (err) {
    console.warn('Failed to remove loan draft from localStorage', err);
  }
};
