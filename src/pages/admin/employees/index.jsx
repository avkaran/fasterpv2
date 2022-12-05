import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditEmployee from './addEditEmployee';
import ViewEmployee from './viewEmployee';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../utils';
const Employees = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Employee');
    const [refreshTable, setRefreshTable] = useState(0);
    useEffect(() => {
      //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onFinishDelete=(id)=>{
        //delete user
        var reqData = { 
            query_type: 'update',
            table:'vi_users',
            where:{ref_id:id,ref_table_column:"employees.id"},
            values:{status:0}

        };
        context.psGlobal.apiRequest(reqData,context.adminUser(userId).mode).then((res)=>{
            setCurAction("list")
            setRefreshTable(prev=>prev+1);
           
        }).catch(err => {
            message.error(err);
            setLoader(false);
        })
        
         
    }
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_number',
            key: 'row_number',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Emp Code',
            dataIndex: 'employee_code',
            key: 'employee_code',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'employee_status',
            render: (item) => <Tag color={item.employee_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.employee_status}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={onFinishDelete}
                title={heading}
                    table="employees"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id,employee_code:item.employee_code, name: item.name, mobile_no: item.mobile_no }}
                   avatar={context.baseUrl + item.photo}
                />

            </Space>,
        },
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
    const onViewClick = (item) => {
        setViewOrEditData(item);
        setCurAction("view");
        if (isModal)
            setVisibleModal(true);
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
                        <span>{heading+"s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Employee</Breadcrumb.Item>
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
                        {curAction === "view" && (<ViewEmployee viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditEmployee onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditEmployee editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Employees</Button>}>

                        {curAction === "view" && (<ViewEmployee viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditEmployee onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditEmployee editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading+" List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                   
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery="select count(*) as count from employees e,vi_users u where e.status=1 and u.status=1 and  e.employee_code not in('admin','dev') and u.ref_table_column='employees.id' and e.id=u.ref_id"
                         listQuery="select e.*,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),e.dob)), '%Y')) AS age,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),e.doj)), '%Y')) AS maturity,u.username,u.password,u.active_status,b.branch_name,d.designation,@rownum:=@rownum+1 as row_number from employees e,vi_users u,branches b,designations d CROSS JOIN (SELECT @rownum:={rowNumberVar}) crj where e.status=1 and u.status=1 and e.employee_code not in('admin','dev') and u.ref_table_column='employees.id' and e.id=u.ref_id and e.branch_id=b.id and e.designation_id=d.id"
                         itemsPerPage={20}
                        />
                    
                </Card>
                

               
            </Content>

        </>
    );
}
export default Employees;