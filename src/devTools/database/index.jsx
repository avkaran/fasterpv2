import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Modal } from 'antd';
import { MyButton } from '../../comp'
import { Breadcrumb, Layout, Spin, Card, Menu, Table, Checkbox, Space, Select } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../context';
import { currentInstance, businesses } from '../../utils';
import { cyan } from '@ant-design/colors';
import { MyCodeBlock } from '../../comp'
import './tableStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { DbTable, TableColumn } from '../../models/dbTable';
import dataTypeConstraints from '../../models/dataTypeConstraints'
import { toBeEnabled } from '@testing-library/jest-dom/dist/matchers';
const Database = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [dbName] = useState(businesses[currentInstance.index].dbName);
    const [menuItems, setMenuItems] = useState([]);
    const [tables, setTables] = useState([]);
    const [allTables, setAllTables] = useState([])
    const [selKey, setSelKey] = useState(false);
    const [visibleCodeModal, setVisibleCodeModal] = useState(false);
    const [tableEditData,setTableEditData]=useState();
        //remove after edit table done
        const[eDataType,setEDataType]=useState('');
        const[eConstraint,setEConstraint]=useState('');
        const [eRelation,setERelation]=useState('');
    useEffect(() => {
        LoadTables();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const LoadTables = () => {
        var reqData = [
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE table_schema='" + dbName + "'",
            },
            {
                query_type: 'query',
                query: "SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='" + dbName + "'",
            },
        ];

        context.psGlobal.apiRequest(reqData, context.adminUser(props.match.params.userId).mode).then((res, error) => {
            if (res) {
                let allTableArray = [];
                let tNames = [];
                let mItems = [];

                res[0].forEach((item) => {
                    var curTable = new DbTable(item['TABLE_NAME'], item['TABLE_COMMENT'])
                    let tname = item['TABLE_NAME'];
                    let tColumns = res[1].filter((col) => col.TABLE_NAME === tname)
                    tColumns.forEach(tcol => {
                        var curTableColumn = new TableColumn(tname, tcol['COLUMN_NAME']);
                        curTableColumn.parseColumn(tcol);
                        curTable.addColumn(curTableColumn);
                    })
                    allTableArray.push({ tableName: tname, tableClassObject: curTable })
                    let table = {
                        label: item['TABLE_NAME'], key: item['TABLE_NAME'], tableName: item['TABLE_NAME'],
                        tableComment: item['TABLE_COMMENT'],
                        columns: tColumns,
                    }


                    mItems.push({ label: item['TABLE_NAME'], key: item['TABLE_NAME'] })
                    tNames.push(table);
                })
                setAllTables(allTableArray);
                setMenuItems(mItems);
                setTables(tNames);
            }
            else {
                message.error(error);

            }

        })
    }
    const onTableNameClick = (e) => {
        setSelKey(e.key);
    }

    const tableColumns = [
        {
            title: 'Column Name',
            dataIndex: 'COLUMN_NAME',
            key: 'column_name',
            render: (item) => <strong>{item}</strong>,
        },
        {
            title: 'Column Type',
            dataIndex: 'COLUMN_TYPE',
            key: 'name',
            //render: (text) => <a>{text}</a>,
        },
        {
            title: 'Constraint',
            // dataIndex: 'COLUMN_KEY',
            key: 'constraint',
            render: (item) => <span>{item.COLUMN_KEY + "," + item.EXTRA} </span>,
        },
        {
            title: 'Description',
            dataIndex: 'COLUMN_COMMENT',
            key: 'description',
            // render: (text) => <a>{text}</a>,
        },
        {
            title: 'Actions',
            // dataIndex: 'actions',
            key: 'actions',
            // render: (text) => <a>{text}</a>,
        },
    ]
    const getEditTable = (tableName) => {
        var rows = [];

        let d = tables.find((item) => item.tableName === tableName)
        if (d && d.columns) {
            var table = new DbTable(d.tableName, d.tableComment);
            d.columns.forEach(column => {
                var tColumn = new TableColumn(d.tableName, column.COLUMN_NAME)
                tColumn.parseColumn(column);
                table.addColumn(tColumn);
            })
            table.columns.forEach(column => {
                rows.push(<Row gutter={16}>
                    <Col xs={24} xl={6}>
                        {column.columnName}
                    </Col>
                    <Col xs={24} xl={4}>
                        <Select
                            showSearch
                            placeholder="Data Type"
                            style={{ width: '100%' }}
                            onChange={(value)=>setEDataType(value)}

                            optionFilterProp="children"
                            //onChange={memberCreated_forOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {dataTypeConstraints.map(contraint => {
                                return <Select.Option value={contraint.dataType}>{contraint.dataType}</Select.Option>
                            })}
                        </Select>
                    </Col>
                    <Col xs={24} xl={4}>
                        <Select
                            showSearch
                            placeholder="Constraint"
                            style={{ width: '100%' }}
                            onChange={(value)=>setEConstraint(value)}

                            optionFilterProp="children"
                            //onChange={memberCreated_forOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {getPossibleConstraintOptions(column.inputConstraint.possibleConstraints)}
                        </Select>
                    </Col>
                    <Col xs={24} xl={1}>
                        </Col>
                    <Col xs={24} xl={9}>
                        <Select
                            showSearch
                            placeholder="Relation"
                            allowClear={true}
                            style={{ width: '100%' }}
                            onChange={(value)=>setERelation(value ?value:'')}
                            optionFilterProp="children"
                            //onChange={memberCreated_forOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {getRelationOptions("all")}
                        </Select>
                    </Col>
                </Row>)
            })
        }
        console.log('collections', context.psGlobal.collectionData)
        console.log('table', table)
        return rows;
    }
    const getPossibleConstraintOptions = (possibleConstraints) => {
        var constraintOptions = [];
        if (possibleConstraints) {
            var splitConstraints = possibleConstraints.split(",");
            splitConstraints.forEach(constraint => {
                constraintOptions.push(<Select.Option value={constraint}>{constraint}</Select.Option>)
            })
        }
        return constraintOptions;

    }
    const getRelationOptions = (constraintType) => {
        var relationOptions = [];
        if (constraintType === "Collections" || constraintType==="all") {
            context.psGlobal.collectionData.forEach(col => {
                relationOptions.push(<Select.Option value={col.name}>{col.name}</Select.Option>)
            })
        }
        if (constraintType === "ForeignKey" || constraintType==="all") {
            if (allTables.length > 0) {
                allTables.forEach(table => {
                    table.tableClassObject.columns.forEach(column => {
                        if (column.isPrimryKey || column.isPrimryKey2) {
                            relationOptions.push(<Select.Option value={column.tableName + "." + column.columnName}>{column.tableName + "." + column.columnName}</Select.Option>)
                        }
                    })
                })
            }
        }
        return relationOptions;
    }
    const getTableData = (tableName) => {

        let d = tables.find((item) => item.tableName === tableName)


        if (d && d.columns) {
            d.columns = d.columns.map(obj => ({ ...obj, key: obj.COLUMN_NAME }));
            return <Table
                /* rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }} */
                scroll={{ x: 300, y: 400 }}
                bordered pagination={false} columns={tableColumns} dataSource={d.columns}
            />
        }

    }
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // if (selectedRowKeys)
            //   setSelColumns(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            // disabled: record.COLUMN_NAME === 'Disabled User',
            // Column configuration not to be checked
            name: record.COLUMN_NAME,
        }),
    };
    const getTableObject = (tableName) => {
        let d = tables.find((item) => item.tableName === tableName);
        return d && d.tableComment;
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
                        <span>page 1</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>page 2</Breadcrumb.Item>
                </Breadcrumb>

                <Card title="Blank Page" extra={<Space><MyButton href="" ><i className="fa-solid fa-list pe-2" ></i>right button</MyButton></Space>}>

                    <Spin spinning={loader} >
                        <Row gutter={16}>
                            <Col className="gutter-row" span={4}>
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


                                >Tables</Card>
                                <Menu
                                    mode="inline"
                                    theme="light"
                                    onClick={onTableNameClick}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                    items={menuItems}
                                />
                            </Col>
                            <Col className="gutter-row" span={20}>
                                <Card title={"Table Info : " + selKey + " (" + getTableObject(selKey) + ")"} extra={<MyButton >Generate</MyButton>}>
                                    {getTableData(selKey)}
                                </Card>
                                <Card title={"Edit Table : " + selKey + " (" + getTableObject(selKey) + ")"} >
                                    {eDataType+","+eConstraint+","+eRelation}
                                    {getEditTable(selKey)}
                                </Card>
                            </Col>
                        </Row>

                        {/*  {viewData && Object.keys(viewData).length > 0 && (
                            <></>
                        )} */}
                    </Spin>
                </Card>

            </Content>
            <Modal
                visible={visibleCodeModal}
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

            </Modal>


        </>
    );

}
export default Database;