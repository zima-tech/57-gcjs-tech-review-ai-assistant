import { CheckCircleOutlined, FileSearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Card, Col, Row, Space, Tag } from 'antd';
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
        <div className="login-cover" style={{ background: 'linear-gradient(145deg, #12324b 0%, #0f5f8c 52%, #6db5d6 100%)' }}>
          <Tag color="blue" style={{ marginBottom: 18 }}>
            工程建设部
          </Tag>
          <h1 style={{ color: '#fff', marginTop: 0, marginBottom: 18, fontSize: 40, lineHeight: 1.2 }}>
            技术审查智能助手
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, lineHeight: 1.8 }}>
            面向可研、概念、初设、施工图等全阶段技术文件，覆盖文字校对、合规审查、问题定位、优化建议和报告生成。
          </p>
          <Row gutter={[16, 16]} style={{ marginTop: 28 }}>
            {[
              ['全专业审查', '覆盖道路、桥梁、建筑、管线、绿化、景观、海绵、交通、规划等专业。'],
              ['合规校核', '围绕规范标准、参数约束和审查清单自动识别偏差。'],
              ['报告留痕', '沉淀问题清单、优化建议和结构化审查报告，支持追溯。']
            ].map(([title, description]) => (
              <Col span={24} key={title}>
                <Card style={{ background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' }} bodyStyle={{ padding: 18 }}>
                  <Space align="start">
                    <CheckCircleOutlined style={{ color: '#d6ebff', marginTop: 3 }} />
                    <div>
                      <h3 style={{ color: '#fff', marginTop: 0, marginBottom: 8 }}>{title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.76)', marginBottom: 0, lineHeight: 1.7 }}>{description}</p>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          <Space size="large" style={{ marginTop: 32, color: 'rgba(255,255,255,0.82)' }}>
            <Space><FileSearchOutlined /> 智能审查</Space>
            <Space><SafetyCertificateOutlined /> 合规校核</Space>
          </Space>
        </div>
        <div className="login-form-panel">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
