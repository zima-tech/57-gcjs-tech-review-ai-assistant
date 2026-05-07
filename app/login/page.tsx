import { AuditOutlined, CheckCircleOutlined, FileSearchOutlined, ProjectOutlined, SafetyCertificateOutlined, ToolOutlined } from '@ant-design/icons';
import { Space, Tag } from 'antd';
import { redirect } from 'next/navigation';

import { LoginForm } from '@/components/ui/login-form';
import { getCurrentUser } from '@/lib/auth';

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-cover">
          <div className="login-cover-topline">
            <Tag color="blue">工程建设部</Tag>
            <span>Engineering Review AI</span>
          </div>
          <h1>技术审查智能助手</h1>
          <p>面向可研、概念方案、初步设计和施工图文件，覆盖全专业智能审查、合规校核、问题定位、优化建议与报告留痕。</p>
          <div className="login-metric-grid">
            <div><strong>全阶段</strong><span>可研至施工图审查</span></div>
            <div><strong>9+</strong><span>道路桥梁管线等专业</span></div>
            <div><strong>追溯</strong><span>问题、建议、报告闭环</span></div>
          </div>
          <div className="login-capability-list">
            {[
              [<ProjectOutlined key="major" />, '全专业技术审查', '覆盖道路、桥梁、建筑、管线、绿化、景观、海绵、交通、规划等专业。'],
              [<SafetyCertificateOutlined key="compliance" />, '规范合规校核', '对照行业规范、项目标准和审查清单识别文字错误与合规偏差。'],
              [<AuditOutlined key="report" />, '审查报告留痕', '沉淀问题点位、优化建议和结构化审查报告，支撑后续追溯。']
            ].map(([icon, title, description]) => (
              <div className="login-capability" key={String(title)}>
                <span>{icon}</span>
                <div><strong>{title}</strong><p>{description}</p></div>
                <CheckCircleOutlined />
              </div>
            ))}
          </div>
          <Space className="login-cover-footer" size="large">
            <Space><FileSearchOutlined /> 智能审查</Space>
            <Space><ToolOutlined /> 方案优化</Space>
          </Space>
        </div>
        <div className="login-form-panel">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
