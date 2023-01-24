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
import { Button as MButton } from 'antd-mobile'
const AddEditJewelProduct = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormProducts] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Product');
    const { editIdOrObject, onListClick, onSaveFinish, userId,formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    useEffect(() => {

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
        }

    }, [editIdOrObject]);
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
    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormProducts}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout==='two-column' || formItemLayout==='one-column'?8:24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>

                                <FormItem
                                    label="Product Code"
                                    name={['products', 'product_code']}
                                    rules={[{ required: true, message: 'Please Enter Product Code' }]}
                                >
                                    <Input placeholder="Product Code" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>

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
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>

                                <FormItem
                                    label="Product Name"
                                    name={['products', 'product_name']}
                                    rules={[{ required: true, message: 'Please Enter Product Name' }]}
                                >
                                    <Input placeholder="Product Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>

                                <FormItem
                                    label="Weight"
                                    name={['products', 'weight']}
                                    rules={[{ required: true, message: 'Please Enter Weight' }]}
                                >
                                    <InputNumber placeholder="Weight" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout==='one-column'?24:12}>

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
export default AddEditJewelProduct;