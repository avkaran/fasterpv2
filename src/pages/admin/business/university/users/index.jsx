import axios from 'axios';
import PsContext from '../../../../../context'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Row, Col, message, Badge, Drawer, Spin } from 'antd';
import { List, Avatar, Skeleton, Card, Image, Space, Tag, Tooltip, Select } from 'antd';
import { MyButton, DeleteButton } from '../../../../../comp'
import { Breadcrumb, Layout, Divider, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { capitalizeFirst } from '../../../../../utils';
import { baseUrl } from '../../../../../utils';
import noImg from '../../../../../assets/images/no-img.jpg';
import { blue, red, cyan, grey } from '@ant-design/colors';
import { useMediaQuery } from 'react-responsive';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import moment from 'moment';
import { useParams } from 'react-router-dom';
const ListUsers = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visibleFilter, setVisibleFilter] = useState(false);
    const [data, setData] = useState([]);

    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    // const [countData, setCountData] = useState([]);
    const filterColumns = useRef(null);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0)
    const [recordsPerRequest] = useState(10);
    const hasMoreData = useRef(false)
    const [country, setCountry] = useState('');
    const [filterForm] = Form.useForm()
    const [listHeading, setListHeading] = useState('All Users')
    const loadMoreData = () => {


        if (loading) {
            return;
        }
        setLoading(true);

        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from users where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false) + "  order by created_date desc LIMIT " + currentFetchedRecords.current + "," + recordsPerRequest,
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };
        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        // form.append('mode','dev');
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                setData([...data, ...res['data'].data]);

                currentFetchedRecords.current = currentFetchedRecords.current + res['data'].data.length;
                if (currentTotalRecords.current > currentFetchedRecords.current)
                    hasMoreData.current = true;


                if (currentFetchedRecords.current < recordsPerRequest)
                    hasMoreData.current = false;


                setLoading(false);
                setInitLoading(false);

            }
            else {

                setLoading(false);

            }

        });

    };
    const loadUserCounts = () => {

        axios.post('v1/admin/user-counts').then(res => {
            if (res['data'].status === '1') {
                // setCountData(res['data'].data);
                let d = res['data'].data.find((item) => item.category === "all_users");

                currentTotalRecords.current = d ? parseInt(d.count) : 0;

                currentFetchedRecords.current = 0;
                loadMoreData();
            }
            else {
                message.error(res['data'].message || 'Error');
            }

        });

    };
    useEffect(() => {

        loadUserCounts();
        if (props.match.params.filter_text) {
            let value = props.match.params.filter_text;
            let finalColumns = {};
            if (value === 'male')
                finalColumns.user_status = 'Male'
            else if (value === 'female')
                finalColumns.gender = 'Female'
            else if (value === 'today')
                finalColumns.created_date = moment().format("YYYY-MM-DD");
            filterColumns.current = finalColumns;

            resetResult();
            var heading = capitalizeFirst(value.replace("_", " ")) + " Users "
            setListHeading(heading);
            //console.log(filterColumns.current)
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFilterFinish = (values) => {
        /*  var processedValues = {};
         Object.entries(values).forEach(([key, value], index) => {
             if (value) processedValues[key] = value;
         }); */
        filterColumns.current = values

        resetResult();
        setVisibleFilter(false);
        var headings = [];
        var count = 1;
        Object.entries(values).forEach(([key, value]) => {
            if (value && count < 4) {
                headings.push(capitalizeFirst(key.replace("_", " ")) + ":" + value);
                count++;
            }
        });

        let heading = "Filter Users [ " + headings.join(",") + (Object.keys(values).length > 4 ? "..." : "") + "]";
        setListHeading(heading);
    }
    const resetResult = () => {
        setInitLoading(true);
        //reset records
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select count(*) AS count from users where status=1 " + context.psGlobal.getWhereClause(filterColumns.current, false),
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
                        <span>Manage Users</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Users</Breadcrumb.Item>
                </Breadcrumb>
                <Spin spinning={initLoading} >
                    <Card
                        bodyStyle={{ padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7] }}
                        style={{
                            margin: "0px",
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',

                            //borderRadius: "20px",
                        }}


                    >{listHeading} ({currentTotalRecords.current})

                        <MyButton style={{ float: 'right' }} href={"#/"+userId+"/admin/users/add-user"}> <i class="fa-solid fa-plus pe-2"></i> Add</MyButton>
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
                                            <MyButton type="outlined" size="large" shape="circle" href={"#/"+userId+"/admin/users/view/" + item.id} ><i class="fa-solid fa-eye"></i></MyButton>
                                        </Tooltip>, <Tooltip title="Edit">
                                            <MyButton type="outlined" size="large" shape="circle" color={blue[7]} href={"#/"+userId+"/admin/users/edit/" + item.id} ><i class="fa-solid fa-pencil"></i></MyButton>
                                        </Tooltip>,

                                        <DeleteButton type="outlined" size="large" shape="circle" color={red[7]} onFinish={() => resetResult()}
                                            title="User"
                                            table="users"
                                            //id must,+ give first three colums to display
                                            dataItem={{ id: item.id, name: item.title + " " + item.first_name + " " + item.last_name, mobile_no: item.mobile_no, age: item.age }}
                                            avatar={context.baseUrl + item.photo}
                                        />


                                        ]}>

                                        <List.Item.Meta
                                            avatar={<Badge color="cyan" count={index + 1}><Avatar size={100} shape="circle" src={<Image
                                                width={100}
                                                src={baseUrl + item.photo}
                                                fallback={noImg}
                                            />
                                            } /></Badge>}
                                            title={<span style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.title} {item.first_name} {item.last_name}, {item.age} Yrs</span>}
                                            description={
                                                <div>
                                                    <span style={{ color: cyan[6], }}><i class="fa-solid fa-location-dot"></i> {item.address + "," + item.country + "," + item.state + ","}</span>

                                                </div>
                                            }
                                        />
                                        <div>
                                            <Row>
                                                <Space>
                                                    <Tag color="cyan" style={{ fontWeight: 'bold' }}>{item.user_id}</Tag>


                                                </Space>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <List
                                                        size="small"

                                                    >

                                                        <List.Item style={{ paddingLeft: '0px' }}>Email &nbsp;:  <span style={{ color: cyan[6], }}>{item.email}</span></List.Item>
                                                        <List.Item style={{ paddingLeft: '0px' }}>Mobile :  <span style={{ color: cyan[6], }}>{item.mobile_no}</span></List.Item>
                                                    </List>
                                                </Col>

                                            </Row>
                                        </div>

                                    </List.Item>
                                )}
                            />
                        </InfiniteScroll>
                    </div>

                </Spin>
            </Content>
            <Drawer title="Filter" placement="right" width={400} drawerStyle={{ marginTop: '40px' }} onClose={() => setVisibleFilter(false)} visible={visibleFilter}>
                <Form
                    name="basic"
                    form={filterForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ reuser: true }}
                    onFinish={onFilterFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
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
            </Drawer>
        </>
    );

}
export default ListUsers;