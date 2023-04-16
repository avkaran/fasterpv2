import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams,Link } from 'react-router-dom';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message } from 'antd';
import AOS from "aos";
import axios from 'axios';
import PsContext from '../../../../context'
import PhoneInput from 'react-phone-input-2'
import dayjs from 'dayjs';
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
        Object.entries(values.users).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);
        // processedValues['mobile_otp'] = otp;
        var form = new FormData();

        Object.entries(processedValues).forEach(([key, value]) => {
            form.append(key, value);
        })
        axios.post('admin/customer-register', form).then(res => {
            if (parseInt(res['data'].status) === 1) {
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
                context.saveCustomerLogin(res['data'].data, res['data'].api);
                context.updateCustomerLogged();

                navigate('/0/customer/dashboard')

               /*  context.psGlobal.addLog({
                    log_name: 'add-new-member',
                    logged_type: "customer",
                    logged_by: res['data'].data.id,
                    ref_table_column: 'members.id',
                    ref_id: res['data'].data['id'],
                    ref_id2: res['data'].data['member_id'],
                    description: 'New Member Added ' + res['data'].data['member_id']
                }).then(logRes => {
                    setRegisterLoader(false);
                    // processSms(processedValues.name, processedValues.mobile_no, otp)
                    
                }) */


            }
            else {
                message.error(res['data'].message || 'Error');
                setRegisterLoader(false);

            }

        });

    };

    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().subtract(18, "years");
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
                        <Card title="Register" extra={<Link to='/public/login'><Button type="text">Already Member? Login</Button></Link>}>

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
                                    label="Title"
                                    name={['users', 'title']}
                                    rules={[{ required: true, message: 'Please Enter Title' }]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Title"

                                        optionFilterProp="children"
                                        //onChange={memberCreatedForOnChange}
                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                    >
                                      <Select.Option value="Mr.">Mr.</Select.Option>
                                      <Select.Option value="Mrs.">Mrs.</Select.Option>
                                      <Select.Option value="Miss.">Miss.</Select.Option>
                                      <Select.Option value="Ms.">Ms.</Select.Option>
                                      <Select.Option value="Master.">Master.</Select.Option>
                                    </Select>
                                </FormItem>
                                <FormItem
                                    label="Name"
                                    name={['users', 'first_name']}
                                    rules={[{ required: true, message: 'Please Enter First Name' }]}
                                >
                                    <Input placeholder="First Name" />
                                </FormItem>



                                <FormItem
                                    label="Gender"
                                    name={['users', 'gender']}
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
                                    name={['users', 'dob']}
                                    rules={[{ required: true, message: 'Please Enter Dob' }]}
                                >

                                    <Space direction="vertical">
                                        <DatePicker
                                            onChange={(date) => { registerForm.setFieldsValue({ users: { dob: dayjs(date).format('YYYY-MM-DD') } }) }}
                                            format='DD/MM/YYYY'
                                            defaultValue={dayjs(dayjs().subtract(18, "years"), 'DD/MM/YYYY')}

                                            disabledDate={dobDisabled}
                                            allowClear={false}
                                        />
                                    </Space>
                                </FormItem>

                                <FormItem
                                    label="Mobile No"
                                    name={['users', 'mobile_no']}
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
                                    name={['users', 'email']}
                                    rules={[{
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    }]}
                                >
                                    <Input placeholder="Email" />
                                </FormItem>

                                <FormItem
                                    label="Password"
                                    name={['users', 'password']}
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
                                <Link to='/public/login'><Button type="text">Already Member? Login</Button></Link>
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