import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Button } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer, Modal } from 'antd';
import { Layout, Spin } from 'antd';
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import Table from 'react-bootstrap/Table';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables, getPHPApiModalFunctionCode } from '../models/devTools';
import { MyCodeBlock } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
const PhpApiCoder = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const { userId, projectId, ...other } = props;
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);

    const [viewData, setviewData] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [menuItemsView, setMenuItemsView] = useState([]);
    const [tables, setTables] = useState([]);
    const [selTableName, setSelTableName] = useState(null);
    const [visibleCodeModal, setVisibleCodeModal] = useState(false);
    const [outputCode, setOutputCode] = useState({});
    const [moduleName, setModuleName] = useState('Module');
    const [functionSuffixName, setFunctionSuffixName] = useState('exam')
    useEffect(() => {
        loadViewData(projectId);
    }, []);
    const loadViewData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setviewData(res[0]);
            LoadTables(res[0])
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const LoadTables = (project) => {
        setLoader(true)
        getAllTables(project).then(res => {
            setTables(res.tables);
            setMenuItems(res.menus);
            setMenuItemsView(res.menus);
            setLoader(false)
        }).catch(err => {
            message.error(err)
            setLoader(false)
        });


    }

    const onSearchTables = (e) => {
        let filteredMenus = menuItems.filter(item => item.label.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1);
        setMenuItemsView(filteredMenus);

    }

    const getTableColumns = (selTable) => {
        var tRows = [];
        var tableObject = tables.find(item => item.tableName === selTable);
        if (tableObject) {
            tableObject.columns.forEach((column, index) => {
                var tRow = <tr>
                    <td>{index + 1}</td>
                    <td>{column.columnName}</td>
                    <td>{column.columnType}</td>
                    <td><Tag color={column.isNullable ? 'green' : 'red'} style={{ fontWeight: 'bold' }}>{column.isNullable ? 'Yes' : 'No'}</Tag></td>
                    <td>{column.columnDefault}</td>
                    <td>{column.description}</td>

                </tr>;
                tRows.push(tRow)
            })

        }
        return tRows;
    }
    const getTableObject = (selTable) => {
        var tableObject = tables.find(item => item.tableName === selTable);
        return tableObject && tableObject.tableObject;
    }

    const onCodeClick = (selTable) => {
        var tableObject = tables.find(item => item.tableName === selTable);
        var controllerTemplate = `<?php
    namespace yourNameSpace;
    use App\TheYak\Controller;
    class {pageName}Controller extends Controller {
        public function __construct() {
            
            parent::__construct();
        }
        public function xpostAdd`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostSave();
        }
        public function xpostUpdate`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostUpdate();
        }
        public function xpostTotalRecords`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostTotalRecords();
        }
        public function xpostList`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostList();
        }
        public function xpostDelete`+ capitalizeFirst(functionSuffixName).replaceAll(' ', '') + `(){
            $model = new \App\Models\WebsiteCMS\ContentModel();
            $model->xpostDelete();
        }
    }`;
        let addModalCode = getPHPApiModalFunctionCode('add', tableObject, functionSuffixName);
        let updateModalCode = getPHPApiModalFunctionCode('update', tableObject, functionSuffixName);
        let totalRecordsModalCode = getPHPApiModalFunctionCode('total-records', tableObject, functionSuffixName);
        let listModalCode = getPHPApiModalFunctionCode('list', tableObject, functionSuffixName);
        let deleteModalCode = getPHPApiModalFunctionCode('delete', tableObject, functionSuffixName);

        var modalTemplate = `<?php
    namespace App\Models\YourNameSpace;
    use App\TheYak\Model;
    use Rakit\Validation\Validator;
    class {pageName}Model extends Model
    {
        public function __construct()
        {
            parent::__construct();
            $this->api(true);
        }
        ${addModalCode}
        ${updateModalCode}
        ${totalRecordsModalCode}
        ${listModalCode}
        ${deleteModalCode}     
    }`;
        controllerTemplate = controllerTemplate.replace("{pageName}", capitalizeFirst(moduleName).replace(" ", ""));
        modalTemplate = modalTemplate.replace("{pageName}", capitalizeFirst(moduleName).replace(" ", ""));

        setOutputCode({
            ControllerCode: controllerTemplate,
            modalCode: modalTemplate
        });
        setVisibleCodeModal(true);
        console.log('test', tableObject)
    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
                        <Row gutter={16}>

                            <Col className="gutter-row" span={6}>
                                <Card
                                    bodyStyle={{
                                        padding: "8px", fontWeight: 'bold', fontSize: '18px', color: cyan[7],
                                        border: '1px solid',
                                        borderBottom: '0',
                                        borderColor: cyan[2]
                                    }}
                                    style={{
                                        margin: "0px",
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '2px',

                                        //borderRadius: "20px",
                                    }}


                                >
                                    <Input
                                        placeholder="input search text" onChange={onSearchTables}
                                        suffix={<FontAwesomeIcon icon={faSearch} />}
                                    />
                                </Card>
                                <Menu
                                    mode="inline"
                                    theme="light"
                                    onClick={e => setSelTableName(e.key)}
                                    // defaultSelectedKeys={[selCollection]}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                    items={menuItemsView}
                                />
                            </Col>

                            <Col className='gutter-row' span={18}>
                                <Card
                                    title={<>
                                        <Row>
                                            <Col> {selTableName}
                                            </Col>
                                            <Col>({getTableObject(selTableName)})</Col>

                                        </Row>
                                    </>}
                                    extra={<Button type="primary" onClick={() => onCodeClick(selTableName)}>Code</Button>}

                                >
                                    <Row gutter={16}>
                                        <Col span={4}>
                                            Module Name
                                        </Col>
                                        <Col span={4}>

                                            <Input placeholder='Module Name' defaultValue="Module" onChange={(e) => setModuleName(e.target.value)}></Input>
                                        </Col>
                                        <Col span={4}>
                                            Function Suffix
                                        </Col>
                                        <Col span={4}>

                                            <Input placeholder='Function Suffix' defaultValue="Exam" onChange={(e) => setFunctionSuffixName(e.target.value)}></Input>
                                        </Col>
                                    </Row>
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Column Name</th>
                                                <th>Data Type</th>
                                                <th>is NULL?</th>
                                                <th>Default</th>
                                                <th>Contraint</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                getTableColumns(selTableName)
                                            }


                                        </tbody>
                                    </Table>
                                </Card>
                            </Col>
                        </Row>
                    </>)
                }

            </Spin>
            <Modal
                open={visibleCodeModal}
                zIndex={10000}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={true}
                closable={true}
                //style={{ marginTop: '20px' }}
                width={1000}
                // footer={null}
                onCancel={() => { setVisibleCodeModal(false) }}
                title="Code Generator"
            >

                <Row gutter={16}>
                    Controller Code
                </Row>

                <MyCodeBlock
                    customStyle={{ height: '300px', overflow: 'auto' }}
                    text={outputCode.ControllerCode ? outputCode.ControllerCode : ''}
                    language="php"
                />
                <Row gutter={16}>
                    Modal Code
                </Row>
                <MyCodeBlock
                    customStyle={{ height: '300px', overflow: 'auto' }}
                    text={outputCode.modalCode ? outputCode.modalCode : ''}
                    language="php"
                />
            </Modal>
        </>
    );

}
export default PhpApiCoder;