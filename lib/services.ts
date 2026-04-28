import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function writeAuditLog(params: {
  module: string;
  action: string;
  objectType: string;
  objectId?: string;
  summary: string;
  result?: string;
  operator?: string;
}) {
  const currentUser = params.operator ? null : await getCurrentUser();

  await prisma.auditLog.create({
    data: {
      module: params.module,
      action: params.action,
      objectType: params.objectType,
      objectId: params.objectId,
      operator: params.operator || currentUser?.username || 'system',
      result: params.result || '成功',
      summary: params.summary
    }
  });
}

export async function getReviewSnapshot() {
  const [projects, documents, rules, issues, reports, conversations, logs] = await Promise.all([
    prisma.reviewProject.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.technicalDocument.findMany({ orderBy: { updatedAt: 'desc' } }),
    prisma.complianceRule.findMany({ orderBy: [{ specialty: 'asc' }, { ruleCode: 'asc' }] }),
    prisma.reviewIssue.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.reviewReport.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.reviewConversation.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 30 })
  ]);

  return { projects, documents, rules, issues, reports, conversations, logs };
}
