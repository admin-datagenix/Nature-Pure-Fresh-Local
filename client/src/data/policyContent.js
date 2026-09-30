import { BRAND_EMAIL, BRAND_NAME, COMPANY_NAME } from './brand';

/** Shared legal copy for return & refund routes */
export const RETURN_POLICY_PAGE = {
  title: 'Return Policy',
  eyebrow: 'Policies',
  lastUpdated: 'September 2026',
  intro: [
    `At ${BRAND_NAME}, we are dedicated to delivering premium-quality freeze-dried fruit products. Owing to the sensitive nature of our products and our commitment to the highest standards of hygiene and safety, please note that all purchases are considered final and non-returnable.`,
  ],
  sections: [
    {
      id: 'no-returns',
      heading: 'No returns or exchanges',
      paragraphs: [
        'Once an order is placed, we are unable to accept returns or exchanges. We kindly encourage you to review your order details carefully before completing your purchase to ensure it meets your requirements.',
        `If you have any questions about our products prior to ordering, our customer support team will be happy to assist you. Your satisfaction is important to us, and we are here to help address any queries you may have before you make a purchase.`,
      ],
    },
    {
      id: 'damages',
      heading: 'Damaged or incorrect items',
      paragraphs: [
        'While standard returns are not offered, if you receive an item that is damaged, faulty, or incorrect, please notify us within 24 hours of delivery. See our Refund Policy for the information we need to resolve eligible cases.',
      ],
      link: { to: '/refund-policy', label: 'View refund policy' },
    },
    {
      id: 'contact',
      heading: 'Questions before you order',
      paragraphs: [
        `For product details, allergens, or bulk enquiries, contact us at ${BRAND_EMAIL} before placing your order.`,
        `${COMPANY_NAME} (${BRAND_NAME}) — Made in India.`,
      ],
    },
  ],
};

export const REFUND_POLICY_PAGE = {
  title: 'Refund Policy',
  eyebrow: 'Policies',
  lastUpdated: 'September 2026',
  intro: [
    `At ${BRAND_NAME}, customer satisfaction is our utmost priority. However, due to the perishable nature of our products (freeze-dried fruits), all purchases made through our website are final. Once a transaction is completed, it is ineligible for returns or refunds under any circumstances, except as described under damages and discrepancies below.`,
    'We kindly urge customers to thoroughly verify their order details, including product choices and delivery information, before finalizing the purchase to ensure it aligns with their expectations.',
  ],
  sections: [
    {
      id: 'cancellation',
      heading: 'Order processing & cancellation window',
      paragraphs: [
        'Orders are processed and shipped within 12 hours of placement.',
        'To cancel or amend an order, please reach out to our customer support within this 12-hour timeframe.',
        'After dispatch, orders cannot be canceled, altered, or refunded, as they are already in transit.',
      ],
    },
    {
      id: 'promotions',
      heading: 'Promotional & discounted items',
      paragraphs: [
        'This no-return and no-refund policy also applies to items purchased during sales, promotions, or special offers.',
        'Such items are considered final sale and are not eligible for cancellation, return, or reimbursement.',
      ],
    },
    {
      id: 'damages',
      heading: 'Damages and discrepancies',
      paragraphs: [
        'While we take extensive care in packaging and shipping, if you receive an item that is damaged, faulty, or incorrect, please notify us within 24 hours of delivery.',
        'To expedite resolution, kindly provide:',
      ],
      bullets: [
        'Your order number',
        'A detailed description of the issue',
        'Clear photographs of the damaged or incorrect products',
      ],
      closing:
        'Eligible cases may be resolved with a replacement or refund at our discretion after review. Thank you for your understanding and cooperation.',
    },
    {
      id: 'contact',
      heading: 'Contact support',
      paragraphs: [
        `For any queries, please contact our support team at ${BRAND_EMAIL} prior to placing your order, or as soon as possible if you experience an issue with a delivered order.`,
      ],
    },
  ],
};
