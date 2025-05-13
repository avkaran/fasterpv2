import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, FloatButton } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button, Drawer, Avatar } from 'antd';
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
import { Editor } from '@tinymce/tinymce-react';
const JewelProducts = (props) => {
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
    const [visibleDescription, setVisibleDescription] = useState(false)
    const [heading] = useState('Product');
    const [refreshTable, setRefreshTable] = useState(0);
    const [editorValue, setEditorValue] = useState('');
    useEffect(() => {
        //  loadData();
        if (context.isMobile) {
            setFormItemLayout('two-column-wrap');
            setDialogType('container')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onDescriptonUpdate = () => {
        var formedit = new FormData();
        formedit.append('id', viewOrEditData.id);

        formedit.append("product_description",editorValue)

        context.psGlobal.apiRequest('admin/products/update', context.adminUser(userId).mode, formedit).then((res) => {
            //setLoader(false);
            message.success(heading + ' Saved Successfullly');
            
            //navigate('/' + userId + '/admin/courses');
        }).catch(err => {
            message.error(err);
            //setLoader(false);
        })
    }
    const handleEditorChange = (content) => {
        setEditorValue(content);
        /*   addForm.setFieldsValue({
              content_html: { html: content }
          }) */
        //// setEditorValue(content);
    }
    const tableColumns = [
        {
            title: 'S.No',
            dataIndex: 'row_num',
            key: 'row_num',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Product Code',
            dataIndex: 'product_code',
            key: 'product_code',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Product Name',
            dataIndex: 'product_name',
            key: 'product_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Cost Per',
            dataIndex: 'cost_price',
            key: 'cost_price',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Qty',
            //dataIndex: 'stock',
            key: 'stock',
            render: (item) => <>{(parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)).toFixed(2)}</>,
        },
        {
            title: 'Total Cost',
            //dataIndex: 'stock',
            key: 'Cost Value',
            render: (item) => <>{((parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)) * parseFloat(item.cost_price)).toFixed(2)}</>,
        },
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
                <MyButton type="outlined" size="small" shape="circle"
                    onClick={() => onDescriptionClick(item)} ><i class="fa-solid fa-list"></i></MyButton>
                {context.isAdminResourcePermit(userId, 'products.edit-product') && (<MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>)}
                {context.isAdminResourcePermit(userId, 'products.delete-product') && (<DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="Product"
                    table="products"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, product_code: item.product_code, product_name: item.product_name, unit: item.unit }}
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
                curAction === "view" && viewOrEditData && context.isAdminResourcePermit(userId, 'products.edit-product') && (<a className="headerButton" onClick={() => setCurAction("edit")}>
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
    const onDescriptionClick = (item) => {
        setViewOrEditData(item);
        setVisibleDescription(true)
        setEditorValue(item.product_description)
        // alert("description under constructions")
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
                {curAction === 'view' && context.isAdminResourcePermit(userId, 'products.edit-product') && (<MyButton type='primary' onClick={() => { setCurAction("edit") }}><i className="fa-solid fa-pencil pe-2" ></i>Edit</MyButton>)}
                {curAction === 'edit' && (<MyButton type='primary' onClick={() => { setCurAction("view") }}><i className="fa-solid fa-eye pe-2" ></i>View</MyButton>)}
                {
                    context.isAdminResourcePermit(userId, 'products.delete-product') && (<DeleteButton type="outlined" size="small" shape="round" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                        title="Product"
                        table="products"
                        //id must,+ give first three colums to display
                        dataItem={{ id: viewOrEditData.id, product_code: viewOrEditData.product_code, product_name: viewOrEditData.product_name, unit: viewOrEditData.unit }}
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
        if (context.isAdminResourcePermit(userId, 'products.edit-product')) {
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
                    { name: 'Products', link: null },
                    { name: 'List Products', link: null },
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
                        <Card title="Products" extra={context.isAdminResourcePermit(userId, 'products.add-product') ? <><Space><MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Product</MyButton><MyButton onClick={onExcelClick} ><i className="fa-solid fa-file-excel pe-2" ></i>Excel</MyButton></Space></> : null} style={{ display: (curAction === "list" || dialogType !== 'container') ? 'block' : 'none' }}>

                            <PaginatedTable
                                columns={tableColumns}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from products where status=1 "
                                listQuery="select p.*,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase' and status=1) as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales' and status=1) as sales,@rownum:=@rownum+1 as row_num from products p CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where p.status=1 "
                                itemsPerPage={20}
                            />

                        </Card></>)
                }
                {
                    context.isMobile && (<>
                        {(curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>{addEditComponents()}</Card>)}
                        <div style={{ display: (curAction === "list") ? 'block' : 'none' }}>
                            {
                                context.isAdminResourcePermit(userId, 'products.add-product') && (<>

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

                            <AvatarMobileInfiniteList
                                header={<span>Products</span>}
                                userId={userId}
                                refresh={refreshTable}
                                countQuery="select count(*) as count from products where status=1 "
                                listQuery="select p.*,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase' and status=1) as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales' and status=1) as sales from products p  where p.status=1"
                                recordsPerRequestOrPage={20}
                                renderItem={(item, index) => {
                                    return <SwipeAction
                                        rightActions={context.isAdminResourcePermit(userId, 'products.delete-product') ? [
                                            {
                                                key: 'delete',
                                                text: <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                                                    title="Product"
                                                    table="products"
                                                    //id must,+ give first three colums to display
                                                    dataItem={{ id: item.id, product_code: item.product_code, product_name: item.product_name, unit: item.unit }}
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
                                                >{item.product_name.charAt(0).toUpperCase()}</Avatar>
                                            }
                                            description={<>Code: {item.product_code} ,Stock: {(parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)).toFixed(2)} <br />
                                                Cost per:{item.cost_price} ,Total Cost: {((parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)) * parseFloat(item.cost_price)).toFixed(2)}</>}
                                        >
                                            {item.product_name}
                                        </MList.Item>
                                    </SwipeAction>
                                }}
                            /></div></>)
                }




            </ResponsiveLayout>

            <Modal
                open={visibleDescription}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={1000}
                onCancel={() => { setVisibleDescription(false) }}
                title={<><MyButton type="outlined" size="small" onClick={onDescriptonUpdate} >Update </MyButton> Descripiton : {viewOrEditData?.product_name}</>}

            >
                <Editor
                    apiKey='aqgwg5nhsm57d07rdlff1bu6lj1aej23f41cyg7txuzc527u'
                    init={{
                        height: '500',
                        auto_focus: false,
                        menubar: false,
                        statusbar: false,
                        plugins: 'hr lists table textcolor code link image',
                        toolbar: 'bold italic forecolor link image| alignleft aligncenter alignright | hr bullist numlist table | subscript superscript | removeformat code',

                        // allow custom url in link? nah just disabled useless dropdown..
                        anchor_top: false,
                        anchor_bottom: false,
                        draggable_modal: true,
                        table_default_attributes: {
                            border: '0',
                        },
                    }}
                    // initialValue={viewData.content_html}
                    value={editorValue}


                    onEditorChange={handleEditorChange}
                // onChange={handleEditorChange}
                />

            </Modal>

        </>
    );
}
export default JewelProducts;