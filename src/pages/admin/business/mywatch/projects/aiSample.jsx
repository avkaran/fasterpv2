import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
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

const AiSample = (props) => {
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
        var data = [
            {
                text: "This is the first sentence",
                label: 0
            },
            {
                text: "This is the second sentence",
                label: 1
            }
        ];

        // Convert text data into numerical data
        var texts = data.map((d) => d.text);
        var tokenizer = new Tokenizer();
        tokenizer.fitOnTexts(texts);
        var sequences = tokenizer.textsToSequences(texts);
        //var paddedSequences = padSequences(sequences, { maxlen: 4 });
        var paddedSequences = sequences.map(function (e) {
            const max_length = 4;
            const row_length = e.length
            if (row_length > max_length) { // truncate
                return e.slice(row_length - max_length, row_length)
            }
            else if (row_length < max_length) { // pad
                return Array(max_length - row_length).fill(0).concat(e);
            }
            return e;
        });

        // Convert label data into numerical data
        var labels = data.map((d) => d.label);
        var numLabels = Array.from(new Set(labels)).length;
        var labelTensors = tf.oneHot(tf.tensor1d(labels, "int32"), numLabels);

        // Convert data into tensors
        var textTensor = tf.tensor2d(paddedSequences);
        var labelTensor = labelTensors;

        // Print the shape of the tensors
        console.log(textTensor.shape); // [2, 4]
        console.log(labelTensor.shape); // [2, 2] */
        /*
        Here, we're using the Tokenizer class from TensorFlow.js to convert our text data into numerical data. The Tokenizer class fits on the texts, converts the texts into sequences of numbers, and pads the sequences to a fixed length. We're also using the tf.oneHot method to convert our label data into numerical data.
        
        Finally, we're converting our preprocessed data into tensors using the tf.tensor2d and tf.tensor1d methods. The shape of the text tensor is [2, 5] because we have two sentences, and the maximum length of any sentence is 5 after padding. The shape of the label tensor is [2, 2] because we have two labels, and we've converted them into one-hot encoded vectors of length 2.
        */
        // Define the model architecture
        var model = tf.sequential();
        model.add(tf.layers.embedding({ inputDim: Object.keys(tokenizer.word_index).length, outputDim: 16, inputLength: textTensor.shape[1] }));
        model.add(tf.layers.flatten());
        model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
        model.add(tf.layers.dense({ units: numLabels, activation: 'softmax' }));

        // Compile the model
        model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

        // Train the model
        model.fit(textTensor, labelTensor, { epochs: 10 }).then(history => {
            console.log(history.history);
        });


        // Define some new text to predict
var newText = ['This is a new sentence', 'Another sentence'];

// Convert the new text into numerical data
var newSequences = tokenizer.textsToSequences(newText);

var newPaddedSequences = newSequences.map(function (e) {
    const max_length = 4;
    const row_length = e.length
    if (row_length > max_length) { // truncate
        return e.slice(row_length - max_length, row_length)
    }
    else if (row_length < max_length) { // pad
        return Array(max_length - row_length).fill(0).concat(e);
    }
    return e;
});


// Convert the new data into a tensor
var newTextTensor = tf.tensor2d(newPaddedSequences);

// Make predictions using the model
var predictions = model.predict(newTextTensor);

// Print the predictions
predictions.array().then((result) => {
  console.log('result',result);
});


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
export default AiSample;