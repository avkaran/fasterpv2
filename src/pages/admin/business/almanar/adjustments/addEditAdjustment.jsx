import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox, DatePicker } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { green, blue, red, cyan, grey } from '@ant-design/colors';
import { ImageUpload, FormItem, MyButton } from '../../../../../comp';
import { capitalizeFirst } from '../../../../../utils';
import { Button as MButton } from 'antd-mobile'
import dayjs from 'dayjs'
//import esES from 'antd/lib/locale-provider/es_ES';
const AddEditAdjustment = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormAdjustments] = Form.useForm();
    const [newAdjustmentForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Adjustment');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout, ...other } = props;
    const [editId, setEditId] = useState(null);
    const [products, setProducts] = useState([])
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
            addeditFormAdjustments.setFieldsValue(
                { adjustments: { active_status: '1', date: dayjs() } }
            )


        }

    }, [editIdOrObject]);
    useEffect(() => {
        loadProducts();
    }, [])
    const loadProducts = () => {

        var reqData = {
            query_type: 'query',
            query: "select p.*,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Purchase' and status=1) as purchase,(select coalesce(sum(qty),0) from adjustments where product_id=p.id and adjustment_type='Sales' and status=1) as sales from products p where p.active_status=1 and p.status=1"
        };
        context.psGlobal.apiRequest(reqData, context.adminUser(userId).mode).then((res) => {
            setProducts(res);
        }).catch(err => {
            message.error(err);
        })
    }
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "SELECT * from adjustments where status=1 and id=" + id
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
    const getStock = (id) => {
        var item = products.find(item => parseInt(item.id) === parseInt(id));
        var stock = 0;
        if (item)
            stock = parseFloat(item.stock) + parseFloat(item.purchase) - parseFloat(item.sales)
console.log('stock',stock)
        return stock;

    }
    const setEditValues = (mydata) => {
        addeditFormAdjustments.setFieldsValue({

            adjustments: {
                adjustment_type: mydata.adjustment_type,

                date: dayjs(mydata.date),

                product_id: mydata.product_id,

                qty: mydata.qty,

                cost_per: mydata.cost_per,

                narration: mydata.narration,
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.adjustments).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });

        processedValues['date'] = dayjs(values.adjustments.date).format("YYYY-MM-DD HH:mm:ss")
        processedValues['total_cost'] = parseFloat(values.adjustments.qty) * parseFloat(values.adjustments.cost_per)
        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'adjustments',
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
                table: 'adjustments',
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
    const productIdOnChange=(value)=>{
        if(curAction==="add"){
            var curProduct=products.find(item=>parseInt(item.id)===parseInt(value))
            if(curProduct)
            addeditFormAdjustments.setFieldsValue({adjustments:{cost_per:curProduct.selling_price}})
        }
    }

    return (
        <>

            <Spin spinning={loader} >
                {
                    (curAction === "add" || (curAction === "edit" && editData)) && (<Form
                        name="basic"
                        form={addeditFormAdjustments}
                        labelAlign="left"
                        labelCol={{ span: formItemLayout === 'two-column' || formItemLayout === 'one-column' ? 8 : 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Adjustment Type"
                                    name={['adjustments', 'adjustment_type']}
                                    rules={[{ required: true, message: 'Please Enter Adjustment Type' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Adjustment Type"

                                        optionFilterProp="children"
                                        //onChange={adjustmentTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'adjustment-types')}
                                    </Select>
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Date"
                                    name={['adjustments', 'date']}
                                    rules={[{ required: true, message: 'Please Enter Date' }]}
                                >

                                    <DatePicker //onChange={receivedDateOnChange} 
                                        format='DD/MM/YYYY'
                                        //  defaltValue={dayjs()}
                                       // locale={esES}

                                        //disabledDate={receivedDateDisabled}
                                        allowClear={false}
                                    />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Product"
                                    name={['adjustments', 'product_id']}
                                    rules={[{ required: true, message: 'Please EnterProduct' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Product "

                                        optionFilterProp="children"
                                        onChange={productIdOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {products.map(item => {
                                            return <Select.Option value={item.id}>{item.product_name}</Select.Option>
                                        })}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Narration"
                                    name={['adjustments', 'narration']}
                                // rules={[{ required: true, message: 'Please Enter Narration' }]}
                                >
                                    <Input.TextArea rows={1} />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Qty"
                                    name={['adjustments', 'qty']}
                                    rules={[
                                        { required: true, message: 'Please Enter Qty' }
                                        ,
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (getFieldValue(["adjustments", "product_id"]) && getStock(getFieldValue(["adjustments", "product_id"])) < parseFloat(value) && curAction === 'add' && getFieldValue(["adjustments", "adjustment_type"]) === 'Sales') {
                                                    return Promise.reject(new Error('No Such Stock'))
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <InputNumber placeholder="Qty" type="number" />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Cost Per"
                                    name={['adjustments', 'cost_per']}
                                    rules={[{ required: true, message: 'Please Enter Cost Per' }]}
                                >
                                    <InputNumber placeholder="Cost Per" type="number" />
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
export default AddEditAdjustment;