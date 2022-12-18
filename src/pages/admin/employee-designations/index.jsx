import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space, Switch, Divider } from 'antd';
import { MyButton } from '../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Radio } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditDesignation';
import AddEditDesignation from './addEditDesignation';
import ViewDesignation from './viewDesignation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../utils';
import dayjs from 'dayjs';
const EmployeeDesignations = (props) => {
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
    const [heading] = useState('Employee Designation');
    const [refreshTable, setRefreshTable] = useState(0);
    const [applicationResources, setApplicationResources] = useState([]);
    const [selPermissions, setSelPermissions] = useState([]);
    const [permissionLoader, setPermissionLoader] = useState(false);
    const [selResource,setSelResource]=useState(null)
    useEffect(() => {
        //  loadData();
        loadApplicationResources()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
       setSelResource(null);
       setSelPermissions([]);
    }, [viewOrEditData]);
    const loadApplicationResources = () => {
        var reqData =
        {
            query_type: 'query',
            query: "select * from application_resources"
        }

        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var resources = [];
            res.forEach(item => {
                resources.push(
                    {
                        id: item.id,
                        resource_name: item.resource_name,
                        permission_types: item.permission_types.split(",")
                    }
                )
            })
            setApplicationResources(resources);
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
    }
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
                    table="designations"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, designation: item.designation, last_updated: dayjs(item.last_updated).toString(), note: 'Designation will be Deleted' }}
                // avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
        {
            title: 'Designation',
            dataIndex: 'designation',
            key: 'designation',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Permissions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) =>
                <MyButton type="primary" size="small" shape="round" color={green[4]} borderColor="#000"
                    onClick={() => onViewPermissionClick(item)}
                >View Permissions</MyButton>
            ,
        },

    ]
    const onViewPermissionClick = (item) => {
        setViewOrEditData(item);
       
       
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
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setCurAction("view");
        if (isModal)
            setVisibleModal(true);
    }
    const onResourceNameChange = ({ target: { value } }) => {
        setPermissionLoader(true);
        var curResource = applicationResources.find(item => item.resource_name === value);
        var curPermissions = [];
        if (curResource) {
            curResource.permission_types.forEach(item => {
                curPermissions.push({
                    resource_name: curResource.resource_name,
                    resource: item,
                    loader: false,
                    status: false
                })
            })
        }
        //load designation permissions and set.
        var reqData =
        {
            query_type: 'query',
            query: "select * from designation_permissions where designation_id='" + viewOrEditData.id + "' and resource like '" + value + ".%' and permission=1"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
           
            res.forEach(item => {
                var splitPerm = item.resource.split(".");
               
                var changeIndex = curPermissions.findIndex(obj => obj.resource_name === splitPerm[0] && obj.resource === splitPerm[1]);
                if (changeIndex!==-1){
                    curPermissions[changeIndex].status = true;
                }
            })
            setSelPermissions(curPermissions);
            setPermissionLoader(false);

        }).catch(err => {
            message.error(err);
        })
        setSelResource(value);

    }
    const onSwitchChange = (checked, item) => {
        var curPermissions = selPermissions;
        curPermissions = curPermissions.map(obj => {
            if (obj.resource_name === item.resource_name && obj.resource === item.resource) {
                obj.status = checked;
                obj.loader = true;
                return obj;

            }
            else return obj;
        }
        )
        setSelPermissions(curPermissions);

        var reqData = [{
            query_type: 'delete',
            table: 'designation_permissions',
            where: { designation_id: viewOrEditData.id, resource: item.resource_name + "." + item.resource },


        },
        {
            query_type: 'insert',
            table: 'designation_permissions',
            values: { designation_id: viewOrEditData.id, resource: item.resource_name + "." + item.resource, permission: checked ? 1 : 0 }

        }
        ];
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            curPermissions = curPermissions.map(obj => {
                if (obj.resource_name === item.resource_name && obj.resource === item.resource) {
                    obj.status = checked;
                    obj.loader = false;
                    return obj;
                }
                else return obj;
            }
            )
            setSelPermissions(curPermissions)
        }).catch(err => {
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List {heading + "s"}</Breadcrumb.Item>
                </Breadcrumb>
                <Modal
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
                    {curAction === "view" && (<ViewDesignation viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                    {curAction === "add" && (<AddEditDesignation onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                    {curAction === "edit" && (<AddEditDesignation editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false) }} userId={userId} />)}

                </Modal>

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewDesignation viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditDesignation onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditDesignation editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading + "s"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
                    <Row gutter={16}>
                        <Col className='gutter-row' xs={24} xl={12}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from designations where status=1 "
                                listQuery="select *,@rownum:=@rownum+1 as row_num from designations CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                                itemsPerPage={20}
                            />
                        </Col>
                        <Col className='gutter-row' xs={24} xl={12}>
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


                            >{viewOrEditData && viewOrEditData.designation}
                            </Card>
                            {
                               viewOrEditData  && (<Row style={{ marginBottom: '10px' }}>
                                <Radio.Group
                                    value={selResource}
                                    optionType="button" buttonStyle="solid"
                                    onChange={onResourceNameChange}
                                >
                                    {
                                        applicationResources.map(item => {
                                            return <Radio.Button value={item.resource_name}>{item.resource_name}</Radio.Button>
                                        })
                                    }
                                </Radio.Group>
                            </Row>)
                            }
                            
                            <Divider />
                            <Spin spinning={permissionLoader}>
                                <Row style={{ marginBottom: '10px' }}>
                                    <table style={{ width: '100%' }}>
                                        {
                                            selPermissions.map(item => {
                                                return <tr><td style={{ padding: "5px 5px 15px 5px" }}>{item.resource}</td><td style={{ padding: "5px 5px 15px 5px" }}><Switch checkedChildren="Yes" unCheckedChildren="No" checked={item.status} style={{ width: "70px" }} onChange={(checked) => onSwitchChange(checked, item)} loading={item.loader} /></td></tr>
                                            })
                                        }
                                    </table>
                                </Row>
                            </Spin>

                        </Col>
                    </Row>

                </Card>



            </Content>

        </>
    );
}
export default EmployeeDesignations;