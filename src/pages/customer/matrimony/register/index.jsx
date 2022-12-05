import React, { useState, useEffect, useContext } from "react";
import { useNavigate, withRouter } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message } from 'antd';
import AOS from "aos";
import axios from 'axios';
import PsContext from '../../../../context'
import PhoneInput from 'react-phone-input-2'
import moment from 'moment';
import { apiRequest } from "../../../../models/core";
import { MyButton } from "../../../../comp";
import { FormItem } from "../../../../comp";
import { LoadingOutlined } from '@ant-design/icons';
const Register = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [otpTemplate, setOtpTemplate] = useState(null);
    const [casteList, setCasteList] = useState([]);
    const [casteLoader, setCasteLoader] = useState(false);
    useEffect(() => {
        getOTPTemplate();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadCastes = (religion) => {
        setCasteLoader(true);
        var reqData =
        {
            query_type: 'query',
            query: "select id,caste_name from castes where religion='" + religion + "' and master_caste_id is null"
        }

        apiRequest(reqData, "prod").then((res) => {

            setCasteList(res);
            setCasteLoader(false);
        }).catch(err => {
            message.error(err);
            setCasteLoader(false);
        })
    }
    const getOTPTemplate = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from sms_templates where template_for='register-otp' and status='1'"
        }
        apiRequest(reqData, "prod").then((res, error) => {
            setOtpTemplate(res[0]);
        }).catch(err => {
            message.error(err);

        })
    }
    const onRegisterFinish = (values) => {

        setRegisterLoader(true);
        //var otp = Math.floor(1000 + Math.random() * 1000);
        var processedValues = {};
        Object.entries(values.members).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['educational_qualification'] ='93';
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);
        // processedValues['mobile_otp'] = otp;
        var form = new FormData();

        Object.entries(processedValues).forEach(([key, value]) => {
            form.append(key, value);
        })
        axios.post('v1/admin/customer-register', form).then(res => {
            if (parseInt(res['data'].status) === 1) {
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
                context.saveCustomerLogin(res['data'].data, res['data'].api);
                context.updateCustomerLogged();

                setRegisterLoader(false);
                // processSms(processedValues.name, processedValues.mobile_no, otp)
                navigate('/0/customer/dashboard')
            }
            else {
                message.error(res['data'].message || 'Error');
                setRegisterLoader(false);

            }

        });

    };

    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
    };
    const processSms = (name, mobile, otp) => {


        var smsData = {
            template_id: otpTemplate.template_id, //query_type=insert | update | delete | query
            unicode: otpTemplate.is_unicode,
            messages: [
                {
                    mobile_no: mobile,
                    message: otpTemplate.template.replace("{Name}", name).replace("{OTP}", otp)
                }
            ]
        };
        context.psGlobal.sendSms(smsData).then((res) => {
            // console.log('otp when resend'+ otp)
        }).catch(err => {
            message.error(err);
        })
    }
    return (
        <>
            <Row gutter={32}>
                <Col className='gutter-row' xs={24} xl={6}>
                </Col>

                <Col className='gutter-row' xs={24} xl={12}>
                    <Spin spinning={registerLoader}>
                        <Card title="Register"  extra={<Button type="text" href="#/public/login">Already Member? Login</Button>}>

                            <Form
                                name="basic"
                                form={registerForm}
                                labelAlign="left"
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 20 }}
                                initialValues={{ remember: true }}
                                onFinish={onRegisterFinish}
                                autoComplete="off"
                            >
                                <FormItem
                                    label="Member Created For"
                                    name={['members', 'member_created_for']}
                                    rules={[{ required: true, message: 'Please Enter Member Created For' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Member Created For"

                                        optionFilterProp="children"
                                        //onChange={memberCreatedForOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'profile-created-for')}
                                    </Select>
                                </FormItem>

                                <FormItem
                                    label="Name"
                                    name={['members', 'name']}
                                    rules={[{ required: true, message: 'Please Enter Name' }]}
                                >
                                    <Input placeholder="Name" />
                                </FormItem>

                                <FormItem
                                    label="Father Name"
                                    name={['members', 'father_name']}
                                    rules={[{ required: true, message: 'Please Enter Father Name' }]}
                                >
                                    <Input placeholder="Father Name" />
                                </FormItem>

                                <FormItem
                                    label="Gender"
                                    name={['members', 'gender']}
                                    rules={[{ required: true, message: 'Please Enter Gender' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Gender"

                                        optionFilterProp="children"
                                        //onChange={genderOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                    </Select>
                                </FormItem>

                                <FormItem
                                    label="Dob"
                                    name={['members', 'dob']}
                                    rules={[{ required: true, message: 'Please Enter Dob' }]}
                                >

                                    <Space direction="vertical">
                                        <DatePicker
                                            onChange={(date) => { registerForm.setFieldsValue({ members: { dob: moment(date).format('YYYY-MM-DD') } }) }}
                                            format='DD/MM/YYYY'
                                            defaultValue={moment(moment().subtract(18, "years"), 'DD/MM/YYYY')}

                                            disabledDate={dobDisabled}
                                            allowClear={false}
                                        />
                                    </Space>
                                </FormItem>
                                <FormItem
                                    label="Marital Status"
                                    name={['members', 'marital_status']}
                                    rules={[{ required: true, message: 'Please Enter Marital Status' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Marital Status"

                                        optionFilterProp="children"
                                        //onChange={maritalStatusOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'marital-status')}
                                    </Select>
                                </FormItem>

                                <FormItem
                                    label="Religion"
                                    name={['members', 'religion']}
                                    rules={[{ required: true, message: 'Please Enter Religion' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Religion"
                                        onChange={(value) => loadCastes(value)}
                                        optionFilterProp="children"
                                        //onChange={religionOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'religion')}
                                    </Select>
                                </FormItem>

                                <Spin spinning={casteLoader} indicator={<LoadingOutlined />} tip="Caste Loading"><FormItem
                                    label="Caste"
                                    name={['members', 'caste']}
                                    rules={[{ required: true, message: 'Please Enter Caste' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Caste"

                                        optionFilterProp="children"
                                        //onChange={casteOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                        {casteList.map(item => <Select.Option value={item.id}>{item.caste_name}</Select.Option>)}
                                    </Select>
                                </FormItem>
                                </Spin>

                                <FormItem
                                    label="Mobile No"
                                    name={['members', 'mobile_no']}
                                    rules={[
                                        { required: true, message: 'Please Enter Mobile No' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (value && value.toString().startsWith("91") && value.toString().length < 12) {
                                                    return Promise.reject(new Error('Invalid Indian Mobile Number'))
                                                }

                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >

                                    <PhoneInput
                                        country={'in'}

                                    //onChange={phone => {}}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Email"
                                    name={['members', 'email']}
                                    rules={[{
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    }]}
                                >
                                    <Input placeholder="Email" />
                                </FormItem>

                                <FormItem
                                    label="Password"
                                    name={['members', 'password']}
                                    rules={[{ required: true, message: 'Please Enter Password' }]}
                                >
                                    <Input.Password placeholder="Password" />
                                </FormItem>

                                <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                    <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                        Register
                                    </MyButton>
                                </Form.Item>


                                <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
                                    <Button type="text" href="#/public/login">Already Member? Login</Button>
                                </Form.Item>

                            </Form>

                        </Card></Spin>
                </Col>
                <Col className='gutter-row' xs={24} xl={6}>
                </Col>

            </Row>
        </>

    );

};
export default Register;