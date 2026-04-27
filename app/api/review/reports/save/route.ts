import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/services';

export async function POST(request: Request) {
  const payload = await request.json();

  const report = await prisma.reviewReport.update({
    where: { id: payload.id },
    data: {
      status: payload.status,
      recommendation: payload.recommendation
    }
  });

  await writeAuditLog({
    module: '审查报告',
    action: '更新报告状态',
    objectType: '审查报告',
    objectId: report.id,
    summary: `${report.projectName} 的审查报告状态已更新为${report.status}。`
  });

  return NextResponse.json({ success: true });
}
