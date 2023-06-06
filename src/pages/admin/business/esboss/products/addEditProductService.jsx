import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { green, red, cyan, grey } from '@ant-design/colors';
const AddEditPackage = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Package');
    const { editIdOrObject, onListClick, onSaveFinish, userId, businessType, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([])
    useEffect(() => {
        loadCategories();
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
            addForm.setFieldsValue({ products: { product_status: 'Active' } })
        }

    }, [editIdOrObject]);
    useEffect(() => {
        loadCategories();
    }, [businessType]); 
    const loadCategories = () => {

        var reqData = {
            query_type: 'query',
            query: "select * from product_categories where status=1 and type='" + businessType + "'"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setCategories(res);
            //addForm.setFieldsValue({products:{category:editData.category}})

        }).catch(err => {
            message.error(err);


        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from products where status=1 and id=" + id
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

        addForm.setFieldsValue({

            products: {
                category: mydata.category,

                product_name: mydata.product_name,

                unit_name: mydata.unit_name,

                cgst: mydata.cgst,

                sgst: mydata.sgst,

                company_profit_percentage: mydata.company_profit_percentage,

                delivery_boy_incentive_percentage: mydata.delivery_boy_incentive_percentage,

                agency_profit_percentage: mydata.agency_profit_percentage,

                delivery_charge: mydata.delivery_charge,

                description: mydata.description,

                product_status: mydata.product_status,
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
            processedValues['type'] = businessType;
            var reqDataInsert = {
                query_type: 'insert',
                table: 'products',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                var createdId = res;
                var productCode = (businessType === 'product' ? 'EP' : 'ES') + createdId.padStart(4, '0');


                var reqDataInner = {
                    query_type: 'update',
                    table: 'products',
                    where: { id: createdId },
                    values: { product_code: productCode }

                }
                context.psGlobal.apiRequest(reqDataInner, context.adminUser(userId).mode).then((resInner) => {
                    setLoader(false);
                    message.success(businessType + ' Added Successfullly');
                    onSaveFinish();
                }).catch(err => {
                    message.error(err);
                    setLoader(false);
                })


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
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addForm}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Category"
                                    name={['products', 'category']}
                                    rules={[{ required: true, message: 'Please Enter Category' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Category"

                                        optionFilterProp="children"
                                        //onChange={categoryOnChange}
                                       // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {
                                            categories.map(item => {
                                                return <Select.Option value={item.id}>{item.category_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label={businessType + " Name"}
                                    name={['products', 'product_name']}
                                    rules={[{ required: true, message: 'Please Enter Product Name' }]}
                                >
                                    <Input placeholder="Product Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Unit Name"
                                    name={['products', 'unit_name']}
                                    rules={[{ required: true, message: 'Please Enter Unit Name' }]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Unit"

                                        optionFilterProp="children"
                                        //onChange={productStatusOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'product-units')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Cgst"
                                    name={['products', 'cgst']}
                                    rules={[{ required: true, message: 'Please Enter Cgst' }]}
                                >
                                    <InputNumber placeholder="Cgst" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Sgst"
                                    name={['products', 'sgst']}
                                    rules={[{ required: true, message: 'Please Enter Sgst' }]}
                                >
                                    <InputNumber placeholder="Sgst" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Company Profit"
                                    name={['products', 'company_profit_percentage']}
                                    rules={[{ required: true, message: 'Please Enter Company Profit Percentage' }]}
                                    tooltip={{ title: "Company Profit Percentage", color: cyan[6], icon: <FontAwesomeIcon icon={faCircleQuestion} style={{ color: cyan[6] }} /> }}
                                >
                                    <InputNumber placeholder="Company Profit" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Delivery Incentive"
                                    name={['products', 'delivery_boy_incentive_percentage']}
                                    rules={[{ required: true, message: 'Please Enter Delivery Boy Incentive Percentage' }]}
                                    tooltip={{ title: "Delivery boy incentive in percentage", color: cyan[6], icon: <FontAwesomeIcon icon={faCircleQuestion} style={{ color: cyan[6] }} /> }}
                                >
                                    <InputNumber placeholder="Delivery Incentive" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Agency Profit"
                                    name={['products', 'agency_profit_percentage']}
                                    rules={[{ required: true, message: 'Please Enter Agency Profit Percentage' }]}
                                    tooltip={{ title: "Agency Profit in percentage", color: cyan[6], icon: <FontAwesomeIcon icon={faCircleQuestion} style={{ color: cyan[6] }} /> }}
                                >
                                    <InputNumber placeholder="Agency Profit" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Delivery Charge"
                                    name={['products', 'delivery_charge']}
                                    rules={[{ required: true, message: 'Please Enter Delivery Charge' }]}
                                >
                                    <InputNumber placeholder="Delivery Charge" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Description"
                                    name={['products', 'description']}
                                    rules={[{ required: true, message: 'Please Enter Description' }]}
                                >
                                    <Input.TextArea rows={3} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Product Status"
                                    name={['products', 'product_status']}
                                    rules={[{ required: true, message: 'Please Enter Product Status' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Product Status"

                                        optionFilterProp="children"
                                        //onChange={productStatusOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive')}
                                    </Select>
                                </FormItem>

                            </Col>
                        </Row>

                        <FormItem wrapperCol={{ offset: 10, span: 24 }}>
                            <Space>
                                <Button size="large" type="outlined" style={{}} onClick={onListClick}>
                                    Cancel
                                </Button>
                                <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                    {curAction === "edit" ? "Update" : "Submit"}
                                </MyButton>
                            </Space>

                        </FormItem>

                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditPackage;