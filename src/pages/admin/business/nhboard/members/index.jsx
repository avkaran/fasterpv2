import axios from 'axios';
import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Badge, Drawer, Spin } from 'antd';
import { List, Avatar, Skeleton, Card, Image, Space, Tag, Tooltip, Select, Table, Button, Anchor, Input } from 'antd';
import { PaginatedTable } from '../../../../../comp'
import { MyButton, DeleteButton } from '../../../../../comp'
import { Breadcrumb, Layout, Divider, Form } from 'antd';
import { HomeOutlined, EyeOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
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

import moment from 'moment';

const { Link } = Anchor;

const ListMembers = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [refreshTable, setRefreshTable] = useState(0);
    const filterColumns = useRef(null);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [filterForm] = Form.useForm()
    const [listHeading, setListHeading] = useState('All Members');
    const [districts, setDistricts] = useState([]);
    const [countData, setCountData] = useState(null);

    useEffect(() => {
        // listData();
        loadDistricts();
        loadCountData()
    }, []);

    const listData = () => {
        try {
            setLoading(true);
            axios.get('v1/admin/listdata').then(res => {
                if (res['data'].status == '1') {
                    var d = res['data'].data;
                    setData(d);
                    setInitLoading(false);
                }
                else {
                    setLoading(false);
                }
            });
        }
        catch (er) {

        }
    }
    const loadCountData = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "SELECT member_status,count(*) as count FROM `hospital_members` where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + " group by member_status "
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {

            setCountData(res);
        }).catch(err => {
            message.error(err);
            // setLoader(false);
        })
    }
    const getCount = (status) => {
        if (countData) {
            if (status === "active") {
                var res = countData.find(item => item.member_status === "LIVE");
                return res ? res.count : 0;
            }
            else if (status === "inactive") {
                var res = countData.filter(item => item.member_status !== "LIVE");
                var count = 0;
                res.forEach(item => {
                    count = count + parseInt(item.count)
                })
                return count;
            }
        }

    }
    const loadDistricts = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select distinct district from hospital_members"
        };

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res) => {

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
        loadCountData();
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
            title: "Member Status",

            align: "center",
            render: (text, record, index) => (
                <>
                    {record.member_status == 'LIVE' ? <div style={{ color: 'green' }}>{(record.member_status)}</div> : <div style={{ color: 'red' }}>{(record.member_status)}</div>}
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
                            item.member_status !== "LIVE" && (<Tooltip title="Pay"><Button type="default" shape="square" href={"#" + props.match.params.userId + "/admin/" + (item.member_status === "waiting" ? 'waiting' : 'renewal') + "/entry/" + item.id} >Pay Now</Button></Tooltip>)
                        }
                        <Tooltip title="Edit"><Button type="default" shape="circle" href={"#" + props.match.params.userId + "/admin/members/editpage/" + item.id} icon={<EditOutlined />} /></Tooltip>
                        <Tooltip title="View"> <Button type="primary" shape="circle" href={"#" + props.match.params.userId + "/admin/members/membertab/" + item.id} icon={<EyeOutlined />} /></Tooltip>

                    </Space>
                </>
            )
        },
    ];
    const onFinishTopSearch = (values) => {

        var currentFilter = {};
        if (values.district && values.district !== '') {
            currentFilter.district = values.district
        }
        if (values.status && values.status !== '') {
            currentFilter.member_status = values.status;
        }
        filterColumns.current = currentFilter;
        setRefreshTable(prev => prev + 1);
        setVisibleFilter(false);
        loadCountData();
    }
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
                <Spin spinning={initLoading} >
                    <Card>
                        <Form
                            name="basic"
                            form={filterForm}
                            labelAlign="left"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 20 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinishTopSearch}
                            autoComplete="off"
                        >
                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={6}>
                                    <Form.Item
                                        label="Select"
                                        name="district"
                                    >
                                        <Select placeholder="District">
                                        <Select.Option value="">All District</Select.Option>
                                            {districts.map((item, i) => {
                                                return <Select.Option value={item.district}>{item.district}</Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>
                                    <Form.Item
                                        //label="Hospital Type"
                                        name="status"
                                    >
                                        <Select placeholder="Status">
                                            <Select.Option value="">All</Select.Option>
                                            <Select.Option value="LIVE">Active</Select.Option>
                                            <Select.Option value="RENEW">Inactive</Select.Option>
                                        </Select>
                                    </Form.Item>

                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>
                                    <MyButton size="large" htmlType="submit">
                                        Search
                                    </MyButton>


                                </Col>

                            </Row>
                        </Form>
                    </Card>

                    <Card
                        title={<>Member List &nbsp; &nbsp; &nbsp; <span style={{ color: green[7] }}>Active : {getCount('active')}</span>  &nbsp; &nbsp; &nbsp;<span style={{ color: red[7] }}>Inactive : {getCount('inactive')}</span></>}

                        bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                        style={{
                            margin: "0px",
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                        }}
                        extra={<Button type="primary" shape="square" onClick={() => { setVisibleFilter(true) }}> <FontAwesomeIcon icon={faFilter} /> Filter</Button>}
                    >
                        <PaginatedTable
                            columns={columns}
                            refresh={refreshTable}
                            countQuery={"select count(*) as count from hospital_members where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            listQuery={"select *,@rownum:=@rownum+1 as row_number from hospital_members CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            itemsPerPage={10}
                        />
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
export default ListMembers;