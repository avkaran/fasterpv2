 
import React, { useState, useEffect } from 'react';
import {MyButton} from '../../../../../comp'
import { Breadcrumb, Layout, Spin,Card } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
const Profile = () => {
    const { Content } = Layout;
    const [loader] = useState(false);
    const [viewData] = useState({});
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <Breadcrumb.Item >
                        <span>page 1</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>page 2</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Blank Page" extra={<MyButton href="" ><i className="fa-solid fa-list pe-2" ></i>right button</MyButton>}>

                    <Spin spinning={loader} >
                        {viewData && Object.keys(viewData).length > 0 && (
                            <></>
                        )}
                    </Spin>
                </Card>

            </Content>

        </>
    );

}
export default Profile;
            