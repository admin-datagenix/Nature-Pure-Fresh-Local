import PolicyPageLayout from '../components/legal/PolicyPageLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { usePolicyPage } from '../hooks/useCmsPages';

export default function RefundPolicyPage() {
  const { data: policy, loading } = usePolicyPage('refund-policy');

  if (loading && !policy) return <LoadingSpinner />;
  if (!policy) return null;

  return <PolicyPageLayout policy={policy} />;
}
