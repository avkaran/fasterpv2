import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Button } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer } from 'antd';
import { Layout, Spin, Upload } from 'antd';
import { Table } from 'react-bootstrap'
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
//import Table from 'react-bootstrap/Table';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables } from '../models/devTools';
//import { readXlsxFile } from 'read-excel-file';

import * as XLSX from 'xlsx';
import stringSimilarity from 'string-similarity';
const TableDataReformat = (props) => {
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
    const [originTable, setOrginTable] = useState(null);


    const [excelColumns, setExcelColumns] = useState([]);
    const [result, setResult] = useState([]);

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

    const getTableObject = (selTable) => {
        var tableObject = tables.find(item => item.tableName === selTable);
        return tableObject && tableObject.tableObject;
    }
    //code starts
    const handleFileChange = (event) => {
        const file = event.file.originFileObj;
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelColumns(rows[0]);
            //setData(rows);
            const originTableColumns = getOrginTable().columns;
            const result = compareColumns(excelColumns, originTableColumns,worksheet);
            setResult(result);
        };
        reader.readAsBinaryString(file);
    };

    function compareColumns(excelColumns, originTableColumns,worksheet) {
        const result = [];

        excelColumns.forEach((excelColumn, index) => {
            const match = {
                excelColumnName: excelColumn,
                excelDataType: getExcelColumnType(worksheet, index), // fill this in with the data type of the Excel column
                originColumnName: '',
                originDataType: '',
                matchType: 'mismatch'
            };

            originTableColumns.forEach((originColumn) => {
              
                const similarity = stringSimilarity.compareTwoStrings(excelColumn.toLowerCase(), originColumn.columnName.toLowerCase());
                if(excelColumn==='NAME')
                console.log('comparing',excelColumn.toLowerCase(),originColumn.columnName.toLowerCase(),similarity)
                //if (similarity > 0.7) {
                    if (similarity > 0.7) {
                    match.originColumnName = originColumn.columnName;
                    match.originDataType = originColumn.columnData.DATA_TYPE;
                    match.matchType = 'match';
                }
            });

            result.push(match);
        });

        return result;
    }


    function getExcelColumnType(sheet, column) {
        // Iterate over the cells in the column
        let columnType = null;
        XLSX.utils.sheet_to_json(sheet, { header: 1 }).forEach((row, index) => {
          const cellValue = row[column];
          if (index === 0) {
            // Skip the header row
            return;
          }
          if (typeof cellValue === 'number' && (columnType === null || columnType === 'numeric')) {
            columnType = 'numeric';
          } else if (typeof cellValue === 'string' && (columnType === null || columnType === 'text')) {
            columnType = 'text';
          } else if (cellValue instanceof Date && (columnType === null || columnType === 'datetime')) {
            columnType = 'datetime';
          } else if (typeof cellValue === 'boolean' && (columnType === null || columnType === 'boolean')) {
            columnType = 'boolean';
          } else {
            columnType = 'mixed';
            return; // Once we've identified mixed data, we don't need to check any more cells
          }
        });
        return columnType;
      }


    //code ends


    const onTestClick = () => {
        var tableObject = tables.find(item => item.tableName === selTableName);
        console.log('test', tableObject)
    }

    const getOrginTable = () => {
        var tableObject = tables.find(item => item.tableName === selTableName);
        return tableObject;
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
                                    title={<>{selTableName}({getTableObject(selTableName)})</>}
                                    extra={<Button type='primary' onClick={onTestClick}>test</Button>}
                                >
                                    {
                                        selTableName && (<div>
                                            <Upload onChange={handleFileChange}>
                                                <Button>Upload Excel File</Button>
                                            </Upload>
                                            <div style={{ marginTop: '16px' }}>
                                                <Table striped bordered hover>
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Excel Column Name</th>
                                                            <th>Excel Data Type</th>
                                                            <th>Origin Column Name</th>
                                                            <th>Origin Data Type</th>
                                                            <th>Match/Mismatch</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {result && result.length > 0 && result.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.excelColumnName}</td>
                                                                <td>{item.excelDataType}</td>
                                                                <td><Input defaultValue={item.originColumnName} /></td>
                                                                <td>{item.originDataType}</td>
                                                                <td>{item.matchType}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>)
                                    }

                                </Card>
                            </Col>
                        </Row>
                    </>)
                }

            </Spin>

        </>
    );

}
export default TableDataReformat;