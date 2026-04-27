import { NextResponse } from 'next/server';

import { generateReviewAssistantReply } from '@/lib/ai';
import { prisma } from '@/lib/prisma';
import { writeAuditLog } from '@/lib/services';

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.scene || !payload.prompt) {
    return NextResponse.json({ message: '场景和问题不能为空。' }, { status: 400 });
  }

  const reply = await generateReviewAssistantReply(payload.scene, payload.prompt);

  await prisma.reviewConversation.createMany({
    data: [
      { scene: payload.scene, role: 'user', stage: '继续追问', content: payload.prompt },
      { scene: payload.scene, role: 'assistant', stage: reply.source === 'glm' ? '模型建议' : '本地建议', content: reply.content }
    ]
  });

  await writeAuditLog({
    module: payload.scene,
    action: 'AI追问',
    objectType: '业务会话',
    summary: `在${payload.scene}场景下追加一次智能问答。`
  });

  const conversations = await prisma.reviewConversation.findMany({
    where: { scene: payload.scene },
    orderBy: { createdAt: 'asc' }
  });

  return NextResponse.json({ conversations });
}
