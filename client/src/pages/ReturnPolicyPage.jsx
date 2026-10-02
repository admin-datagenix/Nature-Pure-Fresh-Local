import PolicyPageLayout from '../components/legal/PolicyPageLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { usePolicyPage } from '../hooks/useCmsPages';

export default function ReturnPolicyPage() {
  const { data: policy, loading } = usePolicyPage('return-policy');

  if (loading && !policy) return <LoadingSpinner />;
  if (!policy) return null;

  return <PolicyPageLayout policy={policy} />;
}
