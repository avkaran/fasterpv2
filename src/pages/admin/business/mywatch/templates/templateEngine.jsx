import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, message, Space, Button } from 'antd';
import { Card } from 'antd';
import { Form, Input, Select, Menu, Tag, Typography, Drawer, Modal, Tabs } from 'antd';
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
import * as tf from '@tensorflow/tfjs';
import { Tokenizer, tokenizerFromJson } from 'tf_node_tokenizer';
import { getWhereClause } from '../../../../../models/core';
import ResponsiveLayout from '../../../layout';
import Handlebars from 'handlebars';
import Editor from '@monaco-editor/react';
import { getTemplateFunctionNames } from '../models/templateFunctions';
import TableOutput from '../outputs/tableOutput';
import * as monaco from 'monaco-editor'
const TemplateEngine = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);

    const [menuItems, setMenuItems] = useState([]);
    const [selTemplate, setSelTemplate] = useState(null);
    const [inputVariables, setInputVariables] = useState([])
    const [renderedOutput, setRenderedOutput] = useState([])
    const [visibleModal, setVisibleModal] = useState(false);
    const [outputLoader, setOutputLoader] = useState(false);
    const [projects, setProjects] = useState([])

    const [dynTableRows, setDynTableRows] = useState([])
    const cellStyle = { borderCollapse: "collapse", border: '1px solid black' };
    const QueryEditorOptions = {
        suggest: [
          { label: 'SELECT', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'SELECT' },
          { label: 'FROM', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'FROM' },
          { label: 'WHERE', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'WHERE' },
          { label: 'GROUP BY', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'GROUP BY' },
          { label: 'HAVING', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'HAVING' },
          { label: 'ORDER BY', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'ORDER BY' },
          { label: 'ASC', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'ASC' },
          { label: 'DESC', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'DESC' },
          { label: 'INNER JOIN', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'INNER JOIN' },
          { label: 'LEFT JOIN', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'LEFT JOIN' },
          { label: 'RIGHT JOIN', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'RIGHT JOIN' },
        ]
      };

    useEffect(() => {
        loadProjects()
    }, []);
    const loadProjects = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setProjects(res);
            // LoadTables(res[0])
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const loadTemplates = (searchText) => {

        setLoader(true);
        var filter_or_clauses = [];
        const searchTerms = searchText.split(" ");
        searchTerms.forEach(item => {
            filter_or_clauses.push("t.string_id like '%" + item + "%'")
            filter_or_clauses.push("t.template_title like '%" + item + "%'")
            filter_or_clauses.push("t.descripiton like '%" + item + "%'")
            filter_or_clauses.push("tc.category_name like '%" + item + "%'")
            filter_or_clauses.push("tc.type like '%" + item + "%'")
        })
        var filterColumns = ["(" + filter_or_clauses.join(" OR ") + ")"];

        var reqData = {
            query_type: 'query',
            query: "select t.*,tc.category_name,tc.type,tc.output_type from templates t,template_categories tc where t.status=1 and t.template_category=tc.id" + getWhereClause(filterColumns, false) + " limit 0,30"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            var mItems = [];
            res.forEach(item => {
                mItems.push({ label: item.template_title, key: item.id, templateData: item })
            })
            setMenuItems(mItems)
            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })

    }
    const loadInputVariables = async (template_id) => {
        return new Promise((resolve, reject) => {
            var reqData = {
                query_type: 'query',
                query: "select * from template_variables where status=1 and template_id=" + template_id
            };
            context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {

                resolve(res)

            }).catch(err => {
                reject(err)
            })
        })

    }
    const onSearchTemplates = (value) => {
        if (value) {
            loadTemplates(value)
        }
        else message.error("No word to search")

    }
    const onRenderClick = (templateItem) => {

    }
    const onMenuClick = (e) => {
        var sTemplate = menuItems.find(item => parseInt(item.key) === parseInt(e.key))
        setSelTemplate(sTemplate.templateData);
        loadInputVariables(e.key).then(res => {
            setInputVariables(res)
            var tableVariables = res.filter(item => item.input_type === 'table-data-or-objects-array');
            var dRows = []
            tableVariables.forEach(item => {
                dRows.push({ variableName: item.input_variable_name, rowCount: 5 })
            })

            setDynTableRows(dRows)
        });

    }

    const onTableInputChange = (input_variable_name, i, value) => {
        setDynTableRows(prevRows => {

            return prevRows.map(item => {
                if (item.variableName === input_variable_name) {

                    if (parseInt(item.rowCount) - 1 === i) {

                        return { ...item, rowCount: item.rowCount + 1 };
                    }
                }

                return item;
            });
        });
    };
    const getInputFormControls = () => {
        var valueOrArrayVariables = inputVariables//.filter(item => item.input_type === 'value' || item.input_type === 'array');
        var fItems = []

        valueOrArrayVariables.forEach(item => {
            var inputControl = <></>
            if (item.input_type === 'value') {

                fItems.push(<Col className='gutter-row' xs={24} xl={12}>
                    <FormItem
                        label={item.input_variable_name}
                        name={['variables', item.input_variable_name]}
                        rules={[{ required: true, message: 'Please Enter' }]}
                    >
                        <Input placeholder={item.input_variable_name} />

                    </FormItem>

                </Col>)
            }
            else if (item.input_type === 'content') {

                fItems.push(<Col className='gutter-row' xs={24} xl={24}>
                    <FormItem
                        label={item.input_variable_name}
                        name={['variables', item.input_variable_name]}
                        rules={[{ required: true, message: 'Please Enter' }]}
                    >
                        <Input.TextArea rows={5} />

                    </FormItem>

                </Col>)
            }
            else if (item.input_type === 'array') {
                fItems.push(<Col className='gutter-row' xs={24} xl={24}>
                    <FormItem
                        label={item.input_variable_name}
                        name={['variables', item.input_variable_name]}
                        rules={[{ required: true, message: 'Please Enter' }]}
                    >
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                            //onChange={handleChange}
                            tokenSeparators={[',']}
                        >

                        </Select>
                    </FormItem>

                </Col>)
            }
            else if (item.input_type === 'table-data-or-objects-array') {
                var tableHeadingThs = [];
                var tableTrs = [];
                if (item.object_variables) {

                    item.object_variables.split(",").forEach((obj) => {
                        tableHeadingThs.push(<th style={cellStyle}>{obj}</th>)
                    })

                    var curTableRow = dynTableRows.find(d => d.variableName === item.input_variable_name);
                    if (curTableRow) {
                        for (var ii = 0; ii < parseInt(curTableRow.rowCount); ii = ii + 1) {
                            var RowTds = [];
                            item.object_variables.split(",").forEach((obj) => {
                                // Create a new scope with a closure that captures the current value of ii
                                (function (ii) {
                                    RowTds.push(
                                        <td style={cellStyle}>
                                            <FormItem
                                                name={['variables', item.input_variable_name, ii, obj]}
                                                noStyle
                                            >
                                                <Input onChange={(e) => onTableInputChange(item.input_variable_name, ii, e.target.value, ii)} />
                                            </FormItem>
                                        </td>
                                    )
                                })(ii); // Pass in the current value of ii as an argument to the closure
                            })
                            tableTrs.push(<tr>{RowTds}</tr>)
                        }
                    }

                }

                fItems.push(<Col className='gutter-row' xs={24} xl={24}>
                    <table border="1" cellpadding="3" style={{ borderCollapse: 'collapse' }}>
                        <tr>
                            <th style={{ textAlign: 'center' }} colSpan={item.object_variables.split(",").length}><span style={{ color: 'blue' }}>{item.input_variable_name}</span></th>
                        </tr>
                        <tr>
                            {tableHeadingThs}

                        </tr>
                        {tableTrs}

                    </table><br />
                </Col>)
            }
            else if (item.input_type === 'project') {

                fItems.push(<Col className='gutter-row' xs={24} xl={24}>
                    <FormItem
                        label={item.input_variable_name}
                        name={['variables', item.input_variable_name]}
                        rules={[{ required: true, message: 'Please Enter' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Category"

                            optionFilterProp="children"
                            //onChange={categoryOnChange}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {
                                projects.map(projItem => <Select.Option value={projItem.id}>{projItem.project_name}</Select.Option>)
                            }
                        </Select>

                    </FormItem>

                </Col>)
            }
            else if (item.input_type === 'database-query') {

                fItems.push(<Col className='gutter-row' xs={24} xl={24}>
                    <FormItem
                       // label={item.input_variable_name}
                        name={['variables', item.input_variable_name]}
                        rules={[{ required: true, message: 'Please Enter' }]}
                    >
                         <Editor height="200px" language="mysql" 
                            //onChange={handleEditorChange}
                            
                            theme="vs-dark" options={QueryEditorOptions}/>

                    </FormItem>

                </Col>)
            }

        });
        return <Row gutter={16}>{fItems}</Row>
    }
    const onFinishRender = (values) => {

        var finalValues = values.variables;
        for (let prop in finalValues) {
            if (Array.isArray(finalValues[prop])) {
                finalValues[prop] = finalValues[prop].filter((item) => {
                    let keys = Object.keys(item);
                    if (keys.length > 0 && (item[keys[0]] === '' || item[keys[0]] === null || item[keys[0]] === undefined)) {

                        return false;
                    }
                    return true;
                });
            }
        }
        var rFunction = getTemplateFunctionNames.find(item => item.function_name === selTemplate.render_function)
        var result = null;

        if (rFunction) {
            result = rFunction.function(finalValues, selTemplate);
        }
        //const compiledTemplate = Handlebars.compile(selTemplate.template);
        // const renderedTemplate = compiledTemplate(finalValues);
        setRenderedOutput(result);
        setVisibleModal(true);
        setOutputLoader()

    }

    return (

        <> <ResponsiveLayout

            userId={userId}
            customHeader={null}
            bottomMenues={null}
            breadcrumbs={[
                { name: 'Tools', link: null },
                { name: 'Template Engine', link: null },
            ]}
        >

            <Spin spinning={loader} >

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
                            <Input.Search
                                placeholder="Search"
                                allowClear
                                enterButton
                                size="middle"
                                onSearch={onSearchTemplates}
                            />

                        </Card>
                        <Menu
                            mode="inline"
                            theme="light"
                            onClick={onMenuClick}
                            // defaultSelectedKeys={[selCollection]}
                            style={{
                                width: '100%',
                                border: '1px solid',
                                borderColor: cyan[2],
                                borderTop: '0',
                            }}
                            items={menuItems}
                        />
                    </Col>

                    <Col className='gutter-row' span={18}>
                        {
                            selTemplate && (<>
                                <Card
                                    title={<>{selTemplate.template_title} <span style={{ color: cyan[7] }}>({selTemplate.string_id})</span></>}
                                //  extra={<Button type="primary" onClick={() => onRenderClick(selTemplate)}>Render</Button>}

                                >
                                    <Form
                                        name="basic"
                                        form={addForm}
                                        labelAlign="left"
                                        labelCol={context.isMobile ? null : { span: 8 }}
                                        wrapperCol={context.isMobile ? null : { span: 20 }}
                                        initialValues={{ remember: true }}
                                        onFinish={onFinishRender}
                                        autoComplete="off"
                                        layout={context.isMobile ? "vertical" : 'horizontal'}
                                    >
                                        {getInputFormControls()}
                                        <FormItem wrapperCol={context.isMobile ? null : { offset: 10, span: 24 }}
                                        >
                                            {
                                                !context.isMobile && (
                                                    <Space>
                                                        <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                                            Render Now
                                                        </MyButton>
                                                    </Space>

                                                )
                                            }
                                            {
                                                context.isMobile && (<Row gutter={2}>

                                                    <Col span={24}>
                                                        <MButton block type='submit' color='primary' size='small'>
                                                            Render Now
                                                        </MButton>
                                                    </Col>
                                                </Row>)
                                            }

                                        </FormItem>

                                    </Form>



                                </Card>
                            </>)
                        }

                    </Col>
                </Row>


            </Spin>
        </ResponsiveLayout>
            <Modal
                open={visibleModal}
                zIndex={999}
                footer={null}
                closeIcon={<MyButton type="outlined" shape="circle" ><FontAwesomeIcon icon={faClose} /></MyButton>}
                centered={false}
                closable={true}
                width={1000}
                onCancel={() => { setVisibleModal(false) }}
                title={"Output"}
            >
                {
                    renderedOutput && selTemplate && selTemplate.output_type === 'code-block' && (<>
                        <Editor height="400px" language="javascript" value={renderedOutput}
                            //onChange={handleEditorChange}
                            theme="vs-dark" />

                    </>)
                }
                {
                    renderedOutput && selTemplate && selTemplate.output_type === 'array-or-table-data' && (<>
                        <TableOutput userId={userId} tableData={renderedOutput} />
                    </>)
                }

            </Modal>
        </>
    );

}
export default TemplateEngine;