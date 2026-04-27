import { OptimizationCenterPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function OptimizationCenterRoute() {
  return <OptimizationCenterPage snapshot={await getReviewSnapshot()} />;
}
