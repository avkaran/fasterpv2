import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditBusinessName';
import AddEditBusinessName from './addEditBusinessName';
import ViewBusinessName from './viewBusinessName';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../../utils';

const BusinessNames = (props) => {
    const context = useContext(PsContext);
    const {userId}=  useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Business Name');
    const [refreshTable, setRefreshTable] = useState(0);
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
            title: 'Business Name',
            dataIndex: 'business_name',
            key: 'business_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Email Id',
            dataIndex: 'email_id',
            key: 'email_id',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'business_status',
            render: (item) => <Tag color={item.business_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.business_status}</Tag>,
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
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{ setCurAction("list");setRefreshTable(prev=>prev+1)}}
                title={heading}
                    table="business_names"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id,business_name:item.business_name, phone: item.phone, email_id: item.email_id }}
                   // avatar={context.baseUrl + item.course_image}
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
                    <Breadcrumb.Item>List {heading+"s"}</Breadcrumb.Item>
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
                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditBusinessName onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditBusinessName editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewBusinessName viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditBusinessName onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditBusinessName editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading+"s"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                   
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery="select count(*) as count from business_names where status=1 "
                         listQuery="select *,@rownum:=@rownum+1 as row_number from business_names CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                         itemsPerPage={20}
                        />
                    
                </Card>
                

               
            </Content>

        </>
    );
}
export default BusinessNames;