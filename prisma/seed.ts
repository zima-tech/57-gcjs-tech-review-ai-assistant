import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.reviewConversation.deleteMany();
  await prisma.reviewReport.deleteMany();
  await prisma.reviewIssue.deleteMany();
  await prisma.complianceRule.deleteMany();
  await prisma.technicalDocument.deleteMany();
  await prisma.reviewProject.deleteMany();
  await prisma.systemSetting.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123',
      name: '系统管理员',
      department: '工程建设部',
      role: '管理员',
      status: '启用'
    }
  });

  await prisma.systemSetting.createMany({
    data: [
      { groupName: '审查策略', key: 'review.stagePriority', value: '施工图,初步设计,可研', type: 'string', description: '智能审查优先级顺序' },
      { groupName: '合规规则', key: 'review.ruleScope', value: '道路,桥梁,建筑,管线,交通,规划', type: 'string', description: '启用合规校核专业范围' },
      { groupName: '报告模板', key: 'review.reportTemplate', value: '问题摘要,点位说明,整改建议,结论', type: 'string', description: '默认审查报告结构' },
      { groupName: 'AI 服务', key: 'ai.localFallback', value: '启用', type: 'string', description: '外部模型不可用时启用本地审查建议' }
    ]
  });

  await prisma.reviewProject.createMany({
    data: [
      { projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', specialty: '道路/交通', stage: '施工图设计', reviewStatus: '审查中', riskLevel: '高', location: '主城区', ownerDept: '工程建设部' },
      { projectCode: 'GC-2026-002', projectName: '东部片区排水管线改造工程', specialty: '管线/海绵', stage: '初步设计', reviewStatus: '待审查', riskLevel: '中', location: '东部片区', ownerDept: '工程建设部' },
      { projectCode: 'GC-2026-003', projectName: '城市门户景观节点优化工程', specialty: '景观/绿化', stage: '概念方案', reviewStatus: '已出报告', riskLevel: '中', location: '门户区', ownerDept: '工程建设部' },
      { projectCode: 'GC-2026-004', projectName: '跨河桥梁新建工程', specialty: '桥梁/结构', stage: '可行性研究', reviewStatus: '审查中', riskLevel: '高', location: '沿河片区', ownerDept: '工程建设部' }
    ]
  });

  await prisma.technicalDocument.createMany({
    data: [
      { projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', documentName: '道路交通施工图 V3', documentType: '施工图设计', specialty: '道路', phase: '施工图', currentVersion: 'V3.0', textErrorCount: 6, complianceHitCount: 4, optimizationCount: 5, reviewStatus: '审查中' },
      { projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', documentName: '交通组织专项说明 V2', documentType: '专项说明', specialty: '交通', phase: '施工图', currentVersion: 'V2.0', textErrorCount: 3, complianceHitCount: 2, optimizationCount: 3, reviewStatus: '待复核' },
      { projectCode: 'GC-2026-002', projectName: '东部片区排水管线改造工程', documentName: '排水初设总说明 V1', documentType: '初步设计', specialty: '管线', phase: '初设', currentVersion: 'V1.0', textErrorCount: 5, complianceHitCount: 6, optimizationCount: 4, reviewStatus: '待审查' },
      { projectCode: 'GC-2026-004', projectName: '跨河桥梁新建工程', documentName: '桥梁可研报告 V2', documentType: '可行性研究', specialty: '桥梁', phase: '可研', currentVersion: 'V2.0', textErrorCount: 2, complianceHitCount: 3, optimizationCount: 4, reviewStatus: '审查中' }
    ]
  });

  await prisma.complianceRule.createMany({
    data: [
      { ruleCode: 'DL-001', specialty: '道路', ruleName: '机动车道最小净宽校核', sourceName: '城市道路设计规范', severity: '高', checkPoint: '核查断面布置与机动车道净宽是否满足规范要求。', enabled: true },
      { ruleCode: 'QL-003', specialty: '桥梁', ruleName: '桥梁设计荷载等级校核', sourceName: '公路桥涵设计通用规范', severity: '高', checkPoint: '核查设计荷载等级和结构受力说明是否一致。', enabled: true },
      { ruleCode: 'GX-005', specialty: '管线', ruleName: '排水管最小覆土与纵坡校核', sourceName: '室外排水设计标准', severity: '中', checkPoint: '核查管径、纵坡、覆土与排水能力是否匹配。', enabled: true },
      { ruleCode: 'GH-007', specialty: '规划', ruleName: '红线退界与控制线校核', sourceName: '国土空间规划技术标准', severity: '高', checkPoint: '核查建筑及附属设施与控制线关系。', enabled: true }
    ]
  });

  await prisma.reviewIssue.createMany({
    data: [
      { projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', documentName: '道路交通施工图 V3', specialty: '道路', issueCategory: '合规偏差', issueLevel: '高', pointLocation: 'K1+320 交叉口断面', issueSummary: '机动车道净宽与规范控制值不一致。', suggestion: '调整断面布置并复核渠化长度。', status: '待整改' },
      { projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', documentName: '交通组织专项说明 V2', specialty: '交通', issueCategory: '文字校对', issueLevel: '中', pointLocation: '第 4 页第 2 段', issueSummary: '交通导改阶段描述前后不一致。', suggestion: '统一导改阶段编号和对应平面图标识。', status: '待复核' },
      { projectCode: 'GC-2026-002', projectName: '东部片区排水管线改造工程', documentName: '排水初设总说明 V1', specialty: '管线', issueCategory: '设计不合理', issueLevel: '高', pointLocation: 'W-12 至 W-17 段', issueSummary: '局部纵坡不足，存在排水不畅风险。', suggestion: '优化检查井标高并复核水力计算。', status: '待整改' },
      { projectCode: 'GC-2026-004', projectName: '跨河桥梁新建工程', documentName: '桥梁可研报告 V2', specialty: '桥梁', issueCategory: '方案优化', issueLevel: '中', pointLocation: '主桥结构方案比选章节', issueSummary: '比选维度不足，缺少运维成本分析。', suggestion: '补充施工组织和运维成本比选内容。', status: '建议采纳' }
    ]
  });

  await prisma.reviewReport.createMany({
    data: [
      { reportCode: 'BG-2026-001', projectCode: 'GC-2026-003', projectName: '城市门户景观节点优化工程', phase: '概念方案', overallConclusion: '原则同意，需按问题清单优化后进入下阶段。', issueCount: 6, majorIssueCount: 1, recommendation: '重点优化景观视线组织、海绵设施衔接和植物配置层次。', status: '已出具' },
      { reportCode: 'BG-2026-002', projectCode: 'GC-2026-001', projectName: '滨江大道综合提升工程', phase: '施工图', overallConclusion: '存在高风险合规偏差，需整改后复审。', issueCount: 11, majorIssueCount: 3, recommendation: '优先处理断面净宽、交通导改和慢行系统衔接问题。', status: '编制中' }
    ]
  });

  await prisma.reviewConversation.createMany({
    data: [
      { scene: '审查总览', role: 'assistant', stage: '概览分析', content: '当前高风险项目集中在施工图和可研阶段，建议优先闭环高等级合规偏差。' },
      { scene: '审查任务', role: 'assistant', stage: '任务建议', content: '建议按专业和阶段拆分任务，先审查道路、桥梁和排水等高风险专业。' },
      { scene: '合规校核', role: 'assistant', stage: '规则建议', content: '应优先校核红线控制、荷载等级、净宽净距和排水纵坡等关键条款。' },
      { scene: '优化建议', role: 'assistant', stage: '优化建议', content: '方案优化宜从规范满足性、施工可实施性和运维经济性三方面提出。' },
      { scene: '审查报告', role: 'assistant', stage: '报告建议', content: '报告建议先固化问题摘要、问题点位、整改要求和结论等级。' },
      { scene: 'AI 洞察', role: 'assistant', stage: '综合建议', content: '建议按周输出高风险项目审查清单，并跟踪整改闭环情况。' }
    ]
  });

  await prisma.auditLog.createMany({
    data: [
      { module: '登录', action: '登录成功', objectType: '用户', operator: 'admin', result: '成功', summary: '管理员登录技术审查智能助手系统。' },
      { module: '合规校核', action: '规则匹配', objectType: '技术文件', operator: 'admin', result: '成功', summary: '已完成施工图和初设文件的首轮规则校核。' },
      { module: '审查报告', action: '生成报告', objectType: '审查报告', operator: 'admin', result: '成功', summary: '已生成城市门户景观节点优化工程的结构化审查报告。' }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
