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
    const [heading] = useState('Dispute');
    const { editIdOrObject, onListClick, onSaveFinish, userId, formItemLayout,isMydisputes, ...other } = props;
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
                { disputes: { active_status: '1', date: dayjs() } }
            )


        }

    }, [editIdOrObject]);
    useEffect(() => {
        loadProducts();
    }, [])
    const loadProducts = () => {

        var reqData = {
            query_type: 'query',
            query: isMydisputes?"select p.* from bills p where p.active_status=1 and p.status=1 and p.employee_id="+context.adminUser(userId).ref_id:"select p.* from bills p where p.active_status=1 and p.status=1"
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
            query: "SELECT * from disputes where status=1 and id=" + id
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
        addeditFormAdjustments.setFieldsValue({

            disputes: {
                dispute_type: mydata.dispute_type,
                date: dayjs(mydata.date),
                bill_id: mydata.bill_id,
                dispute_image: mydata.dispute_image,
                narration: mydata.narration,
                active_status: mydata.active_status.toString(),
            }
        });
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.disputes).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });

        processedValues['date'] = dayjs(values.disputes.date).format("YYYY-MM-DD HH:mm:ss")
      
        if (curAction === "add") {
            var form = new FormData();
            Object.entries(processedValues).forEach(([key, value], index) => {
                form.append(key, value)
            })
            context.psGlobal.apiRequest('admin/disputes/save', context.adminUser(userId).mode,form).then((res) => {
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

            if (processedValues['dispute_image'] !== editData.dispute_image) {
                if (editData.bill_image)
                    formedit.append('old_dispute_image', editData.dispute_image);
            }
            else {
                formedit.delete('dispute_image');
            }
            context.psGlobal.apiRequest('admin/disputes/update', context.adminUser(userId).mode, formedit).then((res) => {
               
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
    const productIdOnChange = (value) => {
        if (curAction === "add") {
            var curProduct = products.find(item => parseInt(item.id) === parseInt(value))
            if (curProduct)
                addeditFormAdjustments.setFieldsValue({ adjustments: { cost_per: curProduct.selling_price } })
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
                                    label="Dispute Type"
                                    name={['disputes', 'dispute_type']}
                                    rules={[{ required: true, message: 'Please Enter Adjustment Type' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Dispute Type"

                                        optionFilterProp="children"
                                        //onChange={adjustmentTypeOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'dispute-types')}
                                    </Select>
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Date"
                                    name={['disputes', 'date']}
                                    rules={[{ required: true, message: 'Please Enter Date' }]}
                                >

                                    <DatePicker //onChange={receivedDateOnChange} 
                                        format='DD/MM/YYYY'
                                        //  defaltValue={dayjs()}
                                        //locale={esES}

                                        //disabledDate={receivedDateDisabled}
                                        allowClear={false}
                                    />
                                </FormItem>

                            </Col>

                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Bill"
                                    name={['disputes', 'bill_id']}
                                    rules={[{ required: true, message: 'Please EnterProduct' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Bill No "

                                        optionFilterProp="children"
                                        onChange={productIdOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {products.map(item => {
                                            return <Select.Option value={item.id}>{item.bill_no}</Select.Option>
                                        })}
                                    </Select>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Dispute Image"
                                    name={['disputes', 'dispute_image']}
                                    rules={[{ required: true, message: 'Please Enter Cost' }]}
                                >
                                    <ImageUpload
                                        // cropRatio="4/3"
                                        defaultImage={editData && editData.dispute_image ? 'cloud-file/' + encodeURIComponent(encodeURIComponent(editData.dispute_image)) : null}
                                        storeFileName={'public/uploads/' + new Date().valueOf() + '.jpg'}
                                        onFinish={(fileName) => { addeditFormAdjustments.setFieldsValue({ disputes: { dispute_image: fileName } }) }}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Active Status"
                                    name={['disputes', 'active_status']}
                                    rules={[{ required: true, message: 'Please Enter Active Status' }]}
                                >
                                    <Radio.Group defaultValue="1" optionType="default" >
                                        <Radio.Button value="1">Active</Radio.Button>
                                        <Radio.Button value="0">Inactive</Radio.Button>
                                    </Radio.Group>
                                </FormItem>
                            </Col>
                            <Col className='gutter-row' xs={24} xl={formItemLayout === 'one-column' ? 24 : 12}>

                                <FormItem
                                    label="Narration"
                                    name={['disputes', 'narration']}
                                 rules={[{ required: true, message: 'Please Enter Narration' }]}
                                >
                                    <Input.TextArea rows={3} />
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