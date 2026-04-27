import { ReportsPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function ReportsRoute() {
  return <ReportsPage snapshot={await getReviewSnapshot()} />;
}
