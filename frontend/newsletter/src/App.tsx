import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import './App.css';
import NewsLetterPage from './pages/NewsLetterListPage';

const { Header, Sider, Content } = Layout;
const { Title,} = Typography;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UploadOutlined />,
              label: 'NewsLetter',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: 'Users',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, height:100 }}>
          <Title>
            NewsLetter
          </Title>
        
          
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 800,
            background: colorBgContainer,
          }}
        >
        <NewsLetterPage></NewsLetterPage>
          
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
