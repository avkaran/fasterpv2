import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar,Input } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditStudentUser from './addEditStudentUser'
import ViewStudentUser from './viewStudentUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import randomColor from 'randomcolor';
import * as xlsx from "xlsx";
import dayjs from 'dayjs'
const StudentUsers = (props) => {
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
    const [heading] = useState('User');
    const [refreshTable, setRefreshTable] = useState(0);
    const filterColumns = useRef([]);
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
            title: 'User Id',
            dataIndex: 'user_id',
            key: 'user_id',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Last Name',

            key: 'last_name',
            render: (item) => <>{item.prefix} {item.last_name}</>,
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile_no',
            key: 'mobile_no',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'District',
            dataIndex: 'district',
            key: 'district',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },

        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'users.edit-user') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'users.delete-user') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="User"
                    table="users"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, first_name: item.first_name, last_name: item.prefix + item.last_name, district: item.district }}
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
    const onExcelClick = () => {
        // var table_elt = document.getElementById("my_class_mark_table");
        // Extract Data (create a workbook object from the table)
        // var workbook = xlsx.utils.table_to_book(table_elt);
        // Process Data (add a new row)
        // var ws = workbook.Sheets["Sheet1"];
        // xlsx.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});
        //select p.*,(select coalesce(sum(qty),0) from adjustments where user_id=p.id and adjustment_type='Purchase') as purchase,(select coalesce(sum(qty),0) from adjustments where user_id=p.id and adjustment_type='Sales') as sales,@rownum:=@rownum+1 as row_num from users p CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where p.status=1

        var reqData = {
            query_type: 'query',
            query: "select u.user_id,u.first_name,u.prefix,u.last_name,u.mobile_no,u.aadhaar_no,u.address,u.dob,u.country,u.state,u.district from users u  where u.status=1"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var data = [...res];
            data = data.map(item => {
                item.dob =dayjs(item.dob).format("DD-MMM-YYYY")
                return item;

            })
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(data);

            // Add the worksheet to the workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Package and Release Data (`writeFile` tries to write and save an XLSB file)
            xlsx.writeFile(workbook, "users.xlsx");


        }).catch(err => {
            message.error(err);

        })


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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'users.edit-user') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
            return <ViewStudentUser formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} />
        else if (curAction === "add")
            return <AddEditStudentUser formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else if (curAction === "edit")
            return <AddEditStudentUser formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'users.edit-user') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'users.delete-user') && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="User"
                        table="users"
                        //id must,+ give first three colums to display

                        dataItem={{ id: viewOrEditData.id, first_name: viewOrEditData.first_name, last_name: viewOrEditData.prefix + viewOrEditData.last_name, district: viewOrEditData.district }}
                    // avatar={context.baseUrl + item.course_image}
                    />)
                }

            </>
            )}
        </Space>
    const onSearch = (value) => {
       
            var filter_or_clauses = [];
            const searchTerms = value.split(" ");
            searchTerms.forEach(item => {
                filter_or_clauses.push("u.user_id like '%" + item + "%'");
                filter_or_clauses.push("u.last_name like '%" + item + "%'");
                filter_or_clauses.push("u.mobile_no like '%" + item + "%'");
                filter_or_clauses.push("u.email like '%" + item + "%'");
                filter_or_clauses.push("u.aadhaar_no like '%" + item + "%'");
            })
            filterColumns.current = ["(" + filter_or_clauses.join(" OR ") + ")"];
            setRefreshTable((prev) => prev + 1);
      

    }
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
        if (context.isAdminResourcePermit(userId, 'users.edit-user')) {
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
                    { name: 'Users', link: null },
                    { name: 'List Users', link: null },
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
                        <Card
                            title={<>Users  <Input.Search
                                placeholder="Search here"
                                allowClear
                                enterButton
                                size="middle"
                                style={{width:'300px'}}
                                onSearch={onSearch}
                            /></>}

                            extra={context.isAdminResourcePermit(userId, 'users.add-user') ? <><Space><MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add User</MyButton><MyButton onClick={onExcelClick} ><i className="fa-solid fa-file-excel pe-2" ></i>Excel</MyButton></Space></> : null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from users where status=1 " +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select u.*,@rownum:=@rownum+1 as row_num from users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where u.status=1 " +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                itemsPerPage={20}
                            />

                        </Card></>)
                }
                {
                    context.isMobile && (<>
                        {(curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>{addEditComponents()}</Card>)}
                        <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                            {
                                context.isAdminResourcePermit(userId, 'users.add-user') && (<>

                                    <FloatButton
                                        type="primary"
                                        shape="circle"
                                        onClick={onAddClick}
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        style={{
                                            right: 96,
                                        }}
                                    />
                                    <FloatButton
                                        type="primary"
                                        shape="circle"
                                        onClick={onExcelClick}
                                        icon={<FontAwesomeIcon icon={faFileExcel} />}
                                        style={{
                                            right: 24,
                                        }}
                                    />

                                </>)
                            }
                            <Input.Search
                                placeholder="Search here"
                                allowClear
                                enterButton
                                size="middle"
                                onSearch={onSearch}
                            />
                            <AvatarMobileInfiniteList
                                header={<span>Users</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from users where status=1 " +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select u.* from users u  where u.status=1 " +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'users.delete-user') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                    title="User"
                                                    table="users"
                                                    //id must,+ give first three colums to display
                                                    dataItem={{ id: item.id, first_name: item.first_name, last_name: item.prefix + item.last_name, district: item.district }}
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
                                                >{item.user_name.charAt(0).toUpperCase()}</Avatar>
                                            }
                                            description={<>Code: {item.user_code} ,Stock: {(parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)).toFixed(2)} <br />
                                                Cost per:{item.cost_price} ,Total Cost: {((parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)) * parseFloat(item.cost_price)).toFixed(2)}</>}
                                        >
                                            {item.user_name}
                                        </MList.Item>
                                    </SwipeAction>
                                }}
                            /></div></>)
                }




            </ResponsiveLayout>

        </>
    );
}
export default StudentUsers;