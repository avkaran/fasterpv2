import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar,Radio } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditBooking from './addEditBooking';
import ViewBooking from './viewBooking';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import randomColor from 'randomcolor';
import moment from 'moment';
const Bookings = (props) => {
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
    const [heading] = useState('Booking');
    const [refreshTable, setRefreshTable] = useState(0);
    const [selBookingType, setSelBookingType] = useState('tour')
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
            title: 'Booking No',
            dataIndex: 'booking_no',
            key: 'booking_no',
            // render: (item) => <>{item.total_cost}</>,
        },
        {
            title: 'User',
           // dataIndex: 'booking_no',
            key: 'booking_no',
            render: (item) => <>{item.title +item.first_name+" "+(item.last_name?item.last_name:'')}</>,
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile_no',
            key: 'mobile_no',
            // render: (item) => <>{item.total_cost}</>,
        },
        {
            title: selBookingType === 'tour' ? 'Package Name' : 'Hotel',
            dataIndex: 'name',
            key: 'name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Travel Date',
            // dataIndex: 'Travel Date',
            key: 'date',
            render: (item) => <>{moment(item.date).format("DD/MM/YYYY")}</>,
        },
        {
            title: 'Total Cost',
            // dataIndex: 'location',
            key: 'total_cost',
            render: (item) => <>{item.total_cost}</>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'booking_status',
            render: (item) => <Tag color={item.booking_status === 'approved' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.booking_status}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'bookings.edit-booking') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'bookings.delete-booking') &&  false && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="Booking"
                    table="bookings"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, name: item.name, booking_type: item.booking_type, booking_no: item.booking_no }}
                //avatar={context.baseUrl + item.hotel_image}
                />)}


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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'bookings.edit-booking') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
            return <ViewBooking formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} />
        else if (curAction === "add")
            return <AddEditBooking formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else if (curAction === "edit")
            return <AddEditBooking formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'bookings.edit-booking') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'bookings.delete-booking') && false && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="Booking"
                        table="bookings"
                        //id must,+ give first three colums to display
                        dataItem={{ id: viewOrEditData.id, name: viewOrEditData.name, booking_type: viewOrEditData.booking_type, booking_no: viewOrEditData.booking_no }}
                    // avatar={context.baseUrl + item.course_image}
                    />)
                }

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
        if (context.isAdminResourcePermit(userId, 'bookings.edit-booking')) {
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
                    { name: 'Bookings', link: null },
                    { name: 'List Packages', link: null },
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
                        <Card title="Bookings" 
                        //extra={context.isAdminResourcePermit(userId, 'bookings.add-new-booking') ? <MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Booking</MyButton> : null}
                        
                        style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>
                            <Row gutter={16} style={{marginBottom:'5px'}}>
                                <Col xs={24} xl={4}>
                                    <Radio.Group defaultValue="tour" buttonStyle="solid" onChange={(e) => {setSelBookingType(e.target.value);setRefreshTable(prev=>prev+1)}} >
                                        <Radio.Button value="tour">Tours</Radio.Button>
                                        <Radio.Button value="hotel">Hotels</Radio.Button>
                                    </Radio.Group>
                                </Col>
                                <Col xs={24} xl={4}>
                                </Col>
                            </Row>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from bookings where status=1 "
                                listQuery={selBookingType === 'hotel' ? "select b.*,CONCAT(r.room_type,'-',h.hotel_name) as name,u.first_name,u.title,u.last_name,u.mobile_no,@rownum:=@rownum+1 as row_num from bookings b,hotels h,hotel_rooms r,users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.status=1 and b.booking_type='hotel' and b.room_or_tour_id=r.id  and r.hotel_id=h.id and b.user_id=u.id" : "select b.*,p.package_name as name,u.first_name,u.title,u.last_name,u.mobile_no,@rownum:=@rownum+1 as row_num from bookings b,tour_packages p,users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.status=1 and b.booking_type='tour' and b.room_or_tour_id=p.id and b.user_id=u.id"}
                                itemsPerPage={20}
                            />

                        </Card></>)
                }
                {
                    context.isMobile && (<>
                        {(curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>{addEditComponents()}</Card>)}
                        <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                            {
                                context.isAdminResourcePermit(userId, 'bookings.add-new-booking') && (<FloatButton type="primary" shape="circle" onClick={onAddClick} icon={<FontAwesomeIcon icon={faPlus} />}></FloatButton>)
                            }

                            <AvatarMobileInfiniteList
                                header={<span>Bookings</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from bookings where status=1 "
                                listQuery={selBookingType === 'hotel' ? "select b.*,CONCAT(p.room_type,'-',h.hotel_name) as name,u.first_name,u.title,u.last_name,u.mobile_no,@rownum:=@rownum+1 as row_num from bookings b,hotels h,hotel_rooms r,users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.status=1 and b.booking_type='hotel' and b.room_or_tour_id=r.id  and r.hotel_id=h.id and b.user_id=u.id" : "select b.*,p.package_name as name,u.first_name,u.title,u.last_name,u.mobile_no,@rownum:=@rownum+1 as row_num from bookings b,tour_packages p,users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where b.status=1 and b.booking_type='tour' and b.room_or_tour_id=p.id and b.user_id=u.id"}
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'bookings.delete-booking') && false ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                    title="Booking"
                                                    table="bookings"
                                                    //id must,+ give first three colums to display
                                                    dataItem={{ id: item.id, name: item.name, booking_type: item.booking_type, booking_no: item.booking_no }}
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
export default Bookings;