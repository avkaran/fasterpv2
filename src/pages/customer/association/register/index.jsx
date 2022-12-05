import React, { useState, useEffect, useContext } from "react";
import { useNavigate, withRouter } from 'react-router-dom';
//import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message } from 'antd';
//import { VENDOR_LOGO } from '../../../utils/data';
import AOS from "aos";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'antd/dist/antd.css';
import '../assets/css/templatemo-space-dynamic.css';
import logo from '../assets/images/logo.png';
import PsContext from '../../../../context'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import moment from 'moment';
import { apiRequest } from "../../../../models/core";
const Register = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [otpTemplate, setOtpTemplate] = useState(null);
    useEffect(() => {

        AOS.init();
        AOS.refresh();

        context.updateGlobal().then((res) => {
            getOTPTemplate();
            if (res) setUpdateState(true)
        }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getOTPTemplate = () => {
        var reqData = {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from sms_templates where template_for='otp' and status='1'"
        }
        apiRequest(reqData, "prod").then((res, error) => {
            setOtpTemplate(res[0]);
        }).catch(err => {
            message.error(err);

        })
    }
    const onRegisterFinish = (values) => {
        setRegisterLoader(true);
        var otp = Math.floor(1000 + Math.random() * 1000);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);
        processedValues['mobile_otp'] = otp;
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
                processSms(processedValues.name, processedValues.mobile_no, otp)
                navigate('/0/customer/dashboard')
            }
            else {
                message.error(res['data'].message || 'Error');
                setRegisterLoader(false);

            }

        });

    };
    const disabledDate = (current) => {
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
    if (context.customerLogged === 'yes') {
        navigate('/0/customer');
        return null;
    }
    else {
        return (

            <><div className="container " style={{ marginTop: '6%' }}>
                <header class="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s" style={{ background: '#03a4ed' }}>
                    {/* <nav id="main-navbar">
                        <ul>
                            <li>+91 9080208860</li>
                            <li>24stardoctors@gmail.com</li>
                        </ul>
                    </nav> */}
                    <div class="container">
                        <div class="row">
                            <div class="col-12">



                                <nav class="main-nav" >
                                    <a href="index.html" class="logo">

                                        <img src={logo} alt="company logo" />
                                    </a>


                                    <ul class="nav">

                                        <li class="scroll-to-section"><a href="http://24stardoctors.com" className="active" style={{ color: '#fff !important' }}>Home</a></li>
                                        {/* <li class="scroll-to-section"><a href="#about">About Us</a></li>
                                        <li class="scroll-to-section"><a href="#services">What We Do</a></li>
                                        <li class="scroll-to-section"><a href="#portfolio">Activities</a></li>
                                        <li class="scroll-to-section"><a href="#blog">Resources</a></li>
                                        <li class="scroll-to-section"><a href="#contact">Contact Us</a></li>
                                        <li><button type="button" class="btn btn-info btn-rounded">Matrimony</button></li>
                                        <li><button type="button" class="btn btn-success btn-rounded">Login</button></li>
 */}


                                    </ul>
                                    {/* <a class='menu-trigger'>
                                        <span>Menu</span>
                                    </a> */}

                                </nav>
                            </div>
                        </div>
                    </div>
                </header>
                <div id="about" class="container-fluid" style={{ background: '#fff !important' }}>
                    <div class="container bg-white">
                        <div class="row">
                            <Row gutter={32}>
                                <Col className='gutter-row' xs={24} xl={6}>
                                </Col>

                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Spin spinning={!updateStatus}>
                                        <Spin spinning={registerLoader}>
                                            <Card title="Register">
                                                {
                                                    updateStatus && (<Form
                                                        name="basic"
                                                        form={registerForm}
                                                        labelAlign="left"
                                                        labelCol={{ span: 8 }}
                                                        wrapperCol={{ span: 20 }}
                                                        initialValues={{ remember: true }}
                                                        onFinish={onRegisterFinish}
                                                        autoComplete="off"
                                                    >


                                                        <Form.Item
                                                            label="Name"
                                                            name="name"
                                                            rules={[{ required: true, message: 'Please Enter Name' }]}
                                                        >
                                                            <Input placeholder="Name" />
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Gender"
                                                            name="gender"
                                                            rules={[{ required: true, message: 'Please Enter Gender' }]}
                                                        >

                                                            <Select
                                                                showSearch
                                                                placeholder="Gender"

                                                                optionFilterProp="children"
                                                                // onChange={genderOnChange}
                                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                            >
                                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Member Type"
                                                            name='member_type'
                                                            rules={[{ required: true, message: 'Please Enter Member Type' }]}
                                                        >

                                                            <Select
                                                                showSearch
                                                                placeholder="Member Type"

                                                                optionFilterProp="children"
                                                                //onChange={memberTypeOnChange}
                                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                            >
                                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'member-types')}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Dob"
                                                            name="dob"
                                                            rules={[{ required: true, message: 'Please Enter Dob' }]}
                                                        >

                                                            <Space direction="vertical">
                                                                <DatePicker
                                                                    onChange={(date) => { registerForm.setFieldsValue({ dob: moment(date).format('YYYY-MM-DD') }) }}
                                                                    format='DD/MM/YYYY'
                                                                    defaultValue={moment(moment().subtract(18, "years"), 'DD/MM/YYYY')}
                                                                    disabledDate={disabledDate}

                                                                    //  disabledDate={dobDisabled}
                                                                    allowClear={false}
                                                                />
                                                            </Space>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Manai"
                                                            name="manai"
                                                            rules={[{ required: true, message: 'Please Enter Manai' }]}
                                                        >

                                                            <Select
                                                                showSearch
                                                                placeholder="Manai"

                                                                optionFilterProp="children"
                                                                //onChange={manaiOnChange}
                                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                            >
                                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'manai')}
                                                            </Select>
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Marital Status"
                                                            name="marital_status"
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
                                                        </Form.Item>

                                                        <Form.Item
                                                            label="Qualification"
                                                            name="qualification"
                                                            rules={[{ required: true, message: 'Please Enter Qualification' }]}
                                                        >

                                                            <Select
                                                                showSearch
                                                                placeholder="Qualification"

                                                                optionFilterProp="children"
                                                                // onChange={qualificationOnChange}
                                                                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                            >
                                                                {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'qualification')}
                                                            </Select>
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Mobile No"
                                                            name="mobile_no"
                                                            rules={[{ required: true, message: 'Please Enter Mobile No' }]}
                                                        >

                                                            <PhoneInput
                                                                country={'in'}

                                                            //onChange={phone => {}}
                                                            />
                                                        </Form.Item>
                                                        <Form.Item
                                                            label="Password"
                                                            name="password"
                                                            rules={[{ required: true, message: 'Please Enter Password' }]}
                                                        >
                                                            <Input.Password placeholder="Password" />
                                                        </Form.Item>





                                                        <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                                            <Button size="large" type="primary" htmlType="submit" style={{}}>
                                                                Register
                                                            </Button>
                                                        </Form.Item>


                                                        <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
                                                            <Button type="text" href="#/member-login">Already Member? Login</Button>
                                                        </Form.Item>

                                                    </Form>)
                                                }


                                            </Card>
                                        </Spin>
                                    </Spin>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>
                                </Col>

                            </Row>
                        </div>
                    </div>
                </div>


            </div><footer style={{ background: '#03a4ed' }}>
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
                                <p>© Copyright 2022 24 Manai Telugu Chettiars. All Rights Reserved.


                                </p>
                            </div>
                        </div>
                    </div>
                </footer></>

        );
    }
};
export default Register;