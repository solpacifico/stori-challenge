import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Typography, Row, Col } from 'antd';
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
    <Layout >
     
      <Header style={{ padding: 13, background: colorBgContainer, height:130 }}>
        <Row>
          <Col span={4} style={{paddingLeft:20}}><img src="mailbox.png"  width="120px" height="120px"/></Col>
          <Col span={8} style={{verticalAlign:'top'}}>
            <Title>
              Stori NewsLetter
            </Title>
          </Col>
          <Col span={8}></Col>
      </Row>
        
          
        </Header>
      <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} theme='light' >
        <div className="demo-logo-vertical" />
        <Menu
          
          theme="light"
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
              label: 'Dashboard',
            },
            {
              key: '3',
              icon: <UserOutlined />,
              label: 'Users',
            },
          ]}
        />
      </Sider>
        <Content
          style={{
            margin: '24px 24px',
            padding: 24,            
            background: colorBgContainer,
            height:'100vh',
            borderRadius:15
          }}
        >
        <NewsLetterPage></NewsLetterPage>
          
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
