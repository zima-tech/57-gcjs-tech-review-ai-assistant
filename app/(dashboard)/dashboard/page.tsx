import { DashboardPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function DashboardRoute() {
  return <DashboardPage snapshot={await getReviewSnapshot()} />;
}
