import axios from 'axios';
import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Badge, Drawer, Spin } from 'antd';
import { List, Avatar, Skeleton, Card, Image, Space, Tag, Tooltip, Select, Input, Modal } from 'antd';
import { MyButton, DeleteButton } from '../../../../../comp'
import { useParams,useNavigate } from 'react-router-dom';
import { Breadcrumb, Layout, Divider, Form, Collapse } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { capitalizeFirst } from '../../../../../utils';
import { baseUrl } from '../../../../../utils';
import { green, blue, red, cyan, grey, purple } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { faIndianRupeeSign, faUser, faMobileAlt, faGreaterThan, faSearch, faClose } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import dayjs from 'dayjs';
import ViewProfile from './viewProfile';
import { heightList } from '../../../../../models/core'
const Matrimony = (props) => {
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
    const ageWhereClause = useRef('')
    const [isViewProfile,setIsViewProfile]=useState(false);
    const [viewMember,setViewMember]=useState(null);
    const loadMoreData = () => {


        if (loading) {
            return;
        }
        setLoading(true);


        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where is_matrimony_member='1' and status='1'" + ageWhereClause.current + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc LIMIT " + currentFetchedRecords.current + "," + recordsPerRequest,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };

        context.psGlobal.apiRequest(reqData, "dev").then((res) => {
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
        resetResult();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
   
    const onFilterFinish = (values) => {
        // setInitLoading(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value], index) => {
            if (value)
                processedValues[key] = value;
        });
        var wherClause = ""
        if (processedValues.age_from) {
            if (processedValues.age_to) {
                wherClause = wherClause + " and ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) > " + processedValues.age_from + " and ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y'))<" + processedValues.age_to + " ";
                delete processedValues.age_from;
                delete processedValues.age_to;
            }
            else {
                wherClause = wherClause + " and ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) > " + processedValues.age_from + " ";
                delete processedValues.age_from;
            }

        }
        if (processedValues.height_from) {
            if (processedValues.height_to) {
                wherClause = wherClause + "and height>" + processedValues.height_from + " and height<" + processedValues.height_to + " ";
                delete processedValues.height_from;
                delete processedValues.height_to;
            }
            else {
                wherClause = wherClause + "and height>" + processedValues.height_from + " ";
                delete processedValues.height_to;
            }
        }
        if (processedValues.weight_from) {
            if (processedValues.weight_to) {
                wherClause = wherClause + "and weight>" + processedValues.weight_from + " and weight<" + processedValues.weight_to + " ";
                delete processedValues.weight_from;
                delete processedValues.weight_to;
            }
            else {
                wherClause = wherClause + "and weight>" + processedValues.weight_from + " ";
                delete processedValues.weight_to;
            }
        }
        ageWhereClause.current = wherClause;

        filterColumns.current = processedValues
        setVisibleFilter(false)
        resetResult();

    }

    const resetResult = () => {
        
        setInitLoading(true);
        //reset records
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select count(*) as count from members where  is_matrimony_member='1' and status='1' " + ageWhereClause.current + context.psGlobal.getWhereClause(filterColumns.current, false),
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
    const getWeightList = () => {

        let options = [];
        for (var index = 35; index <= 70; index++) {
            options.push(<Option key={index} value={index}>{index} Kg</Option>)
        }
        return options;
    };
    return (
        <>
         
                {!isViewProfile   && (<Spin spinning={initLoading} >
                        <Card
                            bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                            style={{
                                margin: "0px",
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px',

                                //borderRadius: "20px",
                            }}


                        >
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
                        <div
                            id="scrollableDiv"
                            style={{
                                height: '80vh',
                                overflow: 'auto',
                                padding: '0 24px',
                                border: '1px solid rgba(140, 140, 140, 0.35)',
                                background: '#fff',

                            }}
                        >
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
                                scrollableTarget="scrollableDiv"
                            >
                                <List
                                    dataSource={data}
                                    itemLayout={isMobile ? "vertical" : "horizontal"}
                                    //grid={{gutter: 16, column: 4}}
                                    // header={<div>Event List <Button style={{ float: 'right' }}>test</Button></div>}
                                    renderItem={(item, index) => (
                                        <List.Item key={item.id}

                                            actions={[<Tooltip title="View">
                                                <MyButton type="outlined" size="large" color={cyan[7]} shape="round" onClick={()=>{
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
                                                title={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.name}, {item.age} Yrs</span>}
                                                description={
                                                    <div>
                                                        Marital Status : <span style={{ color: cyan[6], }}>{item.marital_status}</span><br />
                                                        Qualification &nbsp;&nbsp;: <span style={{ color: cyan[6], }}>{item.qualification + ', ' + item.higher_study}</span><br />
                                                        <span style={{ color: cyan[6], }}><i class="fa-solid fa-location-dot"></i> {item.city}, {item.state}, {item.country}</span>

                                                    </div>
                                                }
                                            />
                                            <div>
                                                {/* <Row>
                                                    <Space>
                                                        <Tag color="cyan" style={{ fontWeight: 'bold' }}>{item.member_id}</Tag>
                                                        <Tag color="cyan" style={{ fontWeight: 'bold' }}>{item.member_id}</Tag>
                                                    </Space>
                                                </Row> */}
                                                <Row>
                                                    <Col span={12}>
                                                        <List
                                                            size="small"
                                                            style={{ width: '200px' }}

                                                        >

                                                            <List.Item style={{ paddingLeft: '0px' }}>Manai &nbsp;:  <span style={{ color: cyan[6], }}>{item.manai}</span></List.Item>
                                                            <List.Item style={{ paddingLeft: '0px' }}>Member Id :  <span style={{ color: cyan[6], }}>{item.member_id}</span></List.Item>
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
                        </div>

                    </Spin>)}
                    {isViewProfile && viewMember && (<ViewProfile memberData={viewMember} showBackButton={true} onBack={()=>{
                        setIsViewProfile(false);
                    }}/>)}
                    
             

            <Modal title="Search Profiles"
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
                        label="Age"
                    // name="membership_plan"
                    // rules={[{ required: true, message: 'Enter Amount' }]}
                    >
                        <Input.Group compact>
                            <Form.Item
                                // label="Amount"
                                name="age_from"

                                noStyle >
                                <Select placeholder="From" style={{ width: '120px' }}>
                                    {getAge()}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                //  label="Amount"
                                name="age_to"
                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                noStyle>
                                <Select placeholder="To" style={{ width: '120px' }}>
                                    {getAge()}
                                </Select>
                            </Form.Item>

                        </Input.Group>
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
                        label="Marital Status"
                        name="marital_status"
                    >
                        <Select placeholder="Select Marital Status">
                            <Select.Option value='Single'>Single</Select.Option>
                            <Select.Option value='Widowed'>Widowed</Select.Option>
                            <Select.Option value='Separated'>Separated</Select.Option>
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

                    <Form.Item
                        label="Height"
                    // name="membership_plan"
                    // rules={[{ required: true, message: 'Enter Amount' }]}
                    >
                        <Input.Group compact>
                            <Form.Item
                                // label="Amount"
                                name="height_from"

                                noStyle>
                                <Select placeholder="From" style={{ width: '140px' }}>
                                    {heightList.map(item => <Option key={item.cm} value={item.cm}>{item.label}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                //  label="Amount"
                                name="height_to"
                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                noStyle>
                                <Select placeholder="To" style={{ width: '140px' }}>
                                    {heightList.map(item => <Option key={item.cm} value={item.cm}>{item.label}</Option>)}
                                </Select>
                            </Form.Item>

                        </Input.Group>
                    </Form.Item>
                    <Form.Item
                        label="Weight"
                    // name="membership_plan"
                    // rules={[{ required: true, message: 'Enter Amount' }]}
                    >
                        <Input.Group compact>
                            <Form.Item
                                // label="Amount"
                                name="weight_from"

                                noStyle>
                                <Select placeholder="From" style={{ width: '140px' }}>
                                    {getWeightList()}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                //  label="Amount"
                                name="weight_to"
                                // rules={[{ required: true, message: 'Enter Amount' }]}
                                noStyle>
                                <Select placeholder="To" style={{ width: '140px' }}>
                                    {getWeightList()}
                                </Select>
                            </Form.Item>

                        </Input.Group>
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
export default Matrimony;