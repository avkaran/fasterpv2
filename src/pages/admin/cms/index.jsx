import axios from 'axios';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams,Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Row, Col, message, Spin } from 'antd';
import { List, Avatar, Button, Skeleton, Card, Checkbox, Image, Space, Modal, Tooltip } from 'antd';
import { Breadcrumb, Layout, Divider } from 'antd';
import { HomeOutlined, UserOutlined, CloseOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import { capitalizeFirst, currentInstance, businesses } from '../../../utils';
import { baseUrl } from '../../../utils';
import noImg from '../../../assets/images/no-img.jpg'
import { red, yellow, cyan, grey } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes } from '@fortawesome/free-solid-svg-icons'
import { getWhereClause } from '../../../models/core'
import PsContext from '../../../context'
import { MyButton, MyTable } from '../../../comp';
import dayjs from 'dayjs'
import ResponsiveLayout from '../layout'
const ListContents = (props) => {
    const { Content } = Layout;
    const context = useContext(PsContext);
const {userId}=useParams();
    const { contentype } = useParams()
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [data, setData] = useState([]);
    const [viewData, setViewData] = useState({});
    const filterColumns = useRef(null);
    const currentTotalRecords = useRef(0);
    const currentFetchedRecords = useRef(0)
    const [recordsPerRequest] = useState(10);
    const hasMoreData = useRef(false)
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [listType, setListType] = useState('list');
    const loadMoreData = () => {
        if (loading) {
            return;
        }
        setLoading(true);
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select * from contents where type='" + contentype + "' and status=1" + getWhereClause(filterColumns.current, false) + " ORDER BY created_date DESC",
            // table:'test',
            // where:{id:'1'},
            //values:{name:'senthil',age:'13'}

        };

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            if (res) {
                setData([...data, ...res]);
                currentFetchedRecords.current = currentFetchedRecords.current + res.length;
                if (currentTotalRecords.current > currentFetchedRecords.current)
                    hasMoreData.current = true;


                if (currentFetchedRecords.current < recordsPerRequest)
                    hasMoreData.current = false;
                setLoading(false);
                setInitLoading(false);
            }
            else {
                message.error(error);
                setLoading(false);
            }

        })
    };

    useEffect(() => {
        // console.log('info',businesses[currentInstance])
        if (businesses[currentInstance.index].cmsContentListType)
            setListType(businesses[currentInstance.index].cmsContentListType);
        resetResult();
        loadCategoryFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentype]);
    const loadCategoryFilter = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select ct.id,ct.category_name,count(*) as count from contents c,content_categories ct where c.category=ct.id and c.type='" + contentype + "' and c.status=1 group by ct.id"
        };
        //if array of queries reqdata should be
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            setListCategories(res);
        }).catch(err => {
            message.error(err);
            // setLoader(false);
        })
    }

    const resetResult = () => {
        //reset records
        setInitLoading(true);
        var form = new FormData();
        var reqData = { //if array of queries pass [] outside
            query_type: 'query',
            query: "select count(*) AS count from contents where type='" + contentype + "' AND status=1 " + getWhereClause(filterColumns.current, false),
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
    const handleDeleteContent = (id) => {
        setDeleteLoading(true);
        var form = new FormData();
        var reqData = {
            query_type: 'update',
            //query: '',
            table: 'contents',
            where: { id: id },
            values: { status: 0 }

        };

        form.append('queries', context.psGlobal.encrypt(JSON.stringify(reqData)))
        axios.post('v1/admin/db-query', form).then(res => {
            if (res['data'].status === '1') {

                resetResult();
                setDeleteLoading(false);
                setVisibleDeleteModal(false)
                message.success('Deleted')

            }
            else {
                toast.error(res['data'].message || 'Error');
                setDeleteLoading(false);
            }

        });
    }
    const onApplyFilter = () => {

        filterColumns.current = { category: selectedCategories };
        resetResult();
    }
    return (
        <>
            <ResponsiveLayout

                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[
                    { name: capitalizeFirst(contentype) + ' List', link: null },
                    { name: 'List ' + capitalizeFirst(contentype), link: null },
                ]}
            >

                <Spin spinning={initLoading} >
                    <Row gutter={16}>
                        <Col className="gutter-row" span={18}>
                            <Card
                                bodyStyle={{ padding: "8px", fontSize: '18px' }}
                                style={{
                                    margin: "0px",
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '2px',

                                    //borderRadius: "20px",
                                }}


                            >{capitalizeFirst(contentype)} List ({currentTotalRecords.current})
                                <Link to={"/" + userId + "/admin/contents/" + contentype + "/add"}><MyButton  style={{ float: 'right' }}><i className="fa-solid fa-plus pe-2" ></i>Add {contentype}</MyButton></Link>
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
                                {
                                    listType === "list" && (<List
                                        dataSource={data}
                                        //grid={{gutter: 16, column: 4}}
                                        // header={<div>Event List <Button style={{ float: 'right' }}>test</Button></div>}
                                        renderItem={(item) => (
                                            <List.Item key={item.email}
                                                style={{ backgroundColor: '#fff' }}
                                                actions={[<Tooltip title="View">
                                                    <Link to={"/" + userId + "/admin/contents/" + contentype + "/view/" + item.id}><Button type="primary" shape="circle"  icon={<EyeOutlined />} /></Link>
                                                </Tooltip>, <Tooltip title="Edit">
                                                   <Link to={"/" + userId + "/admin/contents/" + contentype + "/edit/" + item.id} > <Button type="default" shape="circle" icon={<EditOutlined />}/></Link>
                                                </Tooltip>, <Tooltip title="Delete">
                                                    <Button type="danger" shape="circle" icon={<DeleteOutlined />} onClick={() => { setVisibleDeleteModal(true); setViewData(item); }} />
                                                </Tooltip>]}>
                                                <List.Item.Meta
                                                    avatar={<Avatar size={100} shape="square" src={<Image
                                                        width={100}
                                                        src={item.feature_image ? baseUrl +'/cloud-file/'+ encodeURIComponent(encodeURIComponent(item.feature_image)) : noImg}
                                                    />
                                                    } />}
                                                    title={<span style={{ fontSize: '15px' }}>{item.title}</span>}
                                                    description={
                                                        <div>
                                                            {item.content && item.content}
                                                            {item.content_html && item.content_html.replace(/<[^>]*>?/gm, '').substring(0, 100)}

                                                        </div>
                                                    }
                                                />
                                                <div>
                                                    {/* <List
                                                        size="small"
                                                        //header={<div>Header</div>}
                                                        // footer={<div>Footer</div>}
                                                        bordered
                                                        dataSource={[
                                                            { title: 'Views', count: 6 },
                                                            { title: 'Comments', count: 7 },
                                                            { title: 'Likes', count: 8 }
                                                        ]}
                                                        renderItem={item => <List.Item><Tag color="cyan">{item.count}</Tag>{item.title}</List.Item>}
                                                    /> */}
                                                </div>
                                            </List.Item>
                                        )}
                                    />)
                                }
                                {
                                    listType === "table" && (<MyTable dataSource={data}
                                        columns={
                                            [{
                                                title: 'S.No',
                                                // dataIndex: 'COLUMN_NAME',
                                                // key: 'column_name',
                                                render: (item, object, index) => <strong>{index + 1}</strong>,
                                            },
                                            {
                                                title: 'Title',
                                                dataIndex: 'title',
                                                key: 'title',
                                                //render: (text) => <a>{text}</a>,
                                            },
                                            {
                                                title: 'Created Date',
                                                //dataIndex: 'creat',
                                                // key: 'seo_slug',
                                                render: (item) => <span>{dayjs(item.created_date, 'YYYY-MM-DD').format('DD/MM/YYYY')} </span>,
                                            },
                                            {
                                                title: 'Action',
                                                // dataIndex: 'COLUMN_COMMENT',
                                                // key: 'description',
                                                render: (item, object, index) => <>
                                                    <Space><Button type="primary" size="small" shape="circle" href={"#" + userId + "/admin/contents/" + contentype + "/view/" + item.id} icon={<EyeOutlined />} />

                                                        <Button type="default" size="small" shape="circle" href={"#" + userId + "/admin/contents/" + contentype + "/edit/" + item.id} icon={<EditOutlined />} />

                                                        <Button type="danger" size="small" shape="circle" icon={<DeleteOutlined />} onClick={() => { setVisibleDeleteModal(true); setViewData(item); }} /></Space>
                                                </>,
                                            },]
                                        }></MyTable>)
                                }

                            </InfiniteScroll>

                        </Col>
                        <Col className="gutter-row" span={6}>
                            <Card
                                bodyStyle={{ padding: "8px", fontSize: '18px', color: cyan[5] }}
                                style={{
                                    margin: "0px",
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '2px',


                                    //borderRadius: "20px",
                                }}


                            ><i className="fa-solid fa-filter pe-2" ></i>Filter<Button type='ghost' size="small" style={{ float: 'right' }} onClick={onApplyFilter}>Apply</Button>

                            </Card>
                            <Row style={{ backgroundColor: '#fff' }}>
                                <Checkbox.Group onChange={(checkedValues) => setSelectedCategories(checkedValues)}>
                                    {listCategories.map(item => {
                                        return <Row style={{ paddingLeft: '5px', marginTop: '10px' }}><Checkbox value={item.id}>{item.category_name + " (" + item.count + ")"}</Checkbox></Row>
                                    })}
                                </Checkbox.Group>
                            </Row>

                        </Col>

                    </Row>

                </Spin>

            </ResponsiveLayout>

            <Modal
                visible={visibleDeleteModal}
                zIndex={10000}
                footer={<Space><Button type="ghost" style={{ fontWeight: 'bold', color: grey.primary, borderColor: yellow.primary, background: yellow[1], borderRadius: '5px' }} onClick={() => setVisibleDeleteModal(false)}>Cancel</Button>
                    <Button type="ghost" style={{ fontWeight: 'bold', color: grey.primary, borderColor: red.primary, background: red[1], borderRadius: '5px' }} loading={deleteLoading} onClick={() => { handleDeleteContent(viewData.id) }}>Delete</Button></Space>}
                closeIcon={<Button type="default" shape="circle" icon={<CloseOutlined />} />}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleDeleteModal(false) }}
                title={<span style={{ color: red[4] }} ><FontAwesomeIcon icon={faUserTimes} /> &nbsp;Delete  {capitalizeFirst(contentype)}?</span>}
            >
                <h5>Are you Sure to Delete below {capitalizeFirst(contentype)}?</h5>
                <Row gutter={16}>
                    <Col className='gutter-row' xs={24} xl={6}>
                        <Avatar size={100}
                            shape="square"
                            src={<Image
                                width={100}
                                src={baseUrl +'/cloud-file/'+ encodeURIComponent(encodeURIComponent(viewData.feature_image))}
                                preview={false}
                                fallback={noImg} />
                            }
                        />
                    </Col>
                    <Col className='gutter-row' xs={24} xl={18}>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={6}>Title</Col>
                            <Col className='gutter-row' xs={24} xl={18} >: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.title}</span></Col>
                        </Row>
                        {/*  <Row gutter={16} style={{ marginTop: '6px' }}>
                            <Col className='gutter-row' xs={24} xl={6}>Category</Col>
                            <Col className='gutter-row' xs={24} xl={18}>: <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.category }</span></Col>
                        </Row> */}

                    </Col>
                </Row>

            </Modal>



        </>
    );

}
export default ListContents;