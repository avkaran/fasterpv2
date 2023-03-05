import React, { useState, useEffect, useContext, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Checkbox, List, Switch } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer, Modal } from 'antd';
import { Layout, Spin } from 'antd';
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faBars, faMaximize, faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import Table from 'react-bootstrap/Table';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables, getReactCode } from '../models/devTools';
import { ReactSortable } from "react-sortablejs";
import './sortable.css'
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { MyCodeBlock } from '../../../../../comp'
const ReactCodeGenerator = (props) => {
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
    const [checkedList, setCheckedList] = useState([]);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const [finalColumns, setFinalColumns] = useState([])
    const [isTwoColumn, setIsTwoColumn] = useState(false);
    const [moveColumnLoading, setMoveColumnLoading] = useState(false);

    const [visibleCodeModal, setVisibleCodeModal] = useState(false);
    const [moduleName, setModuleName] = useState('Module');
    const [moduleType, setModuleType] = useState('add-edit');
    const [uiType, setUiType] = useState('antd')
    const [outputCode, setOutputCode] = useState('');
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

        getAllTables(project).then(res => {
            setTables(res.tables);
            setMenuItems(res.menus);
            setMenuItemsView(res.menus);
        }).catch(err => {
            message.error(err)
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
                var tRow = <Row><Checkbox value={selTable + "." + column.columnName}>{column.columnName}</Checkbox></Row>;
                tRows.push(tRow)
            })

        }
        return tRows;
    }
    const getColumnsLength = () => {
        var tableObject = tables.find(item => item.tableName === selTableName);
        if (tableObject) {
            return tableObject.columns.length;
        } else return 0
    }
    const onCheckBoxChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < getColumnsLength());
        setCheckAll(list.length === getColumnsLength());
    };
    const onCheckAllChange = (e) => {
        var tableObject = tables.find(item => item.tableName === selTableName);
        var allValues = []
        tableObject.columns.forEach(item => {
            allValues.push(selTableName + "." + item.columnName)
        })
        setCheckedList(e.target.checked ? allValues : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };
    const onMoveSelectedClick = () => {
        setMoveColumnLoading(true)
        var curFinalColumns = finalColumns;
        checkedList.forEach(item => {
            if (!finalColumns.includes(item))
                curFinalColumns.push(item)
            else message.error(item + " already selected")
        })
        //    setFinalColumns(prevList => [...prevList, order]); immutable

        setFinalColumns(prev => {
            return curFinalColumns
        });
        setMoveColumnLoading(false)
    }
    var CustomComponent = forwardRef(function (props, ref) {
        return <List ref={ref}>{props.children}</List>;
    });
    const onCodeGenerateClick = () => {
        if (finalColumns && finalColumns.length > 0) {
            //  console.log('test',finalColumns,tables)
            var codeStr = getReactCode(tables, finalColumns, moduleType, moduleName, uiType)
            setOutputCode(codeStr);
            setVisibleCodeModal(true)
            message.success("code clicked")
        }
        else {
            message.error("No Columns/Fields to generate Code")
        }

    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    viewData && (<>
                        <Row gutter={5}>


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
                                <Allotment>
                                    <Card
                                        title={<><Checkbox indeterminate={indeterminate}
                                            onChange={onCheckAllChange} checked={checkAll}>
                                            {selTableName}
                                        </Checkbox></>}

                                        extra={<MyButton type="primary" shape="circle" onClick={onMoveSelectedClick} loading={moveColumnLoading}><FontAwesomeIcon icon={faArrowRight} /></MyButton>}
                                    >
                                        <Checkbox.Group
                                            onChange={onCheckBoxChange}
                                            value={checkedList}
                                        >
                                            <Space direction='vertical'>
                                                {getTableColumns(selTableName)}
                                            </Space>
                                        </Checkbox.Group>
                                    </Card>

                                    <Card title="Code"
                                        extra={<><Space>Two Coloumn : <Switch onChange={(checked) => setIsTwoColumn(checked)}
                                        /> <MyButton type="primary" onClick={onCodeGenerateClick}>Code</MyButton></Space>
                                        </>}
                                        loading={moveColumnLoading}
                                    >
                                        <Row gutter={3}>
                                            <Col span={12}>
                                                Module Name
                                            </Col>
                                            <Col span={12}>
                                                <Input defaultValue="Module" onChange={(e) => setModuleName(e.target.value)}></Input>
                                            </Col>
                                        </Row>
                                        <Row gutter={3}>
                                            <Col span={12}>
                                                Module Type
                                            </Col>
                                            <Col span={12}>
                                                <Select
                                                    showSearch
                                                    placeholder="Module Type"
                                                    onChange={(value) => setModuleType(value)}
                                                    optionFilterProp="children"
                                                    style={{ width: '100%' }}
                                                    //onChange={examPatternOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    <Select.Option value="add-edit">Add/Edit</Select.Option>
                                                    <Select.Option value="add">Add</Select.Option>
                                                    <Select.Option value="edit">Edit</Select.Option>
                                                    <Select.Option value="view">View</Select.Option>
                                                    <Select.Option value="list">List</Select.Option>
                                                </Select>
                                            </Col>
                                        </Row>
                                        <Row gutter={3}>
                                            <Col span={12}>
                                                Design Type
                                            </Col>
                                            <Col span={12}>
                                                <Select
                                                    showSearch
                                                    placeholder="UI Type"
                                                    onChange={(value) => setUiType(value)}
                                                    optionFilterProp="children"
                                                    style={{ width: '100%' }}
                                                    //onChange={examPatternOnChange}
                                                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                >
                                                    <Select.Option value="antd">Antd</Select.Option>
                                                    <Select.Option value="react-bootstrap">Bootstrap</Select.Option>

                                                </Select>
                                            </Col>
                                        </Row>
                                        <hr />
                                        {
                                            !isTwoColumn && (<ReactSortable list={finalColumns} setList={setFinalColumns}
                                                animation={150}
                                                ghostClass="dropArea"
                                                handle=".dragHandle"


                                            >
                                                {finalColumns.map((item) => (
                                                    <div className="justify-content-between mt-3" key={item}>
                                                        <span className="btn btn-white border shadow-sm dragHandle"><FontAwesomeIcon icon={faBars} /></span> <span>{item}</span>

                                                    </div>

                                                ))}
                                            </ReactSortable>)
                                        }
                                        {
                                            isTwoColumn && (<ReactSortable
                                                list={finalColumns}
                                                setList={(newlist) => setFinalColumns(newlist)}
                                                ghostClass="dropArea"
                                                handle=".dragHandle"
                                                filter=".ignoreDrag"
                                                preventOnFilter={true}
                                                className="grid-container"
                                            // onEnd={({ oldIndex, newIndex }) => onDragDropEnds(oldIndex, newIndex)}
                                            >
                                                <>
                                                    {finalColumns.map((item) => (
                                                        <div key={item} className="grid-items justify-content-between">
                                                            <span className="btn btn-white border shadow-sm dragHandle"><FontAwesomeIcon icon={faBars} /></span> <span>{item}</span>

                                                        </div>
                                                    ))}

                                                </>
                                            </ReactSortable>)
                                        }

                                    </Card>
                                </Allotment>

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
                <MyCodeBlock
                    customStyle={{ height: '500px', overflow: 'auto' }}
                    text={outputCode}
                    language="jsx"
                />
            </Modal>
        </>
    );

}
export default ReactCodeGenerator;