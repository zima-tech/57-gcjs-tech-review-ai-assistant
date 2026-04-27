import fs from 'node:fs';

const requiredPaths = [
  'app/layout.tsx',
  'app/login/page.tsx',
  'app/(dashboard)/dashboard/page.tsx',
  'app/(dashboard)/projects/page.tsx',
  'app/(dashboard)/review-center/page.tsx',
  'app/(dashboard)/compliance-check/page.tsx',
  'app/(dashboard)/optimization-center/page.tsx',
  'app/(dashboard)/reports/page.tsx',
  'app/(dashboard)/ai-insights/page.tsx',
  'app/(dashboard)/users/page.tsx',
  'app/(dashboard)/audit-logs/page.tsx',
  'app/(dashboard)/settings/page.tsx',
  'app/api/review/chat/route.ts',
  'app/api/review/issues/save/route.ts',
  'app/api/review/reports/save/route.ts',
  'components/review/review-pages.tsx',
  'prisma/schema.prisma',
  'prisma/seed.ts'
];

const missing = requiredPaths.filter((path) => !fs.existsSync(path));

if (missing.length > 0) {
  console.error('结构校验失败，缺少以下关键文件：');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('结构校验通过。');
