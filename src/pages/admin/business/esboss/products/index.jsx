import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddProductService from './addEditProductService';
import AddEditProductService from './addEditProductService';
import ViewProductService from './viewProductService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout';
const ProductService = (props) => {
    const context = useContext(PsContext);
    const { userId,businessType } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading,setHeading] = useState('');
    const [refreshTable, setRefreshTable] = useState(0);
    useEffect(() => {
        setHeading(businessType);
        setRefreshTable(prev=>prev+1)
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [businessType]);

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
            title: 'category',
            dataIndex: 'category_name',
            key: 'category_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: businessType +' Name',
            dataIndex: 'product_name',
            key: 'product_name',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Status',
            //dataIndex: 'COLUMN_COMMENT',
            key: 'product_status',
            render: (item) => <Tag color={item.product_status === 'Active' ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{item.product_status}</Tag>,
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
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title={businessType}
                    table="products"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, category: item.category_name, product_name: item.product_name, unit_name: item.unit_name }}
                    //avatar={context.baseUrl + item.course_image}
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
            <ResponsiveLayout

                userId={userId}
                customHeader={null}
                bottomMenues={null}
                breadcrumbs={[
                    { name: capitalizeFirst(businessType) + ' List', link: null },
                    { name: 'List ' + capitalizeFirst(businessType), link: null },
                ]}
            >
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
                        {curAction === "view" && (<ViewProductService viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditProductService businessType={businessType} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditProductService businessType={businessType} editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewProductService viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditProductService businessType={businessType} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditProductService businessType={businessType} editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={capitalizeFirst(businessType)+"s"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {capitalizeFirst(businessType)}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>

                    <PaginatedTable
                        columns={tableColumns}
                        refresh={refreshTable}
                        countQuery={"select count(*) as count from products p,product_categories c where p.status=1 and p.category=c.id and p.type='"+businessType+"'"}
                        listQuery={"select p.*,c.category_name,@rownum:=@rownum+1 as row_num from products p,product_categories c CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where p.status=1 and p.category=c.id and p.type='"+businessType+"'"}
                        itemsPerPage={20}
                    />

                </Card>



            </ResponsiveLayout>

        </>
    );
}
export default ProductService;