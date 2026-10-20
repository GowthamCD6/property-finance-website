import prisma from '../database/client';

export async function generateEnquiryReference(): Promise<string> {
  const year = new Date().getFullYear();
  // Get count of enquiries this year to generate sequential suffix
  const count = await prisma.enquiry.count();
  const nextNum = 1000 + count + 1;
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `VPF-${year}-${nextNum}${randomSuffix}`;
}
