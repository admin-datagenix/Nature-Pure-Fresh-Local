import { COMPANY_NAME } from './brand.js';

/** Top-crop PNGs from public/Certificates — regenerate via `npm run certs:headers` */
export function certificateHeaderUrl(logoId) {
  return `/Certificates/headers/${logoId}.png`;
}

/** Logos shown without a certificate modal (badges / initiatives only). */
export const CERTIFICATE_BADGE_ONLY_IDS = new Set(['make-in-india', 'pure-natural', 'export']);

/**
 * Verification preview when a certification logo is opened on About Us.
 * `sourcePdf` is the file under public/Certificates (header snapshot only in UI).
 */
export const CERTIFICATE_PREVIEWS = {
  apeda: {
    sourcePdf: 'APEDA Certificate.pdf',
    headerImage: certificateHeaderUrl('apeda'),
    title: 'APEDA Registration',
    issuer:
      'Agricultural and Processed Food Products Export Development Authority (APEDA), Govt. of India',
    companyName: COMPANY_NAME,
    achieverName: COMPANY_NAME,
    registrationLabel: 'Registered entity',
    registrationValue: COMPANY_NAME,
    issuedLabel: 'Scope',
    issuedValue: 'Export of agricultural and processed food products',
    status: 'Registered',
  },
  'startup-india': {
    sourcePdf: 'Startup India certificate.pdf',
    headerImage: certificateHeaderUrl('startup-india'),
    title: 'Startup India Recognition',
    issuer: 'Department for Promotion of Industry and Internal Trade (DPIIT), Govt. of India',
    companyName: COMPANY_NAME,
    achieverName: COMPANY_NAME,
    registrationLabel: 'Recognition',
    registrationValue: 'Startup India — DPIIT',
    issuedLabel: 'Entity',
    issuedValue: COMPANY_NAME,
    status: 'Recognized',
  },
  'quality-2': {
    sourcePdf: 'IEC.pdf',
    headerImage: certificateHeaderUrl('quality-2'),
    title: 'Import Export Code (IEC)',
    issuer: 'Directorate General of Foreign Trade (DGFT), Govt. of India',
    companyName: COMPANY_NAME,
    achieverName: COMPANY_NAME,
    registrationLabel: 'IEC holder',
    registrationValue: COMPANY_NAME,
    issuedLabel: 'Purpose',
    issuedValue: 'Export of agro & processed food products',
    status: 'Active',
  },
  fssai: {
    sourcePdf: 'FESSIA.pdf',
    headerImage: certificateHeaderUrl('fssai'),
    title: 'FSSAI Licence',
    issuer: 'Food Safety and Standards Authority of India (FSSAI)',
    companyName: COMPANY_NAME,
    achieverName: COMPANY_NAME,
    registrationLabel: 'Licence holder',
    registrationValue: COMPANY_NAME,
    issuedLabel: 'Scope',
    issuedValue: 'Manufacturing & sale of freeze-dried fruit snacks and powders',
    status: 'Active',
  },
  msme: {
    sourcePdf: 'Udyam Registration Certificate.pdf',
    headerImage: certificateHeaderUrl('msme'),
    title: 'Udyam Registration Certificate',
    issuer: 'Ministry of Micro, Small & Medium Enterprises, Govt. of India',
    companyName: COMPANY_NAME,
    achieverName: COMPANY_NAME,
    registrationLabel: 'Udyam Registration No.',
    registrationValue: 'UDYAM-MH-29-0182704',
    issuedLabel: 'Enterprise type',
    issuedValue: 'Micro — Manufacturing (freeze-dried fruit)',
    status: 'Registered',
  },
};

export function getCertificatePreview(logoId) {
  if (CERTIFICATE_BADGE_ONLY_IDS.has(logoId)) return null;
  return CERTIFICATE_PREVIEWS[logoId] ?? null;
}
