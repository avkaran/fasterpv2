import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space,Form } from 'antd';
import { MyButton,FormItem } from '../../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Radio,Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditCaste';
import AddEditCaste from './addEditCaste';
import ViewCaste from './viewCaste';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../../utils';

const CasteList = (props) => {
    const context = useContext(PsContext);
    const {userId}=  useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Caste');
    const [refreshTable, setRefreshTable] = useState(0);
    const [subCastes, setSubCastes] = useState([]);
    const [selReligion, setSelReligion] = useState('இந்து');
    const [subCasteLoading, setSubCasteLoading] = useState(false);
    const [selCaste, setSelCaste] = useState({});
    const [visibleSubCasteAddModal, setVisibleSubCasteAddModal] = useState(false);
    const [addSubCasteLoader,setAddSubCasteLoader] = useState(false);
    useEffect(() => {
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
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
                    table="castes"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, religion: item.religion, caste: item.caste_name, status: item.caste_status }}
                // avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
        {
            title: 'Caste',
            dataIndex: 'caste_name',
            key: 'caste_name',
            //render: (text) => <a>{text}</a>,
        },

        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'caste_status',
            render: (item) => <Tag color={item.caste_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.caste_status}</Tag>,
        },
        {
            title: 'View Sub Caste',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) =>
                <MyButton type="primary" size="small" shape="round" color={green[4]} borderColor="#000"
                    onClick={() => onViewSubCasteClick(item.id, item.caste_name)}
                >View SubCaste</MyButton>
            ,
        },

    ]
    const tableColumnsSubCaste = [
        {
            title: 'S.No',
            // dataIndex: 'row_num',
            //  key: 'row_num',
            render: (item, object, index) => <strong>{index + 1}</strong>,
        },

        {
            title: 'Sub Caste',
            dataIndex: 'caste_name',
            key: 'caste_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: '',
            render: (item) => <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{onViewSubCasteClick(selCaste.id,selCaste.caste_name);}}
                title='SubCaste'
                table="castes"
                //id must,+ give first three colums to display
                dataItem={{ id: item.id, religion: selReligion, master_caste: selCaste.caste_name, caste: item.caste_name }}
            // avatar={context.baseUrl + item.course_image}
            />
        }

    ]
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
    const onViewSubCasteClick = (caste_id, caste_name) => {
        setSelCaste({ id: caste_id, caste_name: caste_name })
        setSubCasteLoading(true);
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select id,caste_name from castes where status=1 and master_caste_id=" + caste_id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res, error) => {
            setSubCastes(res);
            setSubCasteLoading(false);
        }).catch(err => {
            message.error(err);
            setSubCasteLoading(false);
        })
    }
    const onReligionChange = ({ target: { value } }) => {
        setSelReligion(value);
        setRefreshTable(prev => prev + 1);
    }
    const addFormSubCasteOnFinish=(values)=>{
        setAddSubCasteLoader(true);
        var processedValues = {};
        processedValues['religion']=selReligion;
        processedValues['master_caste_id']=selCaste.id;
        processedValues['caste_name']=values.caste_name;
        var reqDataInsert = {
            query_type: 'insert',
            table: 'castes',
            values: processedValues

        };
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
            setAddSubCasteLoader(false);
            message.success('SubCaste Added Successfullly'); 
            setVisibleSubCasteAddModal(false);
        }).catch(err => {
            message.error(err);
            setAddSubCasteLoader(false);
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
                    <Breadcrumb.Item>List {heading + "s"}</Breadcrumb.Item>
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
                        {curAction === "view" && (<ViewCaste viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditCaste onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditCaste editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewCaste viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditCaste onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditCaste editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading + "s"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
                    <Row style={{ marginBottom: '10px' }}>
                        <Radio.Group defaultValue="இந்து" optionType="button" buttonStyle="solid"
                            onChange={onReligionChange}>
                            {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion', 'radio')}
                        </Radio.Group>
                    </Row>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={16}>


                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from castes where status=1 and master_caste_id is null and religion='" + selReligion + "'"}
                                listQuery={"select *,@rownum:=@rownum+1 as row_num from castes CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and master_caste_id is null and religion='" + selReligion + "'"}
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


                            >{selCaste.caste_name} {subCastes.length > 0 && (<MyButton type="primary" size="small" style={{ float: 'right' }}
                                onClick={() => { setVisibleSubCasteAddModal(true) }}><i className="fa-solid fa-plus pe-2" ></i> Add SubCaste</MyButton>)}</Card>

                            <MyTable
                                columns={tableColumnsSubCaste}
                                dataSource={subCastes}
                                loading={subCasteLoading}
                            />

                        </Col>
                    </Row>


                </Card>



            </Content>
            <Modal
                visible={visibleSubCasteAddModal}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={600}
                onCancel={() => { setVisibleSubCasteAddModal(false) }}
                title={"Add Sub Caste"}
            >

                <Form
                    name="basic"
                    //form={addeditFormSubCaste}
                    labelAlign="left"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={addFormSubCasteOnFinish}
                    autoComplete="off"
                >

                    <FormItem
                        label="SubCaste Name"
                        name="caste_name"
                        rules={[{ required: true, message: 'Please Enter SubCaste Name' }]}
                    >
                        <Input placeholder="SubCaste Name" />
                    </FormItem>

                    <Form.Item wrapperCol={{ offset: 10, span: 24 }}>
                        <Space>
                            <Button size="large" type="outlined" onClick={() => setVisibleSubCasteAddModal(false)}>
                                Cancel
                            </Button>
                            <MyButton size="large" type="primary" htmlType="submit" loading={addSubCasteLoader}>
                                Save
                            </MyButton>
                        </Space>

                    </Form.Item>

                </Form>
            </Modal>
        </>
    );
}
export default CasteList;