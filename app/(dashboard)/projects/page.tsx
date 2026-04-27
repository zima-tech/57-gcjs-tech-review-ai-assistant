import { ProjectsPage } from '@/components/review/review-pages';
import { getReviewSnapshot } from '@/lib/services';

export default async function ProjectsRoute() {
  return <ProjectsPage snapshot={await getReviewSnapshot()} />;
}
