import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, DatePicker } from 'antd';
import { Space, Select, Tabs, Collapse, Input, Button, Card } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import SearchMemberLogsList from './searchMemberLogsList';
import { useParams } from 'react-router-dom';
const MemberLogsByAction = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Panel } = Collapse;
    const [searchForm] = Form.useForm();
    const { Option } = Select;
    const { Content } = Layout;
    const {action,actionBy}=useParams()
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
                    <Breadcrumb.Item>
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Members</Breadcrumb.Item>
                </Breadcrumb>

                <SearchMemberLogsList action={action} actionBy={actionBy} userId={userId}/>

            </Content>
        </>
    );

}
export default MemberLogsByAction;