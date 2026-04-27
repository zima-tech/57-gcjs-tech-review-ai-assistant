import { NextResponse } from 'next/server';

import { AUTH_COOKIE } from '@/lib/auth';
import { writeAuditLog } from '@/lib/services';

export async function POST() {
  await writeAuditLog({
    module: '登录',
    action: '退出登录',
    objectType: '用户',
    summary: '管理员退出技术审查智能助手系统。'
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 });
  return response;
}
