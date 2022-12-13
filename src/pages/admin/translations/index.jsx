import React, { useState, useEffect, useContext } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { MyButton } from '../../../comp'
import { Breadcrumb, Layout, Spin, Card, Tag, Modal, Button,Radio,Divider } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../context';
import { MyTable, DeleteButton, PaginatedTable } from '../../../comp';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import AddTranslation from './addEditTranslation';
import AddEditTranslation from './addEditTranslation';
import ViewTranslation from './viewTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUserTimes, faClose } from '@fortawesome/free-solid-svg-icons'
import { capitalizeFirst, currentInstance, businesses } from '../../../utils';
import { languages } from '../../../models/core';
import ResponsiveLayout from '../layout'
const Translations = (props) => {
    const context = useContext(PsContext);
const {userId}=useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [data, setData] = useState([]);
    const [curAction, setCurAction] = useState('list');
    const [isModal] = useState(true);
    const [viewOrEditData, setViewOrEditData] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const [heading] = useState('Translation');
    const [refreshTable, setRefreshTable] = useState(0);
    const [curLanguages, setCurLanguages] = useState(null);
    const [lang, setLang] = useState('ta')
    useEffect(() => {
        if (businesses[currentInstance.index].multilingual) {

            var langs = languages.filter(item => businesses[currentInstance.index].multilingual.indexOf(item.id) > -1 && item.id !== "en");
            console.log('langs',langs)
            setCurLanguages(langs);
           if (langs.length > 0)
                setLang(langs[0].id);
        }else
        message.error("multilingual not set for this project")
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
            title: 'Phrase',
            dataIndex: 'phrase_primary_id',
            key: 'plan_name',
            //render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Language',
            dataIndex: 'language',
            key: 'language',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Translation',
            dataIndex: 'translation',
            key: 'translation',
            // render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
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
                <DeleteButton type="outlined" size="small" shape="circle" color={red[7]} onFinish={() =>{ setCurAction("list");setRefreshTable(prev=>prev+1) }}
                    title="Translation"
                    table="translations"
                    //id must,+ give first three colums to display
                    dataItem={{ id: item.id, phrase: item.phrase_primary_id, translation: item.translation, type: item.source_type }}
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
    const onLanguageChange = (e) => {
        setLang(e.target.value);
    }
    return (
        <>
        <ResponsiveLayout
         
         userId={userId}
         customHeader={null}
         bottomMenues={null}
         breadcrumbs={[
            {name:'Translations',link:null},
            {name:'List Translations',link:null},
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
                        {curAction === "view" && (<ViewTranslation viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditTranslation lang={lang} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditTranslation lang={lang} editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); setVisibleModal(false); }} userId={userId} />)}

                    </Modal>)
                }

                {
                    !isModal && (curAction === "add" || curAction === "edit" || curAction === "view") && (<Card title={capitalizeFirst(curAction) + " " + heading} extra={<Button onClick={() => setCurAction("list")}><i className="fa-solid fa-list pe-2" ></i>List {heading}s</Button>}>

                        {curAction === "view" && (<ViewTranslation viewIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} userId={userId} />)}
                        {curAction === "add" && (<AddEditTranslation lang={lang} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}
                        {curAction === "edit" && (<AddEditTranslation lang={lang} editIdOrObject={viewOrEditData} onListClick={() => setCurAction("list")} onSaveFinish={() => { setCurAction("list"); setRefreshTable(prev => prev + 1); }} userId={userId} />)}

                    </Card>)
                }
                <Card title="Translations" extra={<MyButton onClick={onAddClick} ><i className="fa-solid fa-plus pe-2" ></i>Add Translation</MyButton>} style={{ display: (curAction === "list" || isModal) ? 'block' : 'none' }}>
                    <Row>
                        <Col xl={2}>Language</Col>
                        <Col>
                            <Radio.Group defaultValue="ta" buttonStyle="solid" onChange={onLanguageChange}>
                                {curLanguages && curLanguages.map(item => {
                                    return (<Radio.Button value={item.id}>{item.name}</Radio.Button>)
                                })}

                            </Radio.Group>
                        </Col>
                    </Row><Divider />

                    <PaginatedTable
                        columns={tableColumns}
                        refresh={refreshTable}
                        countQuery={"select count(*) as count from translations where status=1 and source_type='phrase' and language='"+lang+"'"}
                        listQuery={"select *,@rownum:=@rownum+1 as row_num from translations CROSS JOIN (SELECT @rownum:={rowNumberVar}) c where status=1 and source_type='phrase' and language='"+lang+"'"}
                        itemsPerPage={20}
                    />

                </Card>



            </ResponsiveLayout>

        </>
    );
}
export default Translations;