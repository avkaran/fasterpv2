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
const AddEditProject = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addForm] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Project');
    const { editIdOrObject, onListClick, onSaveFinish, userId, ...other } = props;
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
            addForm.setFieldsValue({ category: 'Plan', project_for: 'Customer(Online)', project_status: 'Active' })
        }

    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from projects where status=1 and id=" + id
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
        mydata.is_send_sms = parseInt(mydata.is_send_sms) === 1 ? true : false;
        mydata.is_send_whatsapp = parseInt(mydata.is_send_whatsapp) === 1 ? true : false;
        mydata.is_vip = parseInt(mydata.is_vip) === 1 ? true : false;
        addForm.setFieldsValue({
            plan_name: mydata.plan_name,
            daily_limit: mydata.daily_limit,
            monthly_limit: mydata.monthly_limit,
            validity_months: mydata.validity_months,
            category: mydata.category,
            project_price: mydata.project_price,
            consume_credits: mydata.consume_credits,
            project_for: mydata.project_for,
            is_send_sms: mydata.is_send_sms,
            is_send_whatsapp: mydata.is_send_whatsapp,
            is_vip: mydata.is_vip,
            project_status: mydata.project_status
        })
    }
    const onFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });
        processedValues.is_send_sms = processedValues.is_send_sms ? 1 : 0;
        processedValues.is_send_whatsapp = processedValues.is_send_whatsapp ? 1 : 0;
        processedValues.is_vip = processedValues.is_vip ? 1 : 0;

        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'projects',
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
                table: 'projects',
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
                                    label="Plan Name"
                                    name="plan_name"
                                    rules={[{ required: true, message: 'Please Enter Plan Name' }]}
                                >
                                    <Input placeholder="Plan Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Daily Limit"
                                    name="daily_limit"
                                    rules={[{ required: true, message: 'Please Enter Daily Limit' }]}
                                >
                                    <InputNumber placeholder="Daily Limit" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Monthly Limit"
                                    name="monthly_limit"
                                    rules={[{ required: true, message: 'Please Enter Monthly Limit' }]}
                                >
                                    <InputNumber placeholder="Monthly Limit" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Validity Months"
                                    name="validity_months"
                                    rules={[{ required: true, message: 'Please Enter Validity Months' }]}
                                >
                                    <InputNumber placeholder="Validity Months" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Category"
                                    name="category"
                                    rules={[{ required: true, message: 'Please Enter Category' }]}
                                >
                                    <Radio.Group defaultValue="Plan" optionType="default" >

                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'project-category', 'radio')}
                                    </Radio.Group>
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Project Price"
                                    name="project_price"
                                    rules={[{ required: true, message: 'Please Enter Project Price' }]}
                                >
                                    <InputNumber placeholder="Project Price" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Consume Credits"
                                    name="consume_credits"
                                    rules={[{ required: true, message: 'Please Enter Consume Credits' }]}
                                >
                                    <InputNumber placeholder="Consume Credits" type="number" style={{ width: '100%' }} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Project For"
                                    name="project_for"
                                    rules={[{ required: true, message: 'Please Enter Project For' }]}
                                >

                                    <Radio.Group defaultValue="Customer(Online)" optionType="default" >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'projects-for', 'radio')}
                                    </Radio.Group>
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Send SMS"
                                    name="is_send_sms"
                                    valuePropName="checked"
                                // rules={[{ required: true, message: 'Please Enter Is Send_sms' }]}
                                >
                                    <Checkbox />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Send Whatsapp"
                                    name="is_send_whatsapp"
                                    valuePropName="checked"
                                // rules={[{ required: true, message: 'Please Enter Is Send_whatsapp' }]}
                                >
                                    <Checkbox />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="VIP"
                                    name="is_vip"
                                    valuePropName="checked"
                                //rules={[{ required: true, message: 'Please Enter Is Vip' }]}
                                >
                                    <Checkbox />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Project Status"
                                    name="project_status"
                                    rules={[{ required: true, message: 'Please Enter Project Status' }]}
                                >

                                    <Radio.Group defaultValue="Active" optionType="default" >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'active-inactive', 'radio')}
                                    </Radio.Group>
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
export default AddEditProject;