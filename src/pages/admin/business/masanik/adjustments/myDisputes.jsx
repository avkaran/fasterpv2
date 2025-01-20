import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton, Select } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar, DatePicker, Form } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable, AvatarMobileInfiniteList, FormItem } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddEditAdjustment from './addEditAdjustment'
import ViewAdjustment from './viewAdjustment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faChevronLeft, faPlus, faPencil, faEye, faSearch, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout'
import { List as MList, Dialog, SwipeAction, Toast, MImage } from 'antd-mobile'
import randomColor from 'randomcolor';
import dayjs from 'dayjs'
import * as xlsx from "xlsx";
const MyDisputes = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [searchForm] = Form.useForm();
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [dialogType, setDialogType] = useState('container'); //container,modal,drawer
    const [formItemLayout, setFormItemLayout] = useState('two-column'); //one-column,two-column,two-column-wrap
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Dispute');
    const [refreshTable, setRefreshTable] = useState(0);
    const [products, setProducts] = useState([])
    const filterColumns = useRef([
        "p.employee_id="+ context.adminUser(userId).ref_id,
    ]);
    useEffect(() => {
        //  loadData();
        if (context.isMobile) {
            setFormItemLayout('two-column-wrap');
            setDialogType('container')
        }
        searchForm.setFieldsValue({ ds_dates: [dayjs(), dayjs()], dispute_type: 'General' });
        //loadProducts()
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
            title: 'Bill No',
            dataIndex: 'bill_no',
            key: 'bill_no',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'date',
            // dataIndex: 'adjustment_name',
            key: 'date',
            render: (item) => <>{dayjs(item.date).format("DD/MM/YYYY")}</>,
        },
        {
            title: 'Type',
            dataIndex: 'dispute_type',
            key: 'dispute_type',
            //  render: (item) => <>{dayjs(item.date).format("DD/MM/YYYY")}</>,
        },
        {
            title: 'Customer',
            //dataIndex: 'qty',
            key: 'name',
            render: (item) => <span>{item.name}({item.mobile_no})</span>,
        },
        /*  {
             title: 'Cost Per',
             dataIndex: 'cost_per',
             key: 'cost_per',
             //render: (item) => <>{parseFloat(item.weight).toFixed(3)}</>,
         },
         {
             title: 'Total',
             dataIndex: 'total_cost',
             key: 'total_cost',
 
         },
         {
             title: 'Profit',
             key: 'total_cost',
            render: (item) => <>{item.adjustment_type=='Sales'?(parseFloat(item.total_cost)-parseFloat(item.qty)*parseFloat(item.cost_price)).toFixed(2):'-'}</>,
 
         }, */
        {
            title: 'Narration',
            dataIndex: 'narration',
            key: 'narration',

        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onViewClick(item)} ><i class="fa-solid fa-eye"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'mydisputes.edit-dispute') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'mydisputes.delete-dispute') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="Dispute"
                    table="disputes"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, bill_no: item.bill_no, customer: item.name, mobile: item.mobile_no }}
                // avatar={context.baseUrl + item.course_image}
                />)}


            </Space>,
        },
    ]
    const onChangeDate = (dates) => {
        searchForm.setFieldsValue({ ad_dates: dates });
    };
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


        var reqData = {
            query_type: 'query',
            query: "select a.*,p.product_name,p.product_code,p.cost_price from disputes a,bills p,employees e  where a.status=1 and a.product_id=p.id " +
                context.psGlobal.getWhereClause(filterColumns.current, false)
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var data = [];
            res.map(item => {
                data.push(
                    {
                        bill_id: item.bill_id,
                        product_name: item.product_name,
                        type: item.adjustment_type,
                        date: dayjs(item.date).format("DD-MMM-YYYY"),
                        qty: item.qty,
                        cost_per: item.cost_per,
                        total_cost: item.total_cost,
                        profit: item.adjustment_type == 'Sales' ? parseFloat(item.total_cost) - parseFloat(item.qty) * parseFloat(item.cost_price) : '-',
                        narration: item.narration

                    }
                )
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
    const onFinishSearch = (values) => {

        var filter_clauses = [];
        filter_clauses.push(
            " date(a.date)>='" +
            dayjs(values.ad_dates[0]).format("YYYY-MM-DD") +
            "'"
        );
        filter_clauses.push(
            " date(a.date)<='" +
            dayjs(values.ad_dates[1]).format("YYYY-MM-DD") +
            "'"
        );
        if (values.dispute_type) filter_clauses.push(" a.dispute_type='" + values.dispute_type + "'");
        filter_clauses.push("  p.employee_id="+ context.adminUser(userId).ref_id)
        filterColumns.current = filter_clauses;

        setRefreshTable((prev) => prev + 1);
    };
    const loadProducts = () => {
        var reqData = {
            query_type: 'query',
            query: "select p.id,p.product_name from products p  where p.status=1"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setProducts(res)


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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'mydisputes.edit-dispute') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
            return <ViewAdjustment formItemLayout={formItemLayout} viewIdOrObject={viewOrEditData} onListClick={onAddEditListClick} userId={userId} isMydisputes={true}/>
        else if (curAction === "add")
            return <AddEditAdjustment formItemLayout={formItemLayout} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} isMydisputes={true}/>
        else if (curAction === "edit")
            return <AddEditAdjustment formItemLayout={formItemLayout} editIdOrObject={viewOrEditData} onListClick={onAddEditListClick} onSaveFinish={onAddEditSaveFinish} userId={userId} isMydisputes={true}/>
        else return <></>
    }
    const rightButtons =
        <Space><MyButton type='primary' onClick={onAddEditListClick}><i className="fa-solid fa-arrow-left pe-2" ></i>Back</MyButton>
            {(curAction === 'view' || curAction === 'edit') && (<>
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'mydisputes.edit-dispute') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'mydisputes.delete-dispute') && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="Dispute"
                        table="disputes"
                        //id must,+ give first three colums to display
                        dataItem={{ id: viewOrEditData.id, bill_no: viewOrEditData.bill_no, Customer: viewOrEditData.name, mobile_no: viewOrEditData.mobile_no }}
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
        if (context.isAdminResourcePermit(userId, 'mydisputes.edit-dispute')) {
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
                    { name: 'Disputes', link: null },
                    { name: 'List Disputes', link: null },
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
                            title="Disputes"

                            extra={context.isAdminResourcePermit(userId, 'mydisputes.add-new-dispute') ? <><Space><MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Dispute</MyButton>

                                {/*  <MyButton onClick={onExcelClick} ><i className="fa-solid fa-file-excel pe-2" ></i>Excel</MyButton> */}

                            </Space></> : null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>
{/*                             <Form
                                name="basic"
                                form={searchForm}
                                labelAlign="left"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinishSearch}
                                autoComplete="off"
                            >
                                <Row gutter={16}>

                                    <Col className="gutter-row" xs={24} xl={10}>
                                        <FormItem
                                            label="Date"
                                            name="ad_dates"
                                        // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                        >
                                            <Space direction="vertical">
                                                <DatePicker.RangePicker
                                                    onChange={onChangeDate}
                                                    defaultValue={[dayjs(), dayjs()]}
                                                    format="DD/MM/YYYY"
                                                    allowClear={false}
                                                />
                                            </Space>
                                        </FormItem>
                                    </Col>

                                    <Col className="gutter-row" xs={24} xl={5}>
                                        <FormItem label="Type" name="dispute_type">
                                            <Select
                                                showSearch
                                                placeholder="Types"

                                                optionFilterProp="children"
                                                //onChange={designationIdOnChange}
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                            >

                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'dispute-types')}

                                            </Select>
                                        </FormItem>
                                    </Col>


                                    <Col className="gutter-row" xs={24} xl={2}>

                                        <MyButton
                                            type="primary" htmlType="submit">
                                            <FontAwesomeIcon icon={faSearch} /> Search
                                        </MyButton>

                                    </Col>
                                </Row>
                            </Form> */}
                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from disputes a,bills p where a.status=1 and a.bill_id=p.id " +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select a.*,p.bill_no,p.employee_id,e.name,e.mobile_no,@rownum:=@rownum+1 as row_num from disputes a,bills p,employees e CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where a.status=1  and a.bill_id=p.id and p.employee_id=e.id" +
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
                                context.isAdminResourcePermit(userId, 'mydisputes.add-new-dispute') && (<>
                                    <FloatButton
                                        type="primary"
                                        shape="circle"
                                        onClick={onAddClick}
                                        icon={<FontAwesomeIcon icon={faPlus} />}
                                        style={{
                                            right: 96,
                                        }}
                                    />
                                   {/*  <FloatButton
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
{/*                             <Form
                                name="basic"
                                form={searchForm}
                                labelAlign="left"
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 18 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinishSearch}
                                autoComplete="off"
                            >
                                <Row gutter={16}>

                                    <Col className="gutter-row" xs={24} xl={10}>
                                        <FormItem
                                            label="Date"
                                            name="ad_dates"
                                        // rules={[{ required: true, message: 'Please Enter Msg Date' }]}
                                        >
                                            <Space direction="vertical">
                                                <DatePicker.RangePicker
                                                    onChange={onChangeDate}
                                                    defaultValue={[dayjs(), dayjs()]}
                                                    format="DD/MM/YYYY"
                                                    allowClear={false}
                                                />
                                            </Space>
                                        </FormItem>
                                    </Col>

                                    <Col className="gutter-row" xs={24} xl={5}>
                                        <FormItem label="Type" name="dispute_type">
                                            <Select
                                                showSearch
                                                placeholder="Types"

                                                optionFilterProp="children"
                                                //onChange={designationIdOnChange}
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .includes(input.toLowerCase())
                                                }
                                            >

                                                {context.psGlobal.collectionOptions(
                                                    context.psGlobal.collectionData,
                                                    "dispute-types",
                                                    "option"
                                                )}


                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col className="gutter-row" xs={24} xl={2}>

                                        <MyButton
                                            type="primary" htmlType="submit">
                                            <FontAwesomeIcon icon={faSearch} /> Search
                                        </MyButton>

                                    </Col>
                                </Row>
                            </Form> */}

                            <AvatarMobileInfiniteList
                                header={<span>Disputes</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery={"select count(*) as count from disputes a,bills p where a.status=1 and a.bill_id=p.id" +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                listQuery={"select a.*,p.bill_no,e.name,e.mobile_no from disputes a,bills p,employees e  where a.status=1 and a.bill_id=p.id and p.employee_id=e.id" +
                                    context.psGlobal.getWhereClause(filterColumns.current, false)}
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'mydisputes.delete-disputes') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                    title="Dispute"
                                                    table="disputes"
                                                    //id must,+ give first three colums to display
                                                    dataItem={{ id: item.id, bill_no: item.bill_no, customer: item.name, narration: item.narration }}
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
                                                >{item.dispute_type.charAt(0).toUpperCase()}</Avatar>
                                            }
                                            description={<>Date : {dayjs(item.date).format("DD/MM/YYYY")}, Bill No: {item.bill_no} <br /> {item.narration}
                                               
                                            </>}
                                        >
                                             {item.dispute_type}
                                        </MList.Item>
                                    </SwipeAction>
                                }}
                            /></div></>)
                }




            </ResponsiveLayout>

        </>
    );
}
export default MyDisputes;