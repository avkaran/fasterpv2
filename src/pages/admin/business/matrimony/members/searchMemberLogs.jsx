import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Spin, DatePicker } from 'antd';
import { Space, Select, Tabs, Collapse, Input, Button, Card } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import SearchMemberLogsList from './searchMemberLogsList';

const SearchMemberLogs = (props) => {
    const context = useContext(PsContext);

    const { Panel } = Collapse;
    const [searchForm] = Form.useForm();
    const { Option } = Select;
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
                    <Breadcrumb.Item>
                        <span>Manage Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Members</Breadcrumb.Item>
                </Breadcrumb>

                <SearchMemberLogsList action="add-new-member" actionBy="employee" userId={props.match.params.userId}/>

            </Content>
        </>
    );

}
export default SearchMemberLogs;