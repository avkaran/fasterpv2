import axios from 'axios';
import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Badge, Drawer, Spin } from 'antd';
import { List, Avatar, Skeleton, Card, Image, Space, Tag, Tooltip, Select, Table, Button, Anchor, Input } from 'antd';
import { PaginatedTable } from '../../../../../comp'
import { MyButton, DeleteButton } from '../../../../../comp'
import { Breadcrumb, Layout, Divider, Form } from 'antd';
import { HomeOutlined, EyeOutlined, EditOutlined, PayCircleOutlined, SearchOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { capitalizeFirst } from '../../../../../utils';
import { baseUrl } from '../../../../../utils';
import noImg from '../../../../../assets/images/no-img.jpg'
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faIndianRupeeSign, faUser, faMobileAlt } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const { Link } = Anchor;

const RenewalMembers = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);
    const filterColumns = useRef(null);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filterForm] = Form.useForm()
    const [districts, setDistricts] = useState([]);

    useEffect(() => {
        loadDistricts();
    }, []);

    const loadDistricts = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select distinct district from hospital_members"
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

            setDistricts(res);
        }).catch(err => {
            message.error(err);
            // setLoader(false);
        })
    }

    const onFilterFinish = (values) => {
        filterColumns.current = values;
        setRefreshTable(prev => prev + 1);
        setVisibleFilter(false);
    }

    const columns = [

        {
            title: 'S.No',
            dataIndex: 'row_number',
            key: 'row_number',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: "Hospital Name",
            align: "left",
            render: (text, item) => (
                <>
                    <div>{(item.name)}</div>
                    <div>{(item.mobile)}</div>
                </>
            )
        },
        {
            title: "Doctor Name",
            render: (text, record, index) => (
                <>
                    <div> Name : {(record.doctor_name)}</div>
                    <div>Address : {(record.address)}</div>
                </>
            ),
        },
        {
            title: "Expiry Date",
            width: "15%",
            render: (text, record, index) => (
                <>
                    <div> {moment(record.expiry_date).format('DD-MM-YYYY')}</div>
                </>
            ),
        },
        {
            title: "Member Status",

            align: "center",
            render: (text, record, index) => (
                <>
                    {record.member_status == 'live' ? <div style={{ color: 'green' }}>{(record.member_status)}</div> : <div style={{ color: 'red' }}>{(record.member_status)}</div>}
                </>
            ),
        },
        {
            title: "Manage",
           // width: '15%',
            align: "right",
            render: (object, item, index) => (
                <>
                    <Space>
                        {
                            item.member_status !== "LIVE" && (<Tooltip title="Pay"><Button type="default" shape="square" href={"#" + userId + "/admin/" + (item.member_status === "waiting" ? 'waiting' : 'renewal') + "/entry/" + item.id} >Pay Now</Button></Tooltip>)
                        }
                        <Tooltip title="Edit"><Button type="default" shape="circle" href={"#" + userId + "/admin/members/editpage/" + item.id} icon={<EditOutlined />} /></Tooltip>
                        <Tooltip title="View"> <Button type="primary" shape="circle" href={"#" + userId + "/admin/members/membertab/" + item.id} icon={<EyeOutlined />} /></Tooltip>

                    </Space>
                </>
            )
        },
    ];

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
                        <span>Renewal Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Renewal Members</Breadcrumb.Item>
                </Breadcrumb>
                <Spin spinning={initLoading} >
                    <Card
                        title="Renewal List"
                        bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                        style={{
                            margin: "0px",
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                            //borderRadius: "20px",
                        }}
                        extra={<Button type="primary" shape="square" icon={<SearchOutlined />} onClick={() => { setVisibleFilter(true) }}>search</Button>}
                    >
                        <PaginatedTable
                            columns={columns}
                            refresh={refreshTable}
                            countQuery={"select count(*) as count from hospital_members where status=1 and expiry_date <= CURDATE()" + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            listQuery={"select *,@rownum:=@rownum+1 as row_number from hospital_members CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1  and expiry_date <= CURDATE()" + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            itemsPerPage={10}
                        />
                        {/*  <InfiniteScroll
                            dataLength={data}
                            next={listData}
                            hasMore={data.length < 10}
                            //hasMore={data.length < 50}
                            loader={
                                <Skeleton
                                    avatar={{ size: 100 }}
                                    title
                                    paragraph={{
                                        rows: 1,
                                    }}
                                    active
                                />
                            }

                            scrollableTarget="scrollableDiv"
                        >
                            <Table
                                style={{ marginTop: '5px' }}
                                columns={columns}
                                bordered
                                dataSource={data}
                                striped
                            />
                        </InfiniteScroll> */}

                    </Card>

                </Spin>
            </Content>
            <Drawer title="Filter" placement="right" width={400} drawerStyle={{ marginTop: '40px' }} onClose={() => setVisibleFilter(false)} visible={visibleFilter}>
                <Form
                    name="basic"
                    form={filterForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFilterFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Hospital Name"
                        name="name"
                    >
                        <Input placeholder="Hospital Name" />
                    </Form.Item>

                    <Form.Item
                        label="Doctor Name"
                        name="doctor_name"
                    >
                        <Input placeholder="Doctor Name" />
                    </Form.Item>

                    <Form.Item
                        label="Mobile No"
                        name="mobile"
                    >

                        <Input
                            placeholder="Mobile Number"
                            type="number"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Email Id"
                        name="email_id"
                    >

                        <Input
                            placeholder="Email Id"
                            type="email"
                        />
                    </Form.Item>

                    <Form.Item
                        label="District"
                        name="district"
                    >
                        <Select placeholder="Select District">
                            {districts.map((item, i) => {
                                return <Select.Option value={item.district}>{item.district}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Hospital Type"
                        name="hospital_type"
                    >
                        <Select placeholder="Select Hospital Type">
                            <Select.Option value="Multi Speciality">Multi Speciality</Select.Option>
                            <Select.Option value="Single Speciality">Single Speciality</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
                        <Space>
                            <MyButton size="large" htmlType="submit">
                                Search
                            </MyButton>
                            <MyButton size="large" type="outlined" color={grey[5]} htmlType="button" onClick={() => filterForm.resetFields()}>
                                Reset
                            </MyButton>
                        </Space>
                    </Form.Item>
                </Form>
            </Drawer>
        </>
    );
}
export default RenewalMembers;