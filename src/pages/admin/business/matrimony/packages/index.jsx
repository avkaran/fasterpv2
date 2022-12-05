import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditPackage';
import AddEditPackage from './addEditPackage';
import ViewPackage from './viewPackage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';

const Packages = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Package');
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
            title: 'Plan Name',
            dataIndex: 'plan_name',
            key: 'plan_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Price',
            dataIndex: 'package_price',
            key: 'package_price',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Package for',
            dataIndex: 'package_for',
            key: 'package_for',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Contact Credits',
            dataIndex: 'consume_credits',
            key: 'consume_credits',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Benefits',
            //dataIndex: 'COLUMN_COMMENT',
           // key: 'package_status',
            render: (item) => <Space><Tag color={parseInt(item.is_send_sms) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>SMS</Tag><Tag color={parseInt(item.is_send_whatsapp) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>WAPP</Tag><Tag color={parseInt(item.is_vip) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>VIP</Tag></Space>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'package_status',
            render: (item) => <Tag color={item.package_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.package_status}</Tag>,
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
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => {setCurAction("list");setRefreshTable(prev=>prev+1);}}
                    title="Package"
                    table="packages"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, plan_name: item.plan_name, package_price: item.package_price, package_for: item.package_for }}
                    avatar={context.baseUrl + item.course_image}
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
                        <span>Packages</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Packages</Breadcrumb.Item>
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
                        {curAction === "view" && (<ViewPackage viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={props.match.params.userId} />)}
                        {curAction === "add" && (<AddEditPackage onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={props.match.params.userId} />)}
                        {curAction === "edit" && (<AddEditPackage editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={props.match.params.userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewPackage viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={props.match.params.userId} />)}
                        {curAction === "add" && (<AddEditPackage onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={props.match.params.userId} />)}
                        {curAction === "edit" && (<AddEditPackage editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={props.match.params.userId} />)}

                    </Card>)
                }
                <Card title="Packages" extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Package</MyButton>} style={{display:(curAction === "list" || isModal)?'block':'none'}}>
                   
                        <PaginatedTable
                         columns={tableColumns} 
                         refresh={refreshTable}
                         countQuery="select count(*) as count from packages where status=1 "
                         listQuery="select *,@rownum:=@rownum+1 as row_number from packages CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                         itemsPerPage={20}
                        />
                    
                </Card>
                

               
            </Content>

        </>
    );
}
export default Packages;