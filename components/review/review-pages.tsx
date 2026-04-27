'use client';

import { Bubble, Conversations, Sender } from '@ant-design/x';
import { App, Button, Card, Col, List, Progress, Row, Space, Statistic, Table, Tag, Timeline, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Snapshot = {
  projects: Array<{ id: string; projectCode: string; projectName: string; specialty: string; stage: string; reviewStatus: string; riskLevel: string; location: string; ownerDept: string }>;
  documents: Array<{ id: string; projectCode: string; projectName: string; documentName: string; documentType: string; specialty: string; phase: string; currentVersion: string; textErrorCount: number; complianceHitCount: number; optimizationCount: number; reviewStatus: string }>;
  rules: Array<{ id: string; ruleCode: string; specialty: string; ruleName: string; sourceName: string; severity: string; checkPoint: string; enabled: boolean }>;
  issues: Array<{ id: string; projectCode: string; projectName: string; documentName: string; specialty: string; issueCategory: string; issueLevel: string; pointLocation: string; issueSummary: string; suggestion: string; status: string }>;
  reports: Array<{ id: string; reportCode: string; projectCode: string; projectName: string; phase: string; overallConclusion: string; issueCount: number; majorIssueCount: number; recommendation: string; status: string }>;
  conversations: Array<{ id: string; scene: string; role: string; stage: string; content: string }>;
  logs: Array<{ id: string; module: string; action: string; summary: string }>;
};

function levelColor(level: string) {
  if (level === '高') return 'red';
  if (level === '中') return 'orange';
  return 'blue';
}

function statusColor(status: string) {
  if (status.includes('已') || status.includes('通过')) return 'success';
  if (status.includes('待')) return 'warning';
  return 'processing';
}

function SectionHero({ title, description, stats }: { title: string; description: string; stats: Array<{ title: string; value: number | string; suffix?: string }> }) {
  return (
    <div className="page-stack">
      <div className="page-hero">
        <Typography.Title level={3} style={{ marginTop: 0 }}>{title}</Typography.Title>
        <Typography.Paragraph className="muted">{description}</Typography.Paragraph>
        <div className="summary-grid">
          {stats.map((item) => (
            <Card key={item.title} className="panel-card">
              <Statistic title={item.title} value={item.value} suffix={item.suffix} />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIPanel({ title, scene, conversations, placeholder }: { title: string; scene: string; conversations: Snapshot['conversations']; placeholder: string }) {
  const { message } = App.useApp();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(conversations);
  const groupedItems = useMemo(() => [{ key: scene, label: title, group: '当前场景' }], [scene, title]);

  async function submitPrompt(value: string) {
    if (!value.trim()) return;
    setLoading(true);
    const response = await fetch('/api/review/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene, prompt: value })
    });
    const result = await response.json();
    setLoading(false);
    if (!response.ok) {
      message.error(result.message || '会话生成失败。');
      return;
    }
    setItems(result.conversations);
    setInput('');
  }

  return (
    <Card className="panel-card" title={title} extra={<Tag color="processing">Ant Design X</Tag>}>
      <div className="panel-body" style={{ display: 'grid', gap: 16 }}>
        <Conversations items={groupedItems} activeKey={scene} />
        <Bubble.List
          items={items.map((item) => ({
            key: item.id,
            role: item.role === 'user' ? 'user' : 'assistant',
            content: `${item.stage ? `【${item.stage}】` : ''}${item.content}`
          }))}
          roles={{ assistant: { placement: 'start' }, user: { placement: 'end' } }}
          autoScroll
          style={{ maxHeight: 240, overflowY: 'auto' }}
        />
        <Sender value={input} onChange={setInput} onSubmit={submitPrompt} loading={loading} placeholder={placeholder} />
      </div>
    </Card>
  );
}

function IssueActions({ issue }: { issue: Snapshot['issues'][number] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(status: string) {
    setLoading(true);
    const response = await fetch('/api/review/issues/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: issue.id, status, suggestion: issue.suggestion })
    });
    setLoading(false);
    if (!response.ok) {
      message.error('更新失败。');
      return;
    }
    message.success('问题状态已更新。');
    router.refresh();
  }

  return (
    <Space>
      <Button size="small" loading={loading} onClick={() => submit('待复核')}>待复核</Button>
      <Button size="small" type="primary" loading={loading} onClick={() => submit('已闭环')}>已闭环</Button>
    </Space>
  );
}

function ReportActions({ report }: { report: Snapshot['reports'][number] }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(status: string) {
    setLoading(true);
    const response = await fetch('/api/review/reports/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: report.id, status, recommendation: report.recommendation })
    });
    setLoading(false);
    if (!response.ok) {
      message.error('更新失败。');
      return;
    }
    message.success('报告状态已更新。');
    router.refresh();
  }

  return (
    <Space>
      <Button size="small" loading={loading} onClick={() => submit('编制中')}>编制中</Button>
      <Button size="small" type="primary" loading={loading} onClick={() => submit('已出具')}>已出具</Button>
    </Space>
  );
}

export function DashboardPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="审查总览"
        description="集中展示项目阶段分布、文件审查状态、合规规则命中、问题等级和报告产出情况。"
        stats={[
          { title: '项目数量', value: snapshot.projects.length, suffix: '个' },
          { title: '文件数量', value: snapshot.documents.length, suffix: '份' },
          { title: '问题数量', value: snapshot.issues.length, suffix: '项' },
          { title: '报告数量', value: snapshot.reports.length, suffix: '份' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="高风险审查项目">
            <List
              dataSource={snapshot.projects.filter((item) => item.riskLevel === '高')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={`${item.projectName}｜${item.stage}`} description={`${item.specialty}｜${item.location}｜${item.reviewStatus}`} />
                  <Tag color={levelColor(item.riskLevel)}>{item.riskLevel}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <div className="page-stack">
            <AIPanel title="审查助手" scene="审查总览" conversations={snapshot.conversations.filter((item) => item.scene === '审查总览')} placeholder="追问高风险项目、周重点或闭环顺序" />
            <Card className="panel-card" title="近期留痕">
              <Timeline items={snapshot.logs.map((item) => ({ children: `${item.module}｜${item.action}｜${item.summary}` }))} />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export function ProjectsPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="项目台账"
        description="统一查看项目阶段、专业范围、风险等级和当前审查状态。"
        stats={[
          { title: '审查中', value: snapshot.projects.filter((item) => item.reviewStatus === '审查中').length, suffix: '个' },
          { title: '待审查', value: snapshot.projects.filter((item) => item.reviewStatus === '待审查').length, suffix: '个' },
          { title: '已出报告', value: snapshot.projects.filter((item) => item.reviewStatus === '已出报告').length, suffix: '个' },
          { title: '高风险', value: snapshot.projects.filter((item) => item.riskLevel === '高').length, suffix: '个' }
        ]}
      />
      <Card className="panel-card" title="项目清单">
        <Table rowKey="id" dataSource={snapshot.projects} pagination={false} columns={[
          { title: '项目编码', dataIndex: 'projectCode' },
          { title: '项目名称', dataIndex: 'projectName' },
          { title: '专业', dataIndex: 'specialty' },
          { title: '阶段', dataIndex: 'stage' },
          { title: '位置', dataIndex: 'location' },
          { title: '风险等级', dataIndex: 'riskLevel', render: (value: string) => <Tag color={levelColor(value)}>{value}</Tag> },
          { title: '状态', dataIndex: 'reviewStatus', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> }
        ]} />
      </Card>
    </div>
  );
}

export function ReviewCenterPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="审查任务"
        description="按文件、专业、阶段查看文字校对、合规命中和优化建议数量，支撑任务拆分和复核。"
        stats={[
          { title: '技术文件', value: snapshot.documents.length, suffix: '份' },
          { title: '文字问题', value: snapshot.documents.reduce((sum, item) => sum + item.textErrorCount, 0), suffix: '处' },
          { title: '合规命中', value: snapshot.documents.reduce((sum, item) => sum + item.complianceHitCount, 0), suffix: '项' },
          { title: '优化建议', value: snapshot.documents.reduce((sum, item) => sum + item.optimizationCount, 0), suffix: '条' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="文件审查清单">
            <Table rowKey="id" dataSource={snapshot.documents} pagination={{ pageSize: 8 }} columns={[
              { title: '项目', dataIndex: 'projectName' },
              { title: '文件', dataIndex: 'documentName' },
              { title: '类型', dataIndex: 'documentType' },
              { title: '专业', dataIndex: 'specialty' },
              { title: '版本', dataIndex: 'currentVersion' },
              { title: '文字问题', dataIndex: 'textErrorCount' },
              { title: '合规命中', dataIndex: 'complianceHitCount' },
              { title: '状态', dataIndex: 'reviewStatus', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> }
            ]} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <AIPanel title="任务编排助手" scene="审查任务" conversations={snapshot.conversations.filter((item) => item.scene === '审查任务')} placeholder="追问任务分配、复核节奏或阶段优先级" />
        </Col>
      </Row>
    </div>
  );
}

export function ComplianceCheckPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="合规校核"
        description="查看规则库、规范来源、关键检查点和高等级合规偏差问题。"
        stats={[
          { title: '规则数', value: snapshot.rules.length, suffix: '条' },
          { title: '启用规则', value: snapshot.rules.filter((item) => item.enabled).length, suffix: '条' },
          { title: '高等级规则', value: snapshot.rules.filter((item) => item.severity === '高').length, suffix: '条' },
          { title: '高等级偏差', value: snapshot.issues.filter((item) => item.issueCategory === '合规偏差' && item.issueLevel === '高').length, suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="规则库">
            <Table rowKey="id" dataSource={snapshot.rules} pagination={false} columns={[
              { title: '规则编码', dataIndex: 'ruleCode' },
              { title: '专业', dataIndex: 'specialty' },
              { title: '规则名称', dataIndex: 'ruleName' },
              { title: '来源', dataIndex: 'sourceName' },
              { title: '等级', dataIndex: 'severity', render: (value: string) => <Tag color={levelColor(value)}>{value}</Tag> },
              { title: '检查点', dataIndex: 'checkPoint' }
            ]} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <AIPanel title="合规助手" scene="合规校核" conversations={snapshot.conversations.filter((item) => item.scene === '合规校核')} placeholder="追问关键条款、规则优先级或偏差闭环建议" />
        </Col>
      </Row>
    </div>
  );
}

export function OptimizationCenterPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="优化建议"
        description="沉淀问题点位、设计不合理项和方案优化建议，支撑整改和设计迭代。"
        stats={[
          { title: '问题项', value: snapshot.issues.length, suffix: '项' },
          { title: '高等级问题', value: snapshot.issues.filter((item) => item.issueLevel === '高').length, suffix: '项' },
          { title: '待整改', value: snapshot.issues.filter((item) => item.status === '待整改').length, suffix: '项' },
          { title: '已闭环', value: snapshot.issues.filter((item) => item.status === '已闭环').length, suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="问题与建议清单">
            <Table rowKey="id" dataSource={snapshot.issues} pagination={{ pageSize: 8 }} columns={[
              { title: '项目', dataIndex: 'projectName' },
              { title: '文件', dataIndex: 'documentName' },
              { title: '类别', dataIndex: 'issueCategory' },
              { title: '等级', dataIndex: 'issueLevel', render: (value: string) => <Tag color={levelColor(value)}>{value}</Tag> },
              { title: '点位', dataIndex: 'pointLocation' },
              { title: '问题摘要', dataIndex: 'issueSummary' },
              { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> },
              { title: '操作', render: (_: unknown, item: Snapshot['issues'][number]) => <IssueActions issue={item} /> }
            ]} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <AIPanel title="优化助手" scene="优化建议" conversations={snapshot.conversations.filter((item) => item.scene === '优化建议')} placeholder="追问方案优化路径、整改排序或跨专业接口协调建议" />
        </Col>
      </Row>
    </div>
  );
}

export function ReportsPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="审查报告"
        description="查看报告编码、问题统计、总体结论和当前出具状态，支撑最终成果留痕。"
        stats={[
          { title: '报告数', value: snapshot.reports.length, suffix: '份' },
          { title: '编制中', value: snapshot.reports.filter((item) => item.status === '编制中').length, suffix: '份' },
          { title: '已出具', value: snapshot.reports.filter((item) => item.status === '已出具').length, suffix: '份' },
          { title: '重大问题', value: snapshot.reports.reduce((sum, item) => sum + item.majorIssueCount, 0), suffix: '项' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={16}>
          <Card className="panel-card" title="报告清单">
            <Table rowKey="id" dataSource={snapshot.reports} pagination={false} columns={[
              { title: '报告编码', dataIndex: 'reportCode' },
              { title: '项目名称', dataIndex: 'projectName' },
              { title: '阶段', dataIndex: 'phase' },
              { title: '问题数', dataIndex: 'issueCount' },
              { title: '重大问题', dataIndex: 'majorIssueCount' },
              { title: '结论', dataIndex: 'overallConclusion' },
              { title: '状态', dataIndex: 'status', render: (value: string) => <Tag color={statusColor(value)}>{value}</Tag> },
              { title: '操作', render: (_: unknown, item: Snapshot['reports'][number]) => <ReportActions report={item} /> }
            ]} />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <AIPanel title="报告助手" scene="审查报告" conversations={snapshot.conversations.filter((item) => item.scene === '审查报告')} placeholder="追问报告结构、结论等级或整改要求表述建议" />
        </Col>
      </Row>
    </div>
  );
}

export function AiInsightsPage({ snapshot }: { snapshot: Snapshot }) {
  return (
    <div className="page-stack">
      <SectionHero
        title="AI 洞察"
        description="围绕项目风险、文件问题、合规规则和报告输出进行综合追问与会话沉淀。"
        stats={[
          { title: '对话数', value: snapshot.conversations.length, suffix: '条' },
          { title: '高风险项目', value: snapshot.projects.filter((item) => item.riskLevel === '高').length, suffix: '个' },
          { title: '问题清单', value: snapshot.issues.length, suffix: '项' },
          { title: '规则库', value: snapshot.rules.length, suffix: '条' }
        ]}
      />
      <Row gutter={20}>
        <Col xs={24} xl={10}>
          <AIPanel title="综合分析助手" scene="AI 洞察" conversations={snapshot.conversations.filter((item) => item.scene === 'AI 洞察')} placeholder="追问周审查重点、专业风险分布或闭环策略" />
        </Col>
        <Col xs={24} xl={14}>
          <Card className="panel-card" title="综合关注点">
            <Timeline
              items={[
                { children: `高风险项目：${snapshot.projects.filter((item) => item.riskLevel === '高').map((item) => item.projectName).join('、') || '无'}` },
                { children: `待整改问题：${snapshot.issues.filter((item) => item.status === '待整改').length} 项` },
                { children: `编制中报告：${snapshot.reports.filter((item) => item.status === '编制中').length} 份` }
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
