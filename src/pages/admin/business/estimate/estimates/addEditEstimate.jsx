import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import './rowInputStyles.css'
const AddEditEstimate = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormProducts] = Form.useForm();
    const [newEstimateForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Product');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [products, setProducts] = useState([]);
    const [metalRates, setMetalRates] = useState([])
    useEffect(() => {
        loadProducts();
        if (editIdOrObject) {
            if (typeof editIdOrObject === 'object') {
                setCurAction("edit");
                setEditId(editIdOrObject.id);
                setEditData(editIdOrObject);
                setEditValues(editIdOrObject);

            } else {
                setCurAction("edit");
                setEditId(editIdOrObject)
                loadEditData(editIdOrObject);
            }


        } else {
            setCurAction("add");
            addeditFormProducts.setFieldsValue(
                { products: { active_status: '1' } }
            )
            addRowData();

        }

    }, [editIdOrObject]);
    useEffect(() => {
        loadProducts();
        loadMetalRates();
    }, []);
    const addRowData = () => {
        var curRowsLength = rowData.length;
        var tmpRowData = rowData;
        tmpRowData.push({
            name: "product_" + curRowsLength,
            product_id: null,
            product_code: null,
            product_name: null,
            metal_type: null,
            weight: 0.000,
            rate_per: 0.00,
        })
        setRowData(tmpRowData);
    }
    const loadProducts = () => {
        var reqData = {
            query_type: 'query',
            query: "SELECT * from products where status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setProducts(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadMetalRates = () => {

        var reqData = {
            query_type: 'query',
            query: "select * from today_rates order by id"
        }
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setMetalRates(res);

        }).catch(err => {
            message.error(err);

        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from products where status=1 and id=" + id
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setEditData(res[0]);
            setEditValues(res[0]);

            setLoader(false);

        }).catch(err => {
            message.error(err);
            setLoader(false);

        })
    }
    const setEditValues = (mydata) => {
        addeditFormProducts.setFieldsValue({

            products: {
                product_code: mydata.product_code,

                metal_type: mydata.metal_type,

                product_name: mydata.product_name,

                weight: mydata.weight,

                active_status: mydata.active_status.toString(),
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.products).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });


        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'products',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'products',
                where: { id: editId },
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataUpdate, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Saved Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        }

    };
    const onFinishTest = (values) => {
        console.log('inputs', values)
    }
    const onProductChange = (row, rowIndex, value) => {
        var tmpRowData = rowData;
        var selProduct = products.find(item => item.id === value);
        if (selProduct) {
            var curRow = row;
            curRow.product_id = selProduct.id
            curRow.product_code = selProduct.product_code
            curRow.product_name = selProduct.product_name
            curRow.metal_type = selProduct.metal_type
            curRow.weight = selProduct.weight.toFixed(3)
            curRow.rate_per = selProduct.metal_type === 'Gold' ? metalRates[0].rate.toFixed(2) : metalRates[1].rate.toFixed(2);

            newEstimateForm.setFieldsValue({
                weight: { [rowIndex]: selProduct.weight.toFixed(3) },
                rate_per: { [rowIndex]:selProduct.metal_type === 'Gold' ? metalRates[0].rate.toFixed(2) : metalRates[1].rate.toFixed(2) },
                
            })

            tmpRowData[rowIndex] = curRow;
        }

        setRowData(tmpRowData);
        console.log('test', tmpRowData)
    }
    return (
        <>
            <Form
                name="estimates"
                form={newEstimateForm}
                labelAlign="left"
                labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinishTest}
                autoComplete="off"
            >
                <Row gutter={0} style={{ background: cyan[4] }}>
                    <Col span={4}>
                        Product
                    </Col>
                    <Col span={4}>
                        Weight
                    </Col>
                    <Col span={4}>
                        Rate Per
                    </Col>
                    <Col span={4}>
                        Total Rate
                    </Col>
                    <Col span={4}>
                        Amount
                    </Col>

                    <Col span={4}>
                    </Col>

                </Row>
                {
                    rowData.map((row, index) => {
                        return <Row gutter={0} style={{ borderBottom: '1px solid blue' }}>
                            <Col span={4} >
                                <FormItem
                                    // label="Product Code"
                                    name={['product', index]}
                                    rules={[{ required: true, message: 'product?' }]}
                                    noStyle
                                >
                                    <Select
                                        showSearch
                                        placeholder="Product"

                                        optionFilterProp="children"
                                        onChange={(value) => onProductChange(row, index, value)}
                                        //filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                        style={{ width: '100%' }}
                                    >
                                        {
                                            products.map(item => {
                                                return <Select.Option value={item.id}>{item.product_code}-{item.product_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    // label="Product Code"
                                    name={['weight', index]}
                                    rules={[{ required: true, message: 'weight?' }]}
                                    noStyle
                                >

                                    <Input placeholder='weight' style={{ borderRadius: '0px' }} />
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    // label="Product Code"
                                    name={['rate_per', index]}
                                    rules={[{ required: true, message: 'rate_per?' }]}
                                    noStyle
                                >
                                    <Input placeholder='rate per' style={{ borderRadius: '0px' }} />
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    // label="Product Code"
                                    name={['total_rate', index]}
                                    rules={[{ required: true, message: 'total rate?' }]}
                                    noStyle
                                >
                                    <Input placeholder='total rate' style={{ borderRadius: '0px' }} />
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem
                                    // label="Product Code"
                                    name={['amount', index]}
                                    rules={[{ required: true, message: 'amount?' }]}
                                    noStyle
                                >
                                    <Input placeholder='amount' style={{ borderRadius: '0px' }} />
                                </FormItem>
                            </Col>

                            <Col span={4}>Delete

                            </Col>
                        </Row>

                    })
                }
                <FormItem wrapperCol={{ offset: 8, span: 24 }}
                >


                    <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                        Save Estimate
                    </MyButton>

                </FormItem>
            </Form>
            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormProducts}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Product Code"
                                    name={['products', 'product_code']}
                                    rules={[{ required: true, message: 'Please Enter Product Code' }]}
                                >
                                    <Input placeholder="Product Code" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Metal Type"
                                    name={['products', 'metal_type']}
                                    rules={[{ required: true, message: 'Please Enter Metal Type' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Metal Type"

                                        optionFilterProp="children"
                                        //onChange={metalTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'metal-types')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Product Name"
                                    name={['products', 'product_name']}
                                    rules={[{ required: true, message: 'Please Enter Product Name' }]}
                                >
                                    <Input placeholder="Product Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Weight"
                                    name={['products', 'weight']}
                                    rules={[{ required: true, message: 'Please Enter Weight' }]}
                                >
                                    <InputNumber placeholder="Weight" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Active Status"
                                    name={['products', 'active_status']}
                                    rules={[{ required: true, message: 'Please Enter Active Status' }]}
                                >
                                    <Radio.Group defaultValue="1" optionType="default" >
                                        <Radio.Button value="1">Active</Radio.Button>
                                        <Radio.Button value="0">Inactive</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                        </Row>


                        <FormItem wrapperCol={context.isMobile ? null : { offset: 8, span: 24 }}
                        >
                            {
                                !context.isMobile && (
                                    <Space>
                                        <MyButton size="large" type="outlined" style={{}} onClick={onListClick}>
                                            Cancel
                                        </MyButton>
                                        <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MyButton>
                                    </Space>

                                )
                            }
                            {
                                context.isMobile && (<Row gutter={2}>
                                    <Col span={12}>
                                        <MButton block color='primary' size='small' fill='outline' onClick={onListClick}>
                                            Cancel
                                        </MButton>
                                    </Col>
                                    <Col span={12}>
                                        <MButton block type='submit' color='primary' size='small'>
                                            {curAction === "edit" ? "Update" : "Submit"}
                                        </MButton>
                                    </Col>
                                </Row>)
                            }

                        </FormItem>


                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditEstimate;