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
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
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

                unit: mydata.unit,
                product_type: mydata.product_type,
                product_category: mydata.product_category,
                product_brand: mydata.product_brand,

                product_name: mydata.product_name,

                stock: mydata.stock,
                cost_price: mydata.cost_price,
                selling_price: mydata.selling_price,
                offer_price: mydata.offer_price,
                product_image: mydata.product_image,

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
            var form = new FormData();
            Object.entries(processedValues).forEach(([key, value], index) => {
                form.append(key, value)
            })
            context.psGlobal.apiRequest('admin/products/save', context.adminUser(userId).mode,form).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();
                //navigate('/' + userId + '/admin/courses');
            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            
            var formedit = new FormData();
            formedit.append('id', editData.id);
            Object.entries(processedValues).forEach(([key, value], index) => {
                formedit.append(key, value)
            })
            if (processedValues['product_image'] !== editData.product_image) {
                if (editData.bill_image)
                    formedit.append('old_product_image', editData.product_image);
            }
            else {
                formedit.delete('product_image');
            }

            context.psGlobal.apiRequest('admin/products/update', context.adminUser(userId).mode,formedit).then((res) => {
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
                                    label="Unit"
                                    name={['products', 'unit']}
                                    rules={[{ required: true, message: 'Please Enter Unit' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Unit"

                                        optionFilterProp="children"
                                        //onChange={metalTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'units')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Type"
                                    name={['products', 'product_type']}
                                    rules={[{ required: true, message: 'Please Select Type' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="type"

                                        optionFilterProp="children"
                                        //onChange={metalTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'product-type')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Collection Category"
                                    name={['products', 'product_category']}
                                    rules={[{ required: true, message: 'Please Select Category' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="category"

                                        optionFilterProp="children"
                                        //onChange={metalTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'product-category')}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Brand"
                                    name={['products', 'product_brand']}
                                    rules={[{ required: true, message: 'Please Select Brand' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="brand"

                                        optionFilterProp="children"
                                        //onChange={metalTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'product-brand')}
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
                                    label="Opening Stock"
                                    name={['products', 'stock']}
                                    rules={[{ required: true, message: 'Please Enter Stock' }]}
                                >
                                    <InputNumber placeholder="Stock" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Cost Price"
                                    name={['products', 'cost_price']}
                                    rules={[{ required: true, message: 'Please Enter Cost' }]}
                                >
                                    <InputNumber placeholder="Cost Price" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Selling Price"
                                    name={['products', 'selling_price']}
                                    rules={[{ required: true, message: 'Please Enter Selling Price' }]}
                                >
                                    <InputNumber placeholder="Selling Price" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Offer Price"
                                    name={['products', 'offer_price']}
                                    rules={[{ required: true, message: 'Please Enter Offer Price' }]}
                                >
                                    <InputNumber placeholder="Offer Price" type="number" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Product Image"
                                    name={['products', 'product_image']}
                                    rules={[{ required: true, message: 'Please Select Bill Image' }]}
                                >
                                    <ImageUpload
                                        cropRatio="1/1"
                                        defaultImage={editData && editData.product_image ? 'cloud-file/' + encodeURIComponent(encodeURIComponent(editData.product_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => {addeditFormProducts.setFieldsValue({ products: { product_image: fileName } }) }}
                                    />
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
export default AddEditJewelProduct;