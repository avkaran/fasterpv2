import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Row, Col, message, Space, Avatar, FloatButton } from 'antd';
import { AvatarMobileInfiniteList, MyButton } from '../../../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddProject from './addEditProject';
import AddEditProject from './addEditProject';
import ViewProject from './viewProject';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose, faPlus, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst } from '../../../../../utils';
import ResponsiveLayout from '../../../layout';
import { List as MList } from 'antd-mobile'
import randomColor from 'randomcolor';
const SoftwareProjects = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(false);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Project');
    const [refreshTable, setRefreshTable] = useState(0);
    const [mHeader, setMHeader] = useState(null)
    useEffect(() => {
        //  loadData();
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
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Api Url',
            dataIndex: 'api_url',
            key: 'api_url',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            render: (item) => <Space>
                <Link to={"/" + userId + "/admin/project/view/" + item.id} ><MyButton type="outlined" size="small" shape="circle"
                ><i class="fa-solid fa-eye"></i></MyButton></Link>
                <MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                    onClick={() => onEditClick(item)}
                ><i class="fa-solid fa-pencil"></i></MyButton>
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }}
                    title="Project"
                    table="projects"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, project_name: item.project_name, category: item.category, database_name: item.database_name }}
                //avatar={context.baseUrl + item.course_image}
                />

            </Space>,
        },
    ]
    const onAddClick = () => {
        window.scrollTo(0, 0)
        if (context.isMobile) {
            setMHeader(<div className="appHeader">
                <div className="left">
                    <a className="headerButton goBack" onClick={()=> {setCurAction("list");setMHeader(null)}}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </a>
                </div>
                <div className="pageTitle">
                   Add Project
                </div>
                <div className="right">
                    <a className="headerButton" onClick={()=> {setCurAction("list");setMHeader(null)}}>
                        <FontAwesomeIcon icon={faClose} />
                    </a>
                </div>
            </div>)
        }
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
                customHeader={mHeader}
                bottomMenues={null}
                showNav={null}
                breadcrumbs={[
                    { name: 'Project List', link: null },
                    { name: 'List Projects', link: null },
                ]}
            >
                {
                    isModal && !context.isMobile && (<Modal
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
                        {curAction === "view" && (<ViewProject viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditProject onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditProject editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && !context.isMobile && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={<>{capitalizeFirst(curAction) + " " + heading + " : "}<span style={{ color: cyan[7] }}>{viewOrEditData && viewOrEditData.project_name} </span></>} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewProject viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditProject onListClick={() => { setCurAction("list"); setMHeader(null) }} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditProject editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                 {
                    context.isMobile && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card>

                        {curAction === "view" && (<ViewProject viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditProject onListClick={() => { setCurAction("list"); setMHeader(null) }} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditProject editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                {
                    !context.isMobile && (<Card title="Projects" extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Project</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>

                        <PaginatedTable
                            columns={tableColumns}
                            refresh={refreshTable}
                            countQuery="select count(*) as count from projects where status=1 "
                            listQuery="select *,@rownum:=@rownum+1 as row_num from projects CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 "
                            itemsPerPage={20}
                        />


                    </Card>)
                }
                {
                    context.isMobile && (<div style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
                        <FloatButton type="primary" shape="circle" onClick={onAddClick} icon={<FontAwesomeIcon icon={faPlus} />}></FloatButton>
                        <AvatarMobileInfiniteList
                        header={<span>Projects</span>}
                        userId={userId}
                        refresh={refreshTable}
                        countQuery="select count(*) as count from projects where status=1 "
                        listQuery="select * from projects where status=1 "
                        recordsPerRequestOrPage={20}
                        renderItem={(item, index) => {
                            return <MList.Item
                                onClick={() => { navigate("/" + userId + "/admin/project/view/" + item.id) }}
                                style={{ textDecoration: 'none' }}
                                key={item.id}
                                prefix={
                                    <Avatar
                                        // src={user.avatar}

                                        style={{ borderRadius: 20, backgroundColor: randomColor() }}
                                        fit='cover'
                                        width={40}
                                        height={40}
                                    >{item.project_name.charAt(0).toUpperCase()}</Avatar>
                                }
                                description={'DB:' + item.database_name}
                            >
                                {item.project_name}
                            </MList.Item>
                        }}
                    /></div>)
                }

            </ResponsiveLayout>

        </>
    );
}
export default SoftwareProjects;