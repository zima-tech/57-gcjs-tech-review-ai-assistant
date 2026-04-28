import { requireCurrentUser } from '@/lib/auth';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  return (
    <DashboardShell
      currentUser={{
        username: user.username,
        name: user.name,
        role: user.role
      }}
    >
      {children}
    </DashboardShell>
  );
}
