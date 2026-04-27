import { ComplianceCheckPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function ComplianceCheckRoute() {
  return <ComplianceCheckPage snapshot={await getReviewSnapshot()} />;
}
