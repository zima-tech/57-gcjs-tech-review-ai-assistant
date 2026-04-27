import { ReviewCenterPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function ReviewCenterRoute() {
  return <ReviewCenterPage snapshot={await getReviewSnapshot()} />;
}
