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
import moment from 'moment';
import { useParams } from 'react-router-dom';
const { Link } = Anchor;
const RenewalRemainders = (props) => {
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

        var whereClauses = [];
        whereClauses.push("expiry_date>=CURDATE()")
        whereClauses.push("expiry_date<='" + moment().add(1, "days").format("YYYY-MM-DD") + "'")
        filterColumns.current = whereClauses;
        setRefreshTable(prev => prev + 1);
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
        var whereClauses = [];
        whereClauses.push("expiry_date>=CURDATE()")
        if(values.duration==="1-days")
        whereClauses.push("expiry_date<='" + moment().add(1, "days").format("YYYY-MM-DD") + "'")
        if(values.duration==="5-days")
        whereClauses.push("expiry_date<='" + moment().add(5, "days").format("YYYY-MM-DD") + "'")
        if(values.duration==="10-days")
        whereClauses.push("expiry_date<='" + moment().add(10, "days").format("YYYY-MM-DD") + "'")
        if(values.duration==="15-days")
        whereClauses.push("expiry_date<='" + moment().add(15, "days").format("YYYY-MM-DD") + "'")
        if(values.duration==="1-month")
        whereClauses.push("expiry_date<='" + moment().add(1, "month").format("YYYY-MM-DD") + "'")
        if(values.duration==="2-month")
        whereClauses.push("expiry_date<='" + moment().add(2, "month").format("YYYY-MM-DD") + "'")
        filterColumns.current = whereClauses;
        setRefreshTable(prev => prev + 1);

    }

    const columns = [

        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
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
                        <span>Expiring Members</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Expiring Members</Breadcrumb.Item>
                </Breadcrumb>
                <Spin spinning={initLoading} >
                    <Card title="Renewal Remainders">
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

                            <Row gutter={16}>
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Form.Item
                                        label="Expiry within"
                                        name="duration"
                                    >
                                        <Select placeholder="Duration">
                                            <Select.Option value="1-days">1 Day</Select.Option>
                                            <Select.Option value="5-days">5 Days</Select.Option>
                                            <Select.Option value="10-days">10 Days</Select.Option>
                                            <Select.Option value="15-days">15 Days</Select.Option>
                                            <Select.Option value="1-month">1 Month</Select.Option>
                                            <Select.Option value="2-month">2 Month</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>
                                    <Form.Item wrapperCol={{ offset: 8, span: 24 }}>

                                        <MyButton size="large" htmlType="submit">
                                            Search
                                        </MyButton>

                                    </Form.Item>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>

                                </Col>
                            </Row>


                        </Form>
                    </Card>
                    <Card
                        title="Renewal Reminder"
                        bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                        style={{
                            margin: "0px",
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                            //borderRadius: "20px",
                        }}
                    >
                        <PaginatedTable
                            columns={columns}
                            refresh={refreshTable}
                            countQuery={"select count(*) as count from hospital_members where status=1" + context.psGlobal.getWhereClause(filterColumns.current, false)}
                            listQuery={"select *,@rownum:=@rownum+1 as row_num from hospital_members CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1" + context.psGlobal.getWhereClause(filterColumns.current, false) + " order by expiry_date"}
                            itemsPerPage={10}
                        />
                    </Card>
                </Spin>
            </Content>

        </>
    );
}
export default RenewalRemainders;