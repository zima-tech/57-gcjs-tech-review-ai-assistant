'use client';

import { AuditOutlined, DashboardOutlined, FileDoneOutlined, FileSearchOutlined, FundOutlined, LogoutOutlined, ProjectOutlined, SafetyCertificateOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons';
import { App, Avatar, Button, Layout, Menu, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';

const items: NonNullable<MenuProps['items']> = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '审查总览' },
  { key: '/projects', icon: <ProjectOutlined />, label: '项目台账' },
  { key: '/review-center', icon: <FileSearchOutlined />, label: '审查任务' },
  { key: '/compliance-check', icon: <SafetyCertificateOutlined />, label: '合规校核' },
  { key: '/optimization-center', icon: <FundOutlined />, label: '优化建议' },
  { key: '/reports', icon: <FileDoneOutlined />, label: '审查报告' },
  { key: '/ai-insights', icon: <FundOutlined />, label: 'AI 洞察' },
  { type: 'divider' },
  { key: '/users', icon: <TeamOutlined />, label: '用户管理' },
  { key: '/audit-logs', icon: <AuditOutlined />, label: '日志审计' },
  { key: '/settings', icon: <SettingOutlined />, label: '系统设置' }
];

const adminOnlyKeys = new Set(['/users', '/audit-logs', '/settings']);

export function DashboardShell({
  children,
  currentUser
}: {
  children: React.ReactNode;
  currentUser: {
    username: string;
    name: string;
    role: string;
  };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isNavigating, startNavigation] = useTransition();
  const { message } = App.useApp();

  const visibleItems = useMemo(
    () =>
      currentUser.role === '管理员'
        ? items
        : items.filter((item) => {
          if (!item) {
            return false;
          }

          if ('type' in item && item.type === 'divider') {
            return false;
          }

          return !('key' in item) || !adminOnlyKeys.has(String(item.key));
        }),
    [currentUser.role]
  );

  useEffect(() => {
    visibleItems.forEach((item) => {
      if (item && 'key' in item && typeof item.key === 'string' && item.key !== pathname) {
        router.prefetch(item.key);
      }
    });
  }, [pathname, router, visibleItems]);

  function navigate(key: string) {
    if (key === pathname || isNavigating) {
      return;
    }

    startNavigation(() => {
      router.push(key);
    });
  }

  async function logout() {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    message.success('已退出当前系统。');
    router.push('/login');
    router.refresh();
  }

  return (
    <Layout className="dashboard-layout">
      <aside className="dashboard-sidebar" style={{ background: 'linear-gradient(180deg, #16324a 0%, #0f5f8c 100%)' }}>
        <div className="dashboard-brand">
          <Tag color="blue" style={{ marginBottom: 12 }}>
            工程建设部
          </Tag>
          <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
            技术审查智能助手
          </Typography.Title>
          <Typography.Paragraph style={{ color: 'rgba(255,255,255,0.72)', marginTop: 12, marginBottom: 0 }}>
            围绕技术文件形成“审查任务、合规校核、问题清单、优化建议、报告留痕”一体化业务台。
          </Typography.Paragraph>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname || '/dashboard']}
          items={visibleItems}
          disabled={isNavigating}
          style={{ background: 'transparent', borderInlineEnd: 'none' }}
          onClick={({ key }) => navigate(key)}
        />
      </aside>
      <section className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              技术审查智能助手
            </Typography.Title>
            <Typography.Text className="muted">
              支持技术文件审查、合规校核、优化建议与结构化审查报告生成的一体化平台。
            </Typography.Text>
          </div>
          <Space>
            <Tag color="processing">{currentUser.role}</Tag>
            <Tag>{currentUser.username}</Tag>
            <Avatar style={{ backgroundColor: '#0f5f8c' }}>{currentUser.name.slice(0, 1)}</Avatar>
            <Button icon={<LogoutOutlined />} onClick={logout} loading={loggingOut}>
              退出登录
            </Button>
          </Space>
        </header>
        <main className="dashboard-main">{children}</main>
      </section>
    </Layout>
  );
}
