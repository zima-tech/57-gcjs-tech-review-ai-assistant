import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App, ConfigProvider } from 'antd';
import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: '技术审查智能助手',
  description: '工程建设部技术文件智能审查、合规校核、优化建议与报告生成平台'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#0f5f8c',
                borderRadius: 12,
                colorBgLayout: '#edf4f8'
              }
            }}
          >
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
