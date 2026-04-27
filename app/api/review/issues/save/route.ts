import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/services';

export async function POST(request: Request) {
  const payload = await request.json();

  const issue = await prisma.reviewIssue.update({
    where: { id: payload.id },
    data: {
      status: payload.status,
      suggestion: payload.suggestion
    }
  });

  await writeAuditLog({
    module: '审查任务',
    action: '更新问题状态',
    objectType: '审查问题',
    objectId: issue.id,
    summary: `${issue.documentName} 的问题状态已更新为${issue.status}。`
  });

  return NextResponse.json({ success: true });
}
