import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space, Button, Checkbox } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer, Modal, Tabs } from 'antd';
import { Layout, Spin, Divider } from 'antd';
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faClose } from '@fortawesome/free-solid-svg-icons';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables, getPHPApiModalFunctionCode } from '../models/devTools';
import { MyCodeBlock } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import * as tf from '@tensorflow/tfjs';
import { Tokenizer, tokenizerFromJson } from 'tf_node_tokenizer';

const TableOutput = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const { userId, tableData, ...other } = props;
    const [loader, setLoader] = useState(false);

    const [tableDataView, setTableDataView] = useState([]);

    const [tableColumns, setTableColumns] = useState([]);

    const [checkedListColumns, setCheckedListColumns] = useState([]);
    const [indeterminateColumns, setIndeterminateColumns] = useState(true);
    const [checkAllColumns, setCheckAllColumns] = useState(false);

    const cellStyle = { borderCollapse: "collapse", border: '1px solid black' };
    useEffect(() => {
        loadColumns(tableData);
        setTableDataView(tableData);
    }, [tableData]);
    const onCheckBoxChangeColumns = (list) => {
        setCheckedListColumns(list);
        setIndeterminateColumns(!!list.length && list.length < tableColumns.length);
        setCheckAllColumns(list.length === tableColumns.length);
    };
    const onCheckAllChangeColumns = (e) => {
        setCheckedListColumns(e.target.checked ? tableColumns : []);
        setIndeterminateColumns(false);
        setCheckAllColumns(e.target.checked);
    };
    const onSearchTables = (e) => {
        const searchTerm = e.target.value.toUpperCase();
        let matchingColumns = tableColumns.filter(item => item.toUpperCase().indexOf(searchTerm) > -1);
        let nonMatchingColumns = tableColumns.filter(item => item.toUpperCase().indexOf(searchTerm) === -1);
        let sortedColumns = [...matchingColumns, ...nonMatchingColumns];
        setTableColumns(sortedColumns);

    }
    const onSearchTableData = (e) => {
        const searchTerm = e.target.value.toUpperCase();
        const searchTermsArr = searchTerm.split(' '); // Split the search term into words

        const filteredData = tableData.filter((item) => {
            // Check each word against all the columns of the current row
            return searchTermsArr.every((term) => {
                return Object.values(item).some((value) => {
                    return value.toUpperCase().includes(term);
                });
            });
        });

        setTableDataView(filteredData);
    }
    const onCodeClick = (selTable) => {


    }
    const loadColumns = (array_or_data) => {
        if (array_or_data && Array.isArray(array_or_data) && array_or_data.length > 0) {
            if (typeof array_or_data[0] === "object") {


                var tHeads = [];
                for (let key in array_or_data[0]) {
                    tHeads.push(key)
                }
                setTableColumns(tHeads);
                if (tHeads.length > 5) {
                    //remvoe after 5
                    var curCols = tHeads.slice();
                    curCols.splice(5, tHeads.length - 5)
                    setCheckedListColumns(curCols)
                } else
                    setCheckedListColumns(tHeads)

            }
            else {
                setTableColumns(['Array'])
            }
        }
    }
    const getArrayToTable = (array_or_data) => {
        if (array_or_data && Array.isArray(array_or_data) && array_or_data.length > 0) {
            if (typeof array_or_data[0] === "object") {


                var tHeads = [];
                checkedListColumns.forEach(item => {
                    tHeads.push(<th style={cellStyle}>{item}</th>)
                })

                var trs = [];
                array_or_data.forEach(obj => {
                    var tds = [];
                    for (let key in obj) {
                        if (checkedListColumns.includes(key))
                            tds.push(<td style={cellStyle}>{obj[key]}</td>)
                    }
                    trs.push(<tr>{tds}</tr>)
                })

                return <table width="100%" cellpadding="5px" style={{ border: '1px solid black', borderCollapse: "collapse" }} >
                    <tr>{tHeads}</tr>
                    {trs}
                </table>
            }
            else {
                var values = [];
                array_or_data.forEach((obj, index) => {
                    values.push(<>{index}. {obj}<br /></>)
                })
                return <Card title="Array">
                    {values}
                </Card>
            }
        }

    }
    return (
        <>
            <Spin spinning={loader} >
                {
                    tableData && (<>
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
                                        placeholder="Search Columns" onChange={onSearchTables}
                                        suffix={<FontAwesomeIcon icon={faSearch} />}
                                    />
                                </Card>
                                <Checkbox indeterminate={indeterminateColumns} onChange={onCheckAllChangeColumns} checked={checkAllColumns}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                >
                                    Check all
                                </Checkbox>

                                <Checkbox.Group value={checkedListColumns} onChange={onCheckBoxChangeColumns}
                                    style={{
                                        width: '100%',
                                        border: '1px solid',
                                        borderColor: cyan[2],
                                        borderTop: '0',
                                    }}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        {
                                            tableColumns.map(item => {
                                                return <Checkbox value={item} key={item}>{item}</Checkbox>
                                            })
                                        }
                                    </Space>
                                </Checkbox.Group>

                            </Col>

                            <Col className='gutter-row' span={18}>
                                <Card
                                >
                                    <Row gutter={5}>
                                        <Col span={12}>
                                            <Input
                                                placeholder="Search in Data" onChange={onSearchTableData}
                                                suffix={<FontAwesomeIcon icon={faSearch} />}
                                            />
                                        </Col>
                                    </Row>
                                    <Row gutter={16} style={{ marginTop: '10px' }}>
                                        <Col span={24}>
                                            <div style={{ overflowX: 'scroll' }}>


                                                {getArrayToTable(tableDataView)}
                                            </div>
                                        </Col>

                                    </Row>

                                </Card>
                            </Col>
                        </Row>
                    </>)
                }

            </Spin>

        </>
    );

}
export default TableOutput;