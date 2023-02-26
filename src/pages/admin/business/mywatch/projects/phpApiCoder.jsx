import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer } from 'antd';
import { Layout, Spin } from 'antd';
import PsContext from '../../../../../context';
import { FormItem, MyButton } from '../../../../../comp';
import { green, blue, cyan } from '@ant-design/colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Table from 'react-bootstrap/Table';
import { Button as MButton } from 'antd-mobile'
import dataTypeConstraints from '../../../../../models/dataTypeConstraints';
import { getAllTables } from '../models/devTools';
const PhpApiCoder = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const {userId, projectId,...other}  = props;
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);

    const [viewData, setviewData] = useState(null);

    const [menuItems, setMenuItems] = useState([]);
    const [menuItemsView, setMenuItemsView] = useState([]);
    const [tables, setTables] = useState([]);
    const [selTableName, setSelTableName] = useState(null);
    const [selColumn, setSelColumn] = useState(null);
    const [tableObjectEditLoading, setTableObjectEditLoading] = useState(false);
    const [constraintEditLoading, setConstraintEditLoading] = useState(false)
    const [visibleEditConstraint, setVisibleEditConstraint] = useState(false);
    const [selInputType, setSelInputType] = useState('');
    const [selConstraint, setSelConstraint] = useState('None');
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
    const onEditConstraint = (table, column) => {
        setSelColumn(column);
        if (column.description) {
            addForm.setFieldsValue({
                input_type: column.dataType,
                constraint: column.constraint,
                constraint_str: column.constraintString
            })

            if (column.dataType)
                setSelInputType(column.dataType);
            if (column.constraint) {
                setSelConstraint(column.constraint)
            }
        }

        setVisibleEditConstraint(true)
        // message.success("edit click" + column.columnName)
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
                    <td><MyButton type="outlined" size="small" shape="circle" color={blue[7]}
                        onClick={() => onEditConstraint(tableObject, column)}
                    ><i class="fa-solid fa-pencil"></i></MyButton></td>
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
    const onTableObjectChange = (value) => {
        if (value && value !== getTableObject()) {
            setTableObjectEditLoading(true)
            var reqData = [
                {
                    query_type: 'delete',
                    table: 'project_tables',
                    where: { project_id: viewData.id, table_name: selTableName },
                    //values: processedValues

                },
                {
                    query_type: 'insert',
                    table: 'project_tables',
                    values: { project_id: viewData.id, table_name: selTableName, table_object: value }

                }
            ];
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
                setTableObjectEditLoading(false);
                var tmpTables = tables;
                var changeIndex = tables.findIndex(item => item.tableName === selTableName);
                tmpTables[changeIndex].tableObject = value;
                setTables(tmpTables);
                message.success('Table Object Name Changed');
            }).catch(err => {
                message.error(err);
                setTableObjectEditLoading(false);
            })
        }

    }
    const onFinishConstraintEdit = (values) => {
        setConstraintEditLoading(true);
        var processedValues = {};
        processedValues['project_id'] = viewData.id;
        processedValues['table_name'] = selTableName;
        processedValues['column_name'] = selColumn.columnName;
        var curDescription = values.input_type + "," + values.constraint + "," + (values.constraint_str ? values.constraint_str : '')
        processedValues['description'] = curDescription;

        var reqDataInsert = [{
            query_type: 'delete',
            table: 'project_table_columns',
            where: { project_id: viewData.id, table_name: selTableName, column_name: selColumn.columnName }

        },
        {
            query_type: 'insert',
            table: 'project_table_columns',
            values: processedValues

        }
        ]
            ;
        context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {


            var tmpTables = tables;
            var changeTableIndex = tables.findIndex(item => item.tableName === selTableName);
            var changeColumnIndex = tables[changeTableIndex].columns.findIndex(item => item.columnName === selColumn.columnName);
            var tmpColumnData = tmpTables[changeTableIndex].columns[changeColumnIndex].columnData;
            tmpColumnData.COLUMN_COMMENT = curDescription;
            tmpTables[changeTableIndex].columns[changeColumnIndex].parseColumn(tmpColumnData);
            setTables(tmpTables)
            setVisibleEditConstraint(false);
            setConstraintEditLoading(false)
            message.success('Constraint Updated');
            //update in table column description.


        }).catch(err => {
            message.error(err);
            setConstraintEditLoading(false);
        })
    }
    const getPossibleConstraints = (inputType) => {
        var possibleConstraints = dataTypeConstraints.find(item => item.dataType === inputType);
        if (possibleConstraints)
            return possibleConstraints.possibleConstraints.split(",");
        else return []
    }
    const getConstraintStrings = (constraint) => {
        if (constraint === 'Collections') {
            let items = [];
            context.psGlobal.collectionData.forEach(item => {
                items.push(item.name)
            })
            return items;
        }
        else if (constraint === 'ForeignKey' || constraint === 'ForeignKey2') {
            let items = [];
            tables.forEach(table => {
                table.columns.forEach(column => {
                    if (column.isPrimryKey || column.isPrimryKey2) {
                        items.push(column.tableName + "." + column.columnName)
                    }
                })
            })
            return items;
        }
        else
            return [];
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
                                >
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Column Name</th>
                                                <th>Data Type</th>
                                                <th>is NULL?</th>
                                                <th>Default</th>
                                                <th>Contraint</th>
                                                <th>Manage</th>
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
            <Drawer width="500" title={selColumn && selColumn.columnName} placement="right" onClose={() => setVisibleEditConstraint(false)} open={visibleEditConstraint}>

                <Form
                    name="basic"
                    form={addForm}
                    labelAlign="left"
                    labelCol={context.isMobile ? null : { span: 8 }}
                    wrapperCol={context.isMobile ? null : { span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinishConstraintEdit}
                    autoComplete="off"
                    layout={context.isMobile ? "vertical" : 'horizontal'}
                >
                    <FormItem
                        label="Input Type"
                        name="input_type"
                        rules={[{ required: true, message: 'Please Select Input Type' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Input Type"

                            optionFilterProp="children"
                            onChange={(value) => setSelInputType(value)}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                dataTypeConstraints.map(item => {
                                    return <Select.Option value={item.dataType}>{item.dataType}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="Constraint"
                        name="constraint"
                        rules={[{ required: true, message: 'Please Select Constraint' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Constraint"

                            optionFilterProp="children"
                            onChange={(value) => setSelConstraint(value)}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                getPossibleConstraints(selInputType).map(item => {
                                    return <Select.Option value={item}>{item}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="Constraint Str"
                        name="constraint_str"
                    // rules={[{ required: true, message: 'Please Select Constraint' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Constraint Str"

                            optionFilterProp="children"
                            //onChange={designationIdOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                getConstraintStrings(selConstraint).map(item => {
                                    return <Select.Option value={item}>{item}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem wrapperCol=
                        {context.isMobile ? null : { offset: 10, span: 24 }}
                    >
                        {
                            !context.isMobile && (
                                <Space>
                                    <MyButton size="large" type="outlined" style={{}} onClick={() => setVisibleEditConstraint(false)}>
                                        Cancel
                                    </MyButton>
                                    <MyButton size="large" type="primary" htmlType="submit" style={{}} loading={constraintEditLoading}>
                                        Save
                                    </MyButton>
                                </Space>

                            )
                        }
                        {
                            context.isMobile && (<Row gutter={2}>
                                <Col span={12}>
                                    <MButton block color='primary' size='small' fill='outline' onClick={() => setVisibleEditConstraint(false)}>
                                        Cancel
                                    </MButton>
                                </Col>
                                <Col span={12}>
                                    <MButton block type='submit' color='primary' size='small' loading={constraintEditLoading}>
                                        Save
                                    </MButton>
                                </Col>
                            </Row>)
                        }

                    </FormItem>

                </Form>
            </Drawer>
        </>
    );

}
export default PhpApiCoder;