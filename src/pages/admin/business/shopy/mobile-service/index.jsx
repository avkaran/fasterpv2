import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditMobileService from './addEditMobileService'
import ViewMobileService from './viewMobileService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import dayjs from 'dayjs'
import randomColor from 'randomcolor';
const MobileServices = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [dialogType, setDialogType] = useState('container'); //container,modal,drawer
    const [formItemLayout, setFormItemLayout] = useState('two-column'); //one-column,two-column,two-column-wrap
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Mobile Service');
    const [refreshTable, setRefreshTable] = useState(0);
     useEffect(() => {
        //  loadData();
        if (context.isMobile) {
            setFormItemLayout('two-column-wrap');
            setDialogType('container')
        }
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
            title: 'Job Number',
            dataIndex: 'job_number',
            key: 'job_number',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Received Date',
           // dataIndex: 'price',
            key: 'received_date',
            render: (item) => <>{dayjs(item.received_date).format("DD/MM/YYYY hh:mm a")}</>,
        },
        {
            title: 'Customer',
            dataIndex: 'first_name',
            key: 'first_name',
            //render: (item) => <>{item.brand +"/"+ item.model_number}</>,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile_no',
            key: 'mobile_no',
           // render: (item) => <>{item.brand +"/"+ item.model_number}</>,
        },
        {
            title: 'Device',
           // dataIndex: 'price',
            key: 'brand',
            render: (item) => <>{item.brand +"/"+ item.model_number}</>,
        },
        {
            title: 'Complaint',
           dataIndex: 'complaint_names',
            key: 'complaint_names',
            //render: (item) => <>{item.brand +"/"+ item.model_number}</>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'current_status',
            render: (item) => <Tag color={parseInt(item.current_status) === 'Delivered' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.current_status}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {/* {context.isAdminResourcePermit(userId, 'mobile-services.edit-service-booking') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'mobile-services.delete-service-booking') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                     title="Mobile Service"
                     table="service_bookings"
                     //id must,+ give first three colums to display
                     dataItem={{ id: item.id, package_name: item.package_name, price: item.price, ref: item.id }}
                // avatar={context.baseUrl + item.course_image}
                />)}
 */}

            </Space>,
        },
    ]
    const onAddClick = () => {

        window.scrollTo(0, 0)
        setCurAction("add");
        if (dialogType === 'modal' || dialogType === "drawer")
            setVisibleModal(true);


    }
    const mobileHeader = <div className="appHeader">
        <div className="left">
            <a className="headerButton goBack" onClick={() => { setCurAction("list") }}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </a>
        </div>
        <div className="pageTitle">
            {capitalizeFirst(curAction) + " " + heading}
        </div>
        <div className="right">
            {
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'mobile-services.edit-service-booking') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
                    <FontAwesomeIcon icon={faPencil} />
                </a>)
            }
            {
                curAction === "edit" && viewOrEditData && (<a className="headerButton" onClick={() => setCurAction("view")}>
                    <FontAwesomeIcon icon={faEye} />
                </a>)
            }
        </div>
    </div>
    const onEditClick = (item) => {
        setViewOrEditData(item);
        window.scrollTo(0, 0)


        setCurAction("edit");
        if (dialogType === 'modal' || dialogType === "drawer")
            setVisibleModal(true);

    }
    const onViewClick = (item) => {
        window.scrollTo(0, 0)
        setViewOrEditData(item);
        setCurAction("view");
        if (dialogType === 'modal' || dialogType === "drawer")
            setVisibleModal(true);


    }
    const onAddEditListClick = () => {
        setCurAction("list");
        if (dialogType === 'modal' || dialogType === "drawer")
            setVisibleModal(false);

    }
    const onAddEditSaveFinish = () => {

        setCurAction("list");
        setRefreshTable(prev => prev + 1);
        if (dialogType === 'modal' || dialogType === "drawer")
            setVisibleModal(false);

    }
    const addEditComponents = () => {
        if (curAction === "view")
            return <ViewMobileService formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} />
        else if (curAction === "add")
            return <AddEditMobileService formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else if (curAction === "edit")
            return <AddEditMobileService formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
              
              
               

            </>
            )}
        </Space>
    const getSwipeLeftActions = (item) => {
        var tmpActions = [
            {
                key: 'view',
                text: <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>,
                color: green[1],


            },
            ,
        ]
        if (context.isAdminResourcePermit(userId, 'mobile-services.edit-service-booking')) {
            tmpActions.push({
                key: 'edit',
                text: <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onEditClick(item)} ><i class="fa-solid fa-pencil"></i></MyButton>,
                color: cyan[1],

            })
        }
        return tmpActions;
    }
    return (
        <>
            <ResponsiveLayout

                userId={userId}
                customHeader={context.isMobile && (curAction === 'add' || curAction === 'edit' || curAction === "view") ? mobileHeader : null}
                bottomMenues={null}
                showNav={null}
                breadcrumbs={[
                    { name: 'Mobile Services', link: null },
                    { name: 'List Services', link: null },
                ]}
            >
                {
                    !context.isMobile && (<>
                        {
                            dialogType === 'modal' && (<Modal
                                open={visibleModal}
                                zIndex={999}
                                footer={null}
                                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                                centered={false}
                                closable={true}
                                width={600}
                                onCancel={() => { setVisibleModal(false) }}
                                title={capitalizeFirst(curAction) + " " + heading}
                            >
                                {addEditComponents()}
                            </Modal>)
                        }
                        {
                            dialogType === "drawer" && (<Drawer
                                title={capitalizeFirst(curAction) + " " + heading}
                                placement="right"
                                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                                width={500}
                                onClose={() => { setVisibleModal(false) }}
                                open={visibleModal}
                                extra={rightButtons}
                            >
                                {addEditComponents()}
                            </Drawer>)
                        }
                        {
                            dialogType === 'container' && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading}
                                extra={rightButtons}>
                                {addEditComponents()}
                            </Card>)
                        }
                        <Card title="Mobile Services" extra={context.isAdminResourcePermit(userId, 'mobile-services.new-service-booking')?<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Mobile Service</MyButton>:null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from service_bookings b,users u where status=1 b.status=1 and b.user_id=u.id"
                                listQuery="select b.*,u.first_name,u.mobile_no,GROUP_CONCAT(c.complaint SEPARATOR ', ') AS complaint_names,@rownum:=@rownum+1 as row_num from service_bookings b,users u,service_complaint_types c CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.status=1 and b.user_id=u.id and FIND_IN_SET(c.id, b.complaints) group by b.id"
                                itemsPerPage={20}
                            />

                        </Card></>)
                }
                {
                    context.isMobile && (<>
                        {(curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>{addEditComponents()}</Card>)}
                        <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                            {
                                context.isAdminResourcePermit(userId, 'mobile-services.new-service-booking') &&  (<FloatButton type="primary" shape="circle" onClick={onAddClick} icon={<FontAwesomeIcon icon={faPlus} />}></FloatButton>)
                            }
                            
                            <AvatarMobileInfiniteList
                                header={<span>Mobile Services</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from service_bookings where status=1 "
                                listQuery="select * from service_bookings where status=1 "
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'mobile-services.delete-service-booking') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                title="Mobile Service"
                                                table="service_bookings"
                                                //id must,+ give first three colums to display
                                                dataItem={{ id: item.id, package_name: item.package_name, price: item.price, ref: item.id }}
                                                // avatar={context.baseUrl + item.course_image}
                                                />,
                                                //color: 'danger',
                                            },
                                        ] : []}
                                        leftActions={getSwipeLeftActions(item)}
                                    >
                                        <MList.Item
                                            onClick={() => { setViewOrEditData(item); onViewClick(item); }}
                                            style={{ textDecoration: 'none' }}
                                            key={item.id}
                                            prefix={
                                                <Avatar
                                                    // src={user.avatar}

                                                    style={{ borderRadius: 20, backgroundColor: randomColor() }}
                                                    fit='cover'
                                                    width={40}
                                                    height={40}
                                                >{item.package_name.charAt(0).toUpperCase()}</Avatar>
                                            }
                                            description={<>Price: {item.price}</>}
                                        >
                                            {item.package_name}
                                        </MList.Item>
                                    </SwipeAction>
                                }}
                            /></div></>)
                }




            </ResponsiveLayout>

        </>
    );
}
export default MobileServices;