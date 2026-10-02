import { REFUND_POLICY_PAGE, RETURN_POLICY_PAGE } from '../../../data/policyContent.js';

const POLICY_BY_SLUG = {
  'return-policy': RETURN_POLICY_PAGE,
  'refund-policy': REFUND_POLICY_PAGE,
};

/** Shape returned by GET /api/v1/cms/policies/:slug */
export function buildPolicyPage(slug) {
  const policy = POLICY_BY_SLUG[slug];
  if (!policy) return null;
  return policy;
}
