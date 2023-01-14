import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddPackage from './addEditLedger';
// import AddEditLedger from './addEditLedger';
import AddEditLedger from './addEditLedger';
// import ViewLedger from './viewaccounts';
import ViewLedger from './viewLedger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../utils';

const Ledgers = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Ledgers');
    const [refreshTable, setRefreshTable] = useState(0);
    useEffect(() => {
        //  loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tableColumns = [
        {
            title: 'S.NO',
            dataIndex: 'id',
            key: 'id',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Ledger Name',
            dataIndex: 'ledger_name',
            key: 'ledger_name	',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'ledger Type',
            dataIndex: 'ledger_type',
            key: 'ledger_type',
            //render: (text) => <a>{text}</a>,
        },

        {
            title: 'Category',
            dataIndex: 'category_name',
            key: 'category_name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Active Status',
            // dataIndex: 'active_status',
            key: 'active_status',
            render: (item) => <Tag color={parseInt(item.active_status) === 1 ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{parseInt(item.active_status) === 1 ? 'Active' : 'Inactive'}</Tag>,
            //render: (text) => <a>{text}</a>,
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
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1) }}
                    title={heading}
                    table="acc_ledgers"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, ledger_name: item.ledger_name, ledger_type: item.ledger_type, category: item.category, active_status: item.active_status }}
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
                        <span>{heading + "s"}</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>List Ledgers</Breadcrumb.Item>
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
                        {curAction === "view" && (<ViewLedger viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditLedger onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditLedger editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List Ledgers</Button>}>

                        {curAction === "view" && (<ViewLedger viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditLedger onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditLedger editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title={heading + " List"} extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add {heading}</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>

                    <PaginatedTable
                        columns={tableColumns}
                        refresh={refreshTable}
                        countQuery="select count(*) as count from acc_ledgers where status=1"
                        listQuery="select l.*,c.category_name,@rownum:=@rownum+1 as row_num from acc_ledgers l,acc_ledger_categories c CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where l.status=1 and l.category=c.id"
                        itemsPerPage={20}
                    />

                </Card>



            </Content>

        </>
    );
}
export default Ledgers;



