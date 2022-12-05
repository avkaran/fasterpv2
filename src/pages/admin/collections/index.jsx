import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import PsContext from '../../../context'
//import { useNavigate } from 'react-router-dom';
import { Row, Col, message } from 'antd';
import { List, Card, Space, Modal, Menu, Form, Input } from 'antd';
import { green, yellow, red, cyan, grey } from '@ant-design/colors';
import { Breadcrumb, Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faClose, faUserTimes, faEdit } from '@fortawesome/free-solid-svg-icons'
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { MyButton } from '../../../comp'
import { useParams } from 'react-router-dom';
const Collections = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    //const navigate = useNavigate();
    const { Content } = Layout;
    const [addEditForm] = Form.useForm();
    const [collectionData, setCollectionData] = useState([])
    const [selCollection, setSelCollection] = useState('')
    const [selCollectionValues, setSelCollectionValues] = useState([]);
    const [selTitle, setSelTitle] = useState('')
    const [menuItems, setMenuItems] = useState([]);
    const [visibleDeleteModal, setVisibleDeleteModal] = useState(false);
    const [visibleAddEditModal, setVisibleAddEditModal] = useState(false);
    const [viewData, setViewData] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addEditLoading, setAddEditLoading] = useState(false);
    useEffect(() => {
        let colData = context.psGlobal.collectionData;

        colData = colData.filter((item) => parseInt(item.is_editable) === 1)
        setCollectionData(colData)
        if (colData) {
            let d = [];
            colData.forEach((item) => {
                d.push({ label: context.psGlobal.capitalizeFirst(item.name.replace("-", " ")), key: item.id })
            })
            setSelCollection(colData[0].id);

            setMenuItems(d)
            /*  let d2 = colData.find((item) => item.id === 3);
             setSelCollection(d2)
             if (d2) {
                 let colValues = d2.collections.split(",");
                 colValues = colValues.sort((a, b) => a - b)
                 setSelCollectionValues(colValues)
                 setSelTitle(context.psGlobal.capitalizeFirst(d2.name.replace("-", " ")));
             } */
        }


        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onCollectionNameClick = (e) => {
        setSelCollection(parseInt(e.key));

    }
    const getTitle = () => {
        let d = collectionData.find((item) => parseInt(item.id) === selCollection);
        return d && context.psGlobal.capitalizeFirst(d.name.replace("-", " "));
    }
    const getCollectionValues = () => {
        let d = collectionData.find((item) => parseInt(item.id) === selCollection);
        if (d && d.collections !== '')
            return d.collections.split(",");
        else return [];
    }
    const handleDeleteCollectionValue = () => {
        setDeleteLoading(true);
        let d = collectionData.find((item) => parseInt(item.id) === selCollection);
        var colValues = d.collections.split(",");
        colValues.splice(viewData.index, 1);
        var reqData = { //if array of queries pass [] outside
            query_type: 'update',
            // query: "select * from members where id='" + id + "'",
            table: 'collections',
            where: { id: viewData.id },
            values: { collections: colValues.join(",") }

        };

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            context.updateGlobal().then((resInnser) => {
                if (resInnser) {
                    //update local data if required
                    let newColData = collectionData;
                    let changeIndex = collectionData.findIndex(item => item.id = selCollection);
                    newColData[changeIndex].collections = colValues.join(",");
                    setCollectionData(newColData);
                    setDeleteLoading(false);
                    setVisibleDeleteModal(false);
                }
            }).catch(err => {
                setDeleteLoading(false);
                setVisibleDeleteModal(false);
                message.error(err);
            })

        }).catch(err => {
            setDeleteLoading(false);
            setVisibleDeleteModal(false);
            message.error(err);
        })

    }
    const handleAddEditCollectionValue = (values) => {
        setAddEditLoading(true);
        let d = collectionData.find((item) => parseInt(item.id) === selCollection);
        var colValues = d.collections.split(",");
        if (viewData.type === 'edit') {

            colValues[viewData.index] = values.collection_value;
        }
        else if (viewData.type === 'add')
            colValues.push(values.collection_value)

        var reqData = { //if array of queries pass [] outside
            query_type: 'update',
            // query: "select * from members where id='" + id + "'",
            table: 'collections',
            where: { id: viewData.id },
            values: { collections: colValues.join(",") }

        };

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            context.updateGlobal().then((resInnser) => {
                if (resInnser) {
                    //update local data if required
                    let newColData = collectionData;
                    let changeIndex = collectionData.findIndex(item => item.id = selCollection);
                    newColData[changeIndex].collections = colValues.join(",");
                    setCollectionData(newColData);
                    setAddEditLoading(false);
                    setVisibleAddEditModal(false);
                }
            }).catch(err => {
                setVisibleAddEditModal(false);
                message.error(err);
            })

        }).catch(err => {
            setVisibleAddEditModal(false);
            message.error(err);
        })

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
                    <Breadcrumb.Item >
                        <UserOutlined />
                        <span>Add New Details</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Collections</Breadcrumb.Item>
                </Breadcrumb>
                <Row gutter={16}>
                    <Col className="gutter-row" span={6}>
                        <Card
                            bodyStyle={{
                                padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                                border: '1px solid',
                                borderBottom: '0',
                                borderColor: cyan[2]
                            }}
                            style={{
                                margin: "0px",
                                border: '1px solid #d9d9d9',
                                borderRadius: '2px',

                                //borderRadius: "20px",
                            }}


                        >Add New Details</Card>
                        <Menu
                            mode="inline"
                            theme="light"
                            onClick={onCollectionNameClick}
                            defaultSelectedKeys={[selCollection]}
                            style={{
                                width: '100%',
                                border: '1px solid',
                                borderColor: cyan[2],
                                borderTop: '0',
                            }}
                            items={menuItems}
                        />
                    </Col>
                    <Col className="gutter-row" span={18}>
                        <List
                            style={{ background: '#fff' }}
                            size="large"
                            header={<div style={{ fontWeight: 'bold', color: cyan[7] }}>{getTitle()}
                                <MyButton style={{ float: 'right' }}
                                    onClick={() => {
                                        setViewData({ type: 'add', id: selCollection, index: null, value: null });
                                        setVisibleAddEditModal(true);
                                        addEditForm.setFieldsValue({
                                            collection_value: '',
                                        })
                                    }}
                                ><FontAwesomeIcon icon={faPlus} /> &nbsp; Add</MyButton>
                            </div>}
                            // footer={<div>Footer</div>}
                            bordered
                            dataSource={getCollectionValues()}
                            renderItem={(item, index) => (
                                <List.Item key={index}
                                    actions={[
                                        <MyButton type="outlined" size="small" shape="circle"
                                            onClick={() => {
                                                setViewData({ type: 'edit', id: selCollection, index: index, value: item });

                                                addEditForm.setFieldsValue({
                                                    collection_value: item,
                                                })
                                                setVisibleAddEditModal(true);

                                            }} ><i className="fa-solid fa-pencil"

                                            ></i></MyButton>
                                        ,
                                        <MyButton type="outlined" size="small" shape="circle" color={red[7]}
                                            onClick={() => {
                                                setViewData({ id: selCollection, index: index, value: item });

                                                setVisibleDeleteModal(true);
                                            }}
                                        ><i className="fa-solid fa-trash"></i></MyButton>
                                        ,



                                    ]}
                                >
                                    {index + 1}. &nbsp;{item}
                                </List.Item>)}
                        />

                    </Col>
                </Row>

            </Content>
            <Modal
                visible={visibleDeleteModal}
                zIndex={10000}
                footer={<Space><MyButton color={yellow[2]} borderColor={grey.primary} onClick={() => setVisibleDeleteModal(false)}>Cancel</MyButton>
                    <MyButton color={red[1]} borderColor={red.primary} loading={deleteLoading} onClick={handleDeleteCollectionValue}>Delete</MyButton></Space>}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                // footer={null}
                onCancel={() => { setVisibleDeleteModal(false) }}
                title={<span style={{ color: red[4] }} ><FontAwesomeIcon icon={faUserTimes} /> &nbsp;Delete {viewData.value}?</span>}
            >
                <h5>Are you Sure to Delete {viewData.value}?</h5>
                Value : <span style={{ color: cyan[6], fontWeight: 'bold' }}>{viewData.value}</span>

            </Modal>
            <Modal
                visible={visibleAddEditModal}
                zIndex={10000}

                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                style={{ marginTop: '20px' }}
                width={600}
                footer={null}
                onCancel={() => { setVisibleAddEditModal(false) }}
                title={<span style={{ color: green[4] }} ><FontAwesomeIcon icon={faEdit} /> &nbsp;{viewData.type === 'edit' ? 'Edit' : 'Add'} {viewData.value}</span>}
            >

                <Form
                    name="basic"
                    form={addEditForm}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={handleAddEditCollectionValue}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >

                    <Row gutter={16}> {/* tow column row start */}
                        <Form.Item
                            label="Value"
                            name='collection_value'


                            rules={[{ required: true, message: 'Value is required' }]}
                        >
                            <Input placeholder="Enter Value" style={{ width: '100%' }} />
                        </Form.Item>


                    </Row> {/* tow column row end */}
                    <Row>
                        <Space>
                            <MyButton style={{ float: 'right' }} color={yellow[2]} borderColor={grey.primary}
                                onClick={() => setVisibleAddEditModal(false)}>Cancel
                            </MyButton>
                            <MyButton htmlType="submit" color={green[2]} borderColor={green.primary} loading={addEditLoading}
                            //onClick={() => handleAddEditCollectionValue(viewData.type, viewData.id, viewData.index, viewData.value)}
                            >Save
                            </MyButton>
                        </Space>
                    </Row>
                </Form>

            </Modal>


        </>
    );

}
export default Collections;