import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditTourPackage from './addEditTourPackage'
import ViewTourPackage from './viewTourPackage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import randomColor from 'randomcolor';
const TourPackages = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [dialogType, setDialogType] = useState('container'); //container,modal,drawer
    const [formItemLayout, setFormItemLayout] = useState('one-column'); //one-column,two-column,two-column-wrap
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Tour Package');
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
            title: 'Package Name',
            dataIndex: 'package_name',
            key: 'package_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            //render: (text) => <a>{text}</a>,
        },
       
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'active_status',
            render: (item) => <Tag color={parseInt(item.active_status) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{parseInt(item.active_status) === 1 ? 'Active' : 'Inactive'}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'tour-packages.edit-tour-package') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'tour-packages.delete-tour-package') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                     title="Tour Package"
                     table="tour_packages"
                     //id must,+ give first three colums to display
                     dataItem={{ id: item.id, package_name: item.package_name, price: item.price, ref: item.id }}
                // avatar={context.baseUrl + item.course_image}
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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'tour-packages.edit-tour-package') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
            return <ViewTourPackage formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} />
        else if (curAction === "add")
            return <AddEditTourPackage formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else if (curAction === "edit")
            return <AddEditTourPackage formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'tour-packages.edit-tour-package') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'tour-packages.delete-tour-package') && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="Tour Package"
                        table="tour_packages"
                        //id must,+ give first three colums to display
                        dataItem={{ id: viewOrEditData.id, package_name: viewOrEditData.package_name, price: viewOrEditData.price, ref: viewOrEditData.id }}
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
        if (context.isAdminResourcePermit(userId, 'tour-packages.edit-tour-package')) {
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
                    { name: 'Tour Packages', link: null },
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
                        <Card title="Tour Packages" extra={context.isAdminResourcePermit(userId, 'tour-packages.add-new-tour-package')?<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Tour Package</MyButton>:null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from tour_packages where status=1 "
                                listQuery="select *,@rownum:=@rownum+1 as row_num from tour_packages CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                                itemsPerPage={20}
                            />

                        </Card></>)
                }
                {
                    context.isMobile && (<>
                        {(curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>{addEditComponents()}</Card>)}
                        <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                            {
                                context.isAdminResourcePermit(userId, 'tour-packages.add-new-tour-package') &&  (<FloatButton type="primary" shape="circle" onClick={onAddClick} icon={<FontAwesomeIcon icon={faPlus} />}></FloatButton>)
                            }
                            
                            <AvatarMobileInfiniteList
                                header={<span>Tour Packages</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from tour_packages where status=1 "
                                listQuery="select * from tour_packages where status=1 "
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'tour-packages.delete-tour-package') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                title="Tour Package"
                                                table="tour_packages"
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
export default TourPackages;