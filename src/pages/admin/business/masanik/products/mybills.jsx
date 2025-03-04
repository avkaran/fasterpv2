import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar, Input, DatePicker, Form, Radio } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditJewelProduct from './addEditJewelProduct'
import ViewJewelProduct from './viewJewelProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import randomColor from 'randomcolor';
import * as xlsx from "xlsx";
import dayjs from 'dayjs'
const MyBills = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [dialogType, setDialogType] = useState('drawer'); //container,modal,drawer
    const [formItemLayout, setFormItemLayout] = useState('one-column'); //one-column,two-column,two-column-wrap
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Bill');
    const [refreshTable, setRefreshTable] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedType, setSelectedType] = useState('')
    const [selectedSearchText,setSelectedSearchText]=useState("")
    const filterColumns = useRef([
        '(p.employee_id=' + context.adminUser(userId).ref_id + ' OR p.sent_by=' + context.adminUser(userId).ref_id + ')'
    ]);
    useEffect(() => {
        //  loadData();
        if (context.isMobile) {
            setFormItemLayout('two-column-wrap');
            setDialogType('container')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        onSearch(selectedSearchText)
    }, [selectedDate,selectedType]);
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Bill No',
            dataIndex: 'bill_no',
            key: 'bill_no',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Customer',
            // dataIndex: 'employee_id',
            key: 'employee_id',
            render: (item) => <strong>{item.name}({item.mobile_no})</strong>,
        },
        {
            title: 'Sender',
            // dataIndex: 'employee_id',
            key: 'username',
            render: (item) => <strong>{item.username}</strong>,
        },
        {
            title: 'Amount',
            dataIndex: 'total_amount',
            key: 'total_amount',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Bill Date',
            // dataIndex: 'bill_date',
            key: 'bill_date',
            render: (item) => <a>{item.bill_date ? dayjs(item.bill_date).format("DD/MM/YYYY") : ''}</a>,
        },
        {
            title: 'Due Date',
            // dataIndex: 'due_date',
            key: 'due_date',
            render: (item) => <a>{item.due_date ? dayjs(item.due_date).format("DD/MM/YYYY") : ''}</a>,
        },
        /*  {
             title: 'Customer',
             //dataIndex: 'stock',
             key: 'stock',
             render: (item) => <>{(parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)).toFixed(2)}</>,
         }, */
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'active_status',
            render: (item) => <Tag color={parseInt(item.active_status) === 1 ? 'green' : 'red'} style={{ fontStock: 'bold' }}>{parseInt(item.active_status) === 1 ? 'Active' : 'Inactive'}</Tag>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'allbills.edit-bill') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'allbills.delete-bill') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="Bill"
                    table="bills"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, bill_no: item.bill_no, customer: item.name, total_amount: item.total_amount }}
                // avatar={context.baseUrl + item.course_image}
                />)}


            </Space>,
        },
    ]
    const onSearch = (value) => {
        setSelectedSearchText(value);
        var filter_or_clauses = [];
        var filter_classes = [];

        const searchTerms = value.split(" ");
        searchTerms.forEach(item => {
            filter_or_clauses.push("p.bill_no like '%" + item + "%'");
            filter_or_clauses.push("e.mobile_no like '%" + item + "%'");
            filter_or_clauses.push("e.name like '%" + item + "%'");
            filter_or_clauses.push("u.username like '%" + item + "%'");
            // filter_or_clauses.push("t.string_id like '%" +item +"%'");
            // filter_or_clauses.push("t.descripiton like '%" +item +"%'");
            // filter_or_clauses.push("tc.category_name like '%" +item +"%'");
        })
        filter_classes.push("(" + filter_or_clauses.join(" OR ") + ")")
        if (selectedType) {
            if (selectedType === "received"){
                filter_classes.push("p.employee_id=p.sent_by")
                //filter_classes.push("p.employee_id!=p.sent_by")
            }
            else if (selectedType === "sent")
                filter_classes.push("p.employee_id!=p.sent_by")
        }
        if(selectedDate){
            filter_classes.push(`p.bill_date='${selectedDate}'`)
        }

        filter_classes.push('(p.employee_id=' + context.adminUser(userId).ref_id + ' OR p.sent_by=' + context.adminUser(userId).ref_id + ')')
        

        filterColumns.current = filter_classes
        setRefreshTable((prev) => prev + 1);
    }
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
        //select p.*,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase') as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales') as sales,@rownum:=@rownum+1 as row_num from products p CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where p.status=1

        var reqData = {
            query_type: 'query',
            query: "select p.product_code,p.product_name,p.cost_price,p.selling_price,p.stock,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase') as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales') as sales from products p  where p.status=1"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var data = [...res];
            data = data.map(item => {
                item.current_stock = parseFloat((parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)).toFixed(2));
                item.current_stock_value = parseFloat(((parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)) * parseFloat(item.cost_price)).toFixed(2));
                return item;

            })
            const workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.json_to_sheet(data);

            // Add the worksheet to the workbook
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Package and Release Data (`writeFile` tries to write and save an XLSB file)
            xlsx.writeFile(workbook, "products.xlsx");


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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'allbills.edit-bill') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
            return <ViewJewelProduct formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} />
        else if (curAction === "add")
            return <AddEditJewelProduct formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else if (curAction === "edit")
            return <AddEditJewelProduct formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} />
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'allbills.edit-bill') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'allbills.delete-bill') && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="Bill"
                        table="bills"
                        //id must,+ give first three colums to display
                        dataItem={{ id: viewOrEditData.id, bill_no: viewOrEditData.bill_no, total_amount: viewOrEditData.total_amount, employee_id: viewOrEditData.employee_id }}
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
        if (context.isAdminResourcePermit(userId, 'allbills.edit-bill')) {
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
                    { name: 'All Bills', link: null },
                    { name: 'List Bills', link: null },
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
                        <Card title={
                            <Row>
                                <Col xs={24} xl={6}>

                                    <Radio.Group optionType="button" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                        <Radio.Button value="">All</Radio.Button >
                                        <Radio.Button value="received">Recd</Radio.Button >
                                        <Radio.Button value="sent">Sent</Radio.Button >
                                    </Radio.Group>
                                </Col>
                                <Col xs={24} xl={8}>
                                    <Input.Search
                                        placeholder="Search here"
                                        allowClear
                                        enterButton
                                        size="middle"
                                        onSearch={onSearch}
                                    />
                                </Col>
                                <Col xs={24} xl={6}>
                                    <Form.Item
                                        label="Date"
                                        name="ad_dates"
                                    // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                    >
                                        <Space direction="vertical">
                                            <DatePicker
                                                onChange={(date) => setSelectedDate(date ? dayjs(date).format("YYYY-MM-DD") : null)}
                                                value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} // Ensure value is a dayjs object
                                                format="DD/MM/YYYY"
                                                allowClear={true}
                                            />
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        }

                            extra={context.isAdminResourcePermit(userId, 'allbills.add-new-bill') ? <><Space><MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Bill</MyButton>{/* <MyButton onClick={onExcelClick} ><i className="fa-solid fa-file-excel pe-2" ></i>Excel</MyButton> */}</Space></> : null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from bills p,employees e,vi_users u where p.status=1 and p.employee_id=e.id and u.ref_id=p.sent_by" +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select p.*,e.name,e.mobile_no,u.username,@rownum:=@rownum+1 as row_num from bills p,employees e,vi_users u CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where p.status=1 and p.employee_id=e.id and u.ref_id=p.sent_by" +
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
                                context.isAdminResourcePermit(userId, 'allbills.add-new-bill') && (<>

                                    <FloatButton
                                        type="primary"
                                        shape="circle"
                                        onClick={onAddClick}
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        style={{
                                            right: 96,
                                        }}
                                    />
                                    {/* <FloatButton
                                            type="primary"
                                            shape="circle"
                                            onClick={onExcelClick}
                                            icon={<FontAwesomeIcon icon={faFileExcel} />}
                                            style={{
                                                right: 24,
                                              }}
                                        /> */}

                                </>)
                            }
                             <Row style={{marginTop:'7px'}}>
                                <Col xs={12} xl={6} >

                                    <Radio.Group optionType="button" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                                        <Radio.Button value="">All</Radio.Button >
                                        <Radio.Button value="received">Recd</Radio.Button >
                                        <Radio.Button value="sent">Sent</Radio.Button >
                                    </Radio.Group>
                                </Col>
                                <Col xs={12} xl={6}>
                                    <Form.Item
                                        label="Date"
                                        name="ad_dates"
                                    // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                    >
                                        <Space direction="vertical">
                                            <DatePicker
                                                onChange={(date) => setSelectedDate(date ? dayjs(date).format("YYYY-MM-DD") : null)}
                                                value={selectedDate ? dayjs(selectedDate, "YYYY-MM-DD") : null} // Ensure value is a dayjs object
                                                format="DD/MM/YYYY"
                                                allowClear={true}
                                            />
                                        </Space>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} xl={8}>
                                    <Input.Search
                                        placeholder="Search here"
                                        allowClear
                                        enterButton
                                        size="middle"
                                        onSearch={onSearch}
                                    />
                                </Col>
                                
                            </Row>

                            <AvatarMobileInfiniteList
                                header={<span>Bills</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from bills p,employees e,vi_users u where p.status=1 and p.employee_id=e.id and u.ref_id=p.sent_by" + context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select p.*,e.name,e.mobile_no,u.username from bills p,employees e,vi_users u  where p.status=1 and p.employee_id=e.id and u.ref_id=p.sent_by" +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'allbills.delete-bill') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                    title="Bill"
                                                    table="bills"
                                                    //id must,+ give first three colums to display
                                                    dataItem={{ id: item.id, bill_no: item.bill_no, total_amount: item.total_amount, employee_id: item.name }}
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
                                                >{item.name.charAt(0).toUpperCase()}</Avatar>
                                            }
                                            description={<>Bill No: {item.bill_no}<br />
                                                Date:{dayjs(item.bill_date).format("DD/MM/YYYY")} ,Total Cost: {item.total_amount}</>}
                                        >
                                            {item.name}
                                        </MList.Item>
                                    </SwipeAction>
                                }}
                            /></div></>)
                }




            </ResponsiveLayout>

        </>
    );
}
export default MyBills;