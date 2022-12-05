import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space, Form } from 'antd';
import { MyButton, FormItem } from '../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Radio, Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditCrmCategory from './addEditCrmCategory';
import ViewCrmCategory from './viewCrmCategory';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../utils';
const CrmCategoryList = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Categories');
    const [refreshTable, setRefreshTable] = useState(0);
    const [labels, setLabels] = useState([]);
    const [selType, setSelType] = useState('lead');
    const [labelLoading, setLabelLoading] = useState(false);
    const [selCategory, setSelCategory] = useState({});
    const [visibleLabelAddModal, setVisibleLabelAddModal] = useState(false);
    const [addLabelLoader, setAddLabelLoader] = useState(false);
    useEffect(() => {
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_number',
            key: 'row_number',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>

                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1) }}
                    title={heading}
                    table="case_categories"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, type: item.case_type, category: item.category_name, status: item.active_status }}
                // avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
        {
            title: 'Category Name',
            dataIndex: 'category_name',
            key: 'category_name',
            //render: (text) => <a>{text}</a>,
        },

        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'active_status',
            render: (item) => <Tag color={item.active_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.active_status}</Tag>,
        },
        {
            title: 'View Labels',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) =>
                <MyButton type="primary" size="small" shape="round" color={green[4]} borderColor="#000"
                    onClick={() => onViewLabelsClick(item)}
                >View Label</MyButton>
            ,
        },

    ]
    const tableColumnsLabel = [
        {
            title: 'S.No',
            // dataIndex: 'row_number',
            //  key: 'row_number',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },
        {
            title: 'label',
            dataIndex: 'label',
            key: 'label',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Color',
            //  dataIndex: 'label',
            // key: 'color',
            render: (item) => <a>{<div style={{ background: item.color, width: '20px', height: '20px',border:'1px solid black' }}></div>}</a>,
        },
        {
            title: '',
            render: (item) => <MyButton type="outlined" onClick={() => { onDeleteLabelClick(item) }}>delete</MyButton>
        }

    ]
    const onDeleteLabelClick = (item) => {
        /*  var curLabels = [];
         if(selCategory.labels)
         curLabels=selCategory.labels.split(",")
 
         curLabels.splice(item.index, 1); */
        console.log('labelitem', item)
    }
    const onAddClick = () => {
        setCurAction("add");

        if (isModal)
            setVisibleModal(true);

    }
    const onEditClick = (item) => {
        setViewOrEditData(item);
        setCurAction("edit");

        if (isModal)
            setVisibleModal(true);

    }
    const onViewLabelsClick = (item) => {
        setSelCategory(item);

        setLabelLoading(true);
        var curLabels = [];
        var curColors = []
        if (item.labels)
            curLabels = item.labels.split(",");

        //console.log('curcolors', item.colors)
        if (item.label_colors)
            curColors = item.label_colors.split(",");
        var labels = [];
        for (var i = 0; i < curLabels.length; i++) {
            labels.push({ label: curLabels[i], color: curColors[i] ? curColors[i] :'#fff'  })
        }
        setLabels(labels)
        setLabelLoading(false);
    }
    /*     const onViewLabelsClick = (id, labels) => {
            console.log(id);
            setSelCategory({ id:id, labels: labels })
            setLabelLoading(true);
            var reqData = {
                query_type: 'query', //query_type=insert | update | delete | query
                query: "select id, labels from case_categories where status=1" + id
            };
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
                setSelCategory(res);
                setLabelLoading(false);
            }).catch(err => {
                message.error(err);
                setLabelLoading(false);
            })
        } */
    const onTypeChange = ({ target: { value } }) => {
        setSelType(value);
        setRefreshTable(prev => prev + 1);
    }
    const addFormLabelOnFinish = (values) => {
        setAddLabelLoader(true);
        var label = values.label;
        var newLabels = []
        if (selCategory.labels)
            newLabels = selCategory.labels.split(",");
        newLabels.push(label);
        

        var reqDataUpdate = {
            query_type: 'update',
            table: 'case_categories',
            where : {id:selCategory.id},
            values: {labels:newLabels.join(","),label_colors:new Array(newLabels.length).fill('#fff').join(",")}

        };
        context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
            setAddLabelLoader(false);
            message.success('Label Added Successfullly');
            setRefreshTable(prev=>prev+1)
            setVisibleLabelAddModal(false);
        }).catch(err => {
            message.error(err);
            setAddLabelLoader(false);
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List {heading}</Breadcrumb.Item>
                </Breadcrumb>
                {
                    isModal && (<Modal
                        visible={visibleModal}
                        zIndex={999}
                        footer={null}
                        closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                        centered={false}
                        closable={true}
                        width={600}
                        onCancel={() => { setVisibleModal(false) }}
                        title={capitalizeFirst(curAction) + " " + heading}
                    >
                        {curAction === "view" && (<ViewCrmCategory viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditCrmCategory onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditCrmCategory editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewCrmCategory viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditCrmCategory onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditCrmCategory editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={"Catgories"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Radio.Group defaultValue="lead" optionType="button" buttonStyle="solid"
                            onChange={onTypeChange}>
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'case-types', 'radio')}
                        </Radio.Group>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={16}>


                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from case_categories where status=1  and case_type='" + selType + "'"}
                                listQuery={"select *,@rownum:=@rownum+1 as row_number from case_categories CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and case_type='" + selType + "'"}
                                itemsPerPage={10}
                            />


                        </Col>
                        <Col className='gutter-row' xs={24} xl={8}>
                            <Card
                                bodyStyle={{
                                    padding: "8px", fontWeight: 'bold', fontSize: '12px', color: cyan[7],
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


                            >{selCategory.category_name} {labels.length > 0 && (<MyButton type="primary" size="small" style={{ float: 'right' }}
                                onClick={() => { setVisibleLabelAddModal(true) }}><i className="fa-solid fa-plus pe-2" ></i> Add Label</MyButton>)}</Card>

                            <MyTable
                                columns={tableColumnsLabel}
                                dataSource={labels}
                                loading={labelLoading}
                            />

                        </Col>
                    </Row>


                </Card>



            </Content>
            <Modal
                visible={visibleLabelAddModal}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={600}
                onCancel={() => { setVisibleLabelAddModal(false) }}
                title={"Add Label"}
            >

                <Form
                    name="basic"
                    //form={addeditFormLabel}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addFormLabelOnFinish}
                    autoComplete="off"
                >

                    <FormItem
                        label="Label Name"
                        name="label"
                        rules={[{ required: true, message: 'Please Enter Label Name' }]}
                    >
                        <Input placeholder="Label Name" />
                    </FormItem>

                    <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={() => setVisibleLabelAddModal(false)}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit" loading={addLabelLoader}>
                                Save
                            </MyButton>
                        </Space>

                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
}
export default CrmCategoryList;;