import axios from 'axios';
import PsContext from '../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Badge, Drawer, Spin } from 'antd';
import { List, Avatar, Skeleton, Card, Image, Space, Tag, Tooltip, Select, Input, Modal } from 'antd';
import { MyButton, DeleteButton } from '../../../../comp'
import { withRouter, useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Divider, Form, Collapse } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { capitalizeFirst } from '../../../../utils';
import { baseUrl } from '../../../../utils';
import { green, blue, red, cyan, grey, purple } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faIndianRupeeSign, faUser, faMobileAlt, faGreaterThan, faSearch, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import moment from 'moment';
import ViewProfile from '../matrimony/viewProfile'
import { heightList } from '../../../../models/core'
import './blink.css';
const CustomerMembers = (props) => {
    const context = useContext(PsContext);
    const { Option } = Select;
    const { Content } = Layout;
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const filterColumns = useRef(null);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0)
    const [recordsPerRequest] = useState(10);
    const hasMoreData = useRef(false)
    const [country, setCountry] = useState('');
    const [filterForm] = Form.useForm()
    const [listHeading, setListHeading] = useState('All Members');
    const [loggedUserData, setLoggedUserData] = useState(null);
    const [isViewProfile, setIsViewProfile] = useState(false);
    const [viewMember, setViewMember] = useState(null);
    const [countData, setCountData] = useState([]);
    const loadMoreData = () => {


        if (loading) {
            return;
        }
        setLoading(true);


        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where  status='1' " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc LIMIT " + currentFetchedRecords.current + "," + recordsPerRequest,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };

        context.psGlobal.apiRequest(reqData, context.customerUser.mode).then((res) => {
            setData([...data, ...res]);

            currentFetchedRecords.current = currentFetchedRecords.current + res.length;
            if (currentTotalRecords.current > currentFetchedRecords.current)
                hasMoreData.current = true;


            if (currentFetchedRecords.current < recordsPerRequest)
                hasMoreData.current = false;


            setLoading(false);
            setInitLoading(false);

        }).catch(err => {
            message.error(err);
            setLoading(false);
        })


    };

    const getAge = () => {
        var ages = [];
        for (var i = 18; i < 80; i++) {
            ages.push(<Select.Option value={i}>{i} Years</Select.Option>)
        }
        return ages;
    }
    useEffect(() => {

        loadCurrentUser();
        resetResult();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        loadMemberCounts();
        if (props.match.params.filter_text) {
            let value = props.match.params.filter_text;
            let finalColumns = {};
            if (value === 'active')
                finalColumns.member_status = 'active'
            else if (value === 'waiting')
                finalColumns.member_status = 'waiting'
            else if (value === 'otp_unverified')
                finalColumns.is_otp_verified = '0'
            else if (value === 'unpaid')
                finalColumns.payment_status = 'unpaid'
            else if (value === 'paid')
                finalColumns.payment_status = 'paid'
            else if (value === 'ec_members')
                finalColumns.membership_plan = 'EC Member'
            else if (value === 'today')
                finalColumns.created_date = moment().format("YYYY-MM-DD")
            else if (value === 'matrimony')
                finalColumns.is_matrimony_member = 1
            filterColumns.current = finalColumns;

            resetResult();
            var heading = capitalizeFirst(value.replace("_", " ")) + " Members "
            setListHeading(heading);
            //console.log(filterColumns.current)
        };

    }, []);
    const loadCurrentUser = async () => {

        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from members where id='" + context.customerUser.id + "'"
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
            setLoggedUserData(res[0])
        }).catch(err => {
            message.error(err);


        })


    }
    const onFilterFinish = (values) => {
        // setInitLoading(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value], index) => {
            if (value)
                processedValues[key] = value;
        });
        filterColumns.current = processedValues
        setVisibleFilter(false)
        resetResult();

    }

    const resetResult = () => {
        if (!loggedUserData) return;
        setInitLoading(true);
        //reset records
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select count(*) as count from members where  status='1' " + context.psGlobal.getWhereClause(filterColumns.current, false),
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                currentTotalRecords.current = res['data'].data[0].count;
                currentFetchedRecords.current = 0;
                data.length = 0
                loadMoreData()
            }
            else {

                message.error("Error")

            }

        });

    }
    const getCount = (status) => {

        if (countData) {

            let d = countData.find((item) => item.member_status === status);

            return d && parseInt(d.count);
        }
        else
            return ''

    }
    const getWeightList = () => {

        let options = [];
        for (var index = 35; index <= 70; index++) {
            options.push(<Option key={index} value={index}>{index} Kg</Option>)
        }
        return options;
    };
    const loadMemberCounts = () => {

        axios.post('v1/admin/member-counts').then(res => {
            if (res['data'].status === '1') {
                setCountData(res['data'].data);
                // console.log('counts', res['data'].data)
                let d = res['data'].data.find((item) => item.member_status === "all_members");

                currentTotalRecords.current = d ? parseInt(d.count) : 0;

                currentFetchedRecords.current = 0;
                loadMoreData();
            }
            else {
                message.error(res['data'].message || 'Error');
            }

        });

    };
    const handleTopButtonsClick = (value) => {
        let finalColumns = { status: '1' };
        if (value === 'matrimony')
            finalColumns.is_matrimony_member = '1'
        else if (value === 'active')
            finalColumns.member_status = 'active'
        else if (value === 'waiting')
            finalColumns.member_status = 'waiting'
        else if (value === 'otp_unverified')
            finalColumns.is_otp_verified = '0'
        else if (value === 'unpaid')
            finalColumns.payment_status = 'unpaid'
        else if (value === 'paid')
            finalColumns.payment_status = 'paid'
        else if (value === 'ec_members')
            finalColumns.membership_plan = 'EC Member'
        filterColumns.current = finalColumns;
        resetResult();
        var heading = capitalizeFirst(value.replace("_", " ")) + " Members "
        setListHeading(heading);

    }
    return (
        <>
            <div class="main-content right-chat-active" >

                <div  style={{ paddingTop: context.isMobile?'50px':'20px' }}>
                    {!isViewProfile && (<Spin spinning={initLoading} >
                        <Card
                            bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                            style={{
                                margin: "0px",
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px',

                                //borderRadius: "20px",
                            }}


                        >
                            <Row style={{ background: '#fff', padding: '10px' }}>
                                <Space >
                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('matrimony')}> Matrimony Members ({getCount('matrimony')}) </MyButton>
                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('active')}> Active/Approved Members ({getCount('active')}) </MyButton>

                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('waiting')}> Waiting for approval ({getCount('waiting')})</MyButton>

                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('otp_unverified')}> OTP Not Verified ({getCount('otp_unverified')})</MyButton>



                                </Space>
                            </Row>
                            <Row style={{ background: '#fff', padding: '10px' }}>
                                <Space >
                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('unpaid')}> Unpaid Members ({getCount('unpaid')})</MyButton>

                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('paid')}> Paid Members ({getCount('paid')})</MyButton>

                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => handleTopButtonsClick('ec_members')}> EC Members ({getCount('ec_members')})</MyButton>

                                    <MyButton type="outlined" shape="round" color={cyan[7]} borderColor={cyan[5]} size="small" onClick={() => setVisibleFilter(true)}> <FontAwesomeIcon icon={faFilter} />...</MyButton>
                                </Space>
                            </Row>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <MyButton onClick={() => setVisibleFilter(true)}> <FontAwesomeIcon icon={faSearch} /> Search</MyButton>
                                </Col>
                                <Col span={12} align="center">
                                    {"All Members"} ({currentTotalRecords.current})
                                </Col>

                                <Col span={6}>
                                    <MyButton style={{ float: 'right' }} onClick={() => setVisibleFilter(true)}><FontAwesomeIcon icon={faSearch} /> Search</MyButton>
                                </Col>

                            </Row>



                        </Card>

                        <InfiniteScroll
                            dataLength={currentFetchedRecords.current}
                            next={loadMoreData}
                            hasMore={hasMoreData.current}
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
                            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}

                        >
                            <List
                                dataSource={data}
                                itemLayout={isMobile ? "vertical" : "horizontal"}
                                //grid={{gutter: 16, column: 4}}
                                // header={<div>Event List <Button style={{ float: 'right' }}>test</Button></div>}
                                renderItem={(item, index) => (
                                    <List.Item key={item.id}

                                        actions={[<Tooltip title="View">
                                            <MyButton type="outlined" size="large" color={cyan[7]} shape="round" onClick={() => {
                                                setIsViewProfile(true);
                                                setViewMember(item);
                                            }} ><i class="fa-solid fa-eye"></i> View</MyButton>
                                        </Tooltip>,

                                        ]}>

                                        <List.Item.Meta
                                            avatar={<Badge color="cyan" count={index + 1}><Avatar size={100} shape="circle" src={<Image
                                                width={100}
                                                src={baseUrl + item.photo}
                                                fallback={context.noImg}
                                            />
                                            } /></Badge>}
                                            title={<span className={item.payment_status === 'paid' ? 'notblinking' : 'blinking'}>{item.name}, {item.age} Yrs</span>}
                                            description={
                                                <div>
                                                    Marital Status : <span style={{ color: cyan[6], }}>{item.marital_status}</span><br />
                                                    Qualification &nbsp;&nbsp;: <span style={{ color: cyan[6], }}>{item.qualification + ', ' + item.higher_study}</span><br />
                                                    <span style={{ color: cyan[6], }}><i class="fa-solid fa-location-dot"></i> {item.city}, {item.state}, {item.country}</span>

                                                </div>
                                            }
                                        />
                                        <div>
                                            <Row>
                                                <Space>
                                                    <Tag color="cyan" style={{ fontWeight: 'bold' }}>{item.member_id}</Tag>
                                                    {item.member_status === 'active' ?
                                                        <Tag color="green" style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faUser} style={{ color: green[6] }} /> &nbsp;Active</Tag>
                                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faUser} style={{ color: red[6] }} /> &nbsp;Waiting</Tag>}
                                                    {parseInt(item.is_otp_verified) === 1 ?
                                                        <Tag color="green" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: green[6] }} /> &nbsp;Verified</Tag>
                                                        : <Tag color="red" style={{ fontWeight: 'bold', width: '100px' }}><FontAwesomeIcon icon={faMobileAlt} style={{ color: red[6] }} /> &nbsp;Not Verified</Tag>}
                                                    {item.payment_status === 'paid' ?
                                                        <Tag color="green" style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: green[6] }} /> &nbsp;Paid</Tag>
                                                        : <MyButton type="outlined" className="ant-tag ant-tag-red" size="small" color={red[7]} borderColor={red[5]} style={{ fontWeight: 'bold', width: '80px' }}><FontAwesomeIcon icon={faIndianRupeeSign} style={{ color: red[6] }} />&nbsp; Unpaid</MyButton>}

                                                </Space>
                                            </Row>
                                            <Row>
                                                <Col span={12}>
                                                    <List
                                                        size="small"

                                                    >

                                                        <List.Item style={{ paddingLeft: '0px' }}>Manai &nbsp;:  <span style={{ color: cyan[6], }}>{item.manai}</span></List.Item>
                                                        <List.Item style={{ paddingLeft: '0px' }}>Mobile :  <span style={{ color: cyan[6], }}>{item.mobile_no}</span></List.Item>
                                                    </List>
                                                </Col>
                                                <Col span={12}>
                                                    <List
                                                        size="small"
                                                    >

                                                        <List.Item>Service :  <span style={{ color: cyan[6], }}>{item.service}</span></List.Item>
                                                        <List.Item>Zone &nbsp;&nbsp;&nbsp;&nbsp;:  <span style={{ color: cyan[6], }}>{item.prefered_zone}</span></List.Item>
                                                    </List>
                                                </Col>

                                            </Row>
                                        </div>

                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll>


                    </Spin>)}
                    {isViewProfile && viewMember && (<ViewProfile memberData={viewMember} showBackButton={true} onBack={() => {
                        setIsViewProfile(false);
                    }} />)}

                </div>

            </div>

            <Modal title="Search Members"
                onCancel={() => setVisibleFilter(false)} visible={visibleFilter}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                //centered={false}
                footer={null}
                closable={true}

                width={600}>
                <Form
                    name="basic"
                    form={filterForm}
                    labelAlign="left"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ remember: true }}
                    onFinish={onFilterFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >


                    <Form.Item
                        label="Name"
                        name="name"
                    // rules={[{ required: true, message: 'Please Enter Name' }]}
                    >
                        <Input placeholder="Name" />
                    </Form.Item>

                    <Form.Item
                        label="Mobile No"
                        name="mobile_no"
                    // rules={[{ required: true, message: 'Please Enter Mobile No' }]}
                    >

                        <Input
                            placeholder="Mobile Number"

                        //onChange={phone => {}}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Gender"
                        name="gender"
                    //labelCol={{ span: 8 }}
                    // wrapperCol={{ offset: 6, span: 6 }}

                    >
                        <Select placeholder="Select Gender" >
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Member Type"
                        name='member_type'
                       // rules={[{ required: true, message: 'Please Enter Member Type' }]}
                    >

                        <Select
                            showSearch
                            placeholder="Member Type"

                            optionFilterProp="children"
                            //onChange={memberTypeOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'member-types')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Marital Status"
                        name="marital_status"
                    >
                        <Select placeholder="Select Marital Status">
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Specification"
                        name="specification"

                    >
                        <Select placeholder="Select Specification">
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'specification')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Manai"
                        name="manai"

                    >
                        <Select placeholder="Select Manai">
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'manai')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Service"
                        name="service"

                    >
                        <Select placeholder="Select Service">
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'service')}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Country"
                        name="country"

                    >
                        <CountryDropdown
                            className="ant-input"
                            // value={country}
                            onChange={(val) => setCountry(val)} />
                    </Form.Item>
                    <Form.Item
                        label="State"
                        name="state"


                    >
                        <RegionDropdown
                            country={country}
                            className="ant-input"
                        //value={region}
                        //onChange={(val) => this.selectRegion(val)} 
                        />
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
            </Modal>





        </>
    );

}
export default CustomerMembers;