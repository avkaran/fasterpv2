import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import { Breadcrumb, Layout } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const Blank = (props) => {
    const { Content } = Layout;
    useEffect(() => {
      
    }, []);
    return (
        <>

            <Content
                className="site-layout-background"
                style={{
                    padding: '5px 24px 0px 24px',
                    margin: 0

                }}
            >
                <Breadcrumb style={{ margin: '0', padding: '8px 0px 8px 0px' }}>
                    <Breadcrumb.Item href="">
                        <HomeOutlined />
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <UserOutlined />
                        <span>Application List</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Application</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                       
                    </Col>
                    <Col className="gutter-row" span={18}>
                       
                    </Col>
                </Row>

            </Content>

        </>
    );

}
export default Blank;