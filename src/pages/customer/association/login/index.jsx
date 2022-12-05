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
import { green } from '@ant-design/colors';
import 'react-phone-input-2/lib/style.css'
import moment from 'moment';
import OTPLogin from "./otpLogin";
const Login = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [showOTPLogin, setShowOTPLogin] = useState(false);
    useEffect(() => {

        AOS.init();
        AOS.refresh();
        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true)
        }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const onLoginFinish = (values) => {
        setLoginLoader(true)
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        })
        axios.post('v1/admin/customer-login', form).then(res => {
            if (parseInt(res['data'].status) === 1) {
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
                context.saveCustomerLogin(res['data'].data, res['data'].api);
                context.updateCustomerLogged();


                setLoginLoader(false);
                navigate('/0/customer/dashboard')
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoginLoader(false);

            }

        });

    }
    const onOTPLoginSuccess = (currentPhone, cusPassword) => {
        setLoginLoader(true)
        var form = new FormData();

        form.append("username", currentPhone);
        form.append("password", cusPassword);

        axios.post('v1/admin/customer-login', form).then(res => {
            if (parseInt(res['data'].status) === 1) {
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
                context.saveCustomerLogin(res['data'].data, res['data'].api);
                context.updateCustomerLogged();


                setLoginLoader(false);
                navigate('/0/customer/dashboard')
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoginLoader(false);

            }

        });
    }

    if (context.customerLogged === 'yes') {
        navigate('/0/customer');
    }

    return (

        <> <div className="container " style={{ marginTop: '6%' }}>
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
                                    {
                                        updateStatus && (<Spin spinning={loginLoader}>
                                            <Card title="Login">
                                                <Form
                                                    name="basic"
                                                    form={loginForm}
                                                    labelAlign="left"
                                                    labelCol={{ span: 8 }}
                                                    wrapperCol={{ span: 20 }}
                                                    initialValues={{ remember: true }}
                                                    onFinish={onLoginFinish}
                                                    autoComplete="off"
                                                >
                                                    <Form.Item
                                                        label="username"
                                                        name="username"
                                                        rules={[{ required: true, message: 'Please Enter Mobile No/Member Id' }]}
                                                    >
                                                        <Input placeholder="Mobile/Member Id" />
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
                                                            Login
                                                        </Button>
                                                    </Form.Item>

                                                    <Row gutter={16}>
                                                        <Col className="gutter-row" xs={24} xl={12}>
                                                            <Button type="text" href="#/member-register">New User? Register</Button>
                                                        </Col>
                                                        <Col className="gutter-row" xs={24} xl={12}>
                                                            <Button type="text"
                                                                style={{ color: green[7], float: 'right', fontWeight: 'bold' }}
                                                                onClick={() => setShowOTPLogin(true)}
                                                            >Login with OTP</Button>
                                                        </Col>
                                                    </Row>


                                                </Form>
                                            </Card>
                                        </Spin>)
                                    }
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
            </footer>
            {
                updateStatus && (<OTPLogin show={showOTPLogin} onCancel={() => setShowOTPLogin(false)} onLoginSuccess={onOTPLoginSuccess} />)
            }

        </>

    );

};
export default Login;