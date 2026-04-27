import { AiInsightsPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function AiInsightsRoute() {
  return <AiInsightsPage snapshot={await getReviewSnapshot()} />;
}
