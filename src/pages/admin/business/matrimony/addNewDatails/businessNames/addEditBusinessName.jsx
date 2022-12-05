import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, message, Space } from 'antd';
import { Button, Card } from 'antd';
import { Form, Input, Select, InputNumber, Radio, Checkbox } from 'antd';
import { Breadcrumb, Layout, Spin } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import PsContext from '../../../../../../context';
import { Editor } from '@tinymce/tinymce-react';
import { ImageUpload, FormItem, MyButton } from '../../../../../../comp';
import { capitalizeFirst } from '../../../../../../utils';
import PhoneInput from 'react-phone-input-2'
const AddEditBusinessName = (props) => {
    const context = useContext(PsContext);
    const { Content } = Layout;
    const navigate = useNavigate();
    const [addeditFormBusinessName] = Form.useForm();
    const [loader, setLoader] = useState(false);
    const [curAction, setCurAction] = useState('add');
    const [editData, setEditData] = useState(null);
    const [heading] = useState('Business Name');
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
            addeditFormBusinessName.setFieldsValue({
                business_names:{business_status:'Active'},
            })
        }

    }, []);
    const loadEditData = (id) => {
        setLoader(true);
        var reqData = {
            query_type: 'query',
            query: "select * from business_names where status=1 and id=" + id
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

           addeditFormBusinessName.setFieldsValue({
              
            business_names:{
                business_name:mydata.business_name,
                
                phone:mydata.phone,
                
                alternative_phone_1:mydata.alternative_phone_1,
                
                alternative_phone_2:mydata.alternative_phone_2,
                
                whatsapp_no:mydata.whatsapp_no,
                
                email_id:mydata.email_id,
                
                business_address:mydata.business_address,
                
                business_status:mydata.business_status,
                }
          }) 
    }
    const addeditFormBusinessNameOnFinish = (values) => {
        setLoader(true);
        var processedValues = {};
        Object.entries(values.business_names).forEach(([key, value]) => {
            if (value) {
                processedValues[key] = value;
            }
        });


        if (curAction === "add") {
            var reqDataInsert = {
                query_type: 'insert',
                table: 'business_names',
                values: processedValues

            };
            context.psGlobal.apiRequest(reqDataInsert, context.adminUser(userId).mode).then((res) => {
                setLoader(false);
                message.success(heading + ' Added Successfullly');
                onSaveFinish();

            }).catch(err => {
                message.error(err);
                setLoader(false);
            })
        } else if (curAction === "edit") {
            var reqDataUpdate = {
                query_type: 'update',
                table: 'business_names',
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
                        form={addeditFormBusinessName}
                        labelAlign="left"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 20 }}
                        initialValues={{ remember: true }}
                        onFinish={addeditFormBusinessNameOnFinish}
                        autoComplete="off"
                    >
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Business Name"
                                    name={['business_names', 'business_name']}
                                    rules={[{ required: true, message: 'Please Enter Business Name' }]}
                                >
                                    <Input placeholder="Business Name" />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Phone"
                                    name={['business_names', 'phone']}
                                    rules={[{ required: true, message: 'Please Enter Phone' }]}
                                >

                                    <PhoneInput
                                        country={'in'}

                                    //onChange={phone => {}}
                                    />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Alternative Phone_1"
                                    name={['business_names', 'alternative_phone_1']}
                                   // rules={[{ required: true, message: 'Please Enter Alternative Phone_1' }]}
                                >

                                    <PhoneInput
                                        country={'in'}

                                    //onChange={phone => {}}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Alternative Phone_2"
                                    name={['business_names', 'alternative_phone_2']}
                                  //  rules={[{ required: true, message: 'Please Enter Alternative Phone_2' }]}
                                >

                                    <PhoneInput
                                        country={'in'}

                                    //onChange={phone => {}}
                                    />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Whatsapp No"
                                    name={['business_names', 'whatsapp_no']}
                                    rules={[{ required: true, message: 'Please Enter Whatsapp No' }]}
                                >

                                    <PhoneInput
                                        country={'in'}

                                    //onChange={phone => {}}
                                    />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Email Id"

                                    name={['business_names', 'email_id']}
                                    rules={[
                                       // { required: true, message: 'Please Enter Email Id' },
                                        { type: 'email', message: 'The input is not valid E-mail!', },
                                    ]}
                                >
                                    <Input placeholder="Email Id" />
                                </FormItem>

                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Business Address"
                                    name={['business_names', 'business_address']}
                                    rules={[{ required: true, message: 'Please Enter Business Address' }]}
                                >
                                    <Input.TextArea rows={3} />
                                </FormItem>

                            </Col>
                            <Col className='gutter-row' xs={24} xl={12}>

                                <FormItem
                                    label="Business Status"
                                    name={['business_names', 'business_status']}
                                    rules={[{ required: true, message: 'Please Enter Business Status' }]}
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
                                    {curAction === "edit" ? "Save" : "Submit"}
                                </MyButton>
                            </Space>

                        </FormItem>

                    </Form>)
                }

            </Spin>



        </>
    );

}
export default AddEditBusinessName;