import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
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
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import CustomerForgetPassword from "./forgetPassword";
const Login = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [country, setCountry] = useState('');
    const [visibleForgetPassword,setVisibleForgetPassword]=useState(false);
    useEffect(() => {

        AOS.init();
        AOS.refresh();
        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true)
        }
        ).catch((error) => {
			message.error(error)
		});

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const dobOnChange = (date) => {

        registerForm.setFieldsValue({
            dob: moment(date).format('YYYY-MM-DD')
        })

    };
    const onLoginFinish = (values) => {
        setLoginLoader(true)
        var form = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            form.append(key, value);
        })
        axios.post('customer-login', form).then(res => {
            if (parseInt(res['data'].status) === 1) {
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
                context.saveCustomerLogin(res['data'].data, res['data'].api);
                context.updateCustomerLogged();


                setLoginLoader(false);
                navigate('/0/customer')
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoginLoader(false);

            }

        });

    }
    const dobDisabled = (current) => {
        // Can not select days before today and today
        return current && current > moment().subtract(18, "years");
    };
    const onRegisterFinish = (values) => {
        setRegisterLoader(true);
        var processedValues = {};
        Object.entries(values).forEach(([key, value]) => {
            if (value) processedValues[key] = value;
        });
        processedValues['password'] = context.psGlobal.encrypt(processedValues['password']);
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
                navigate('/0/customer')
            }
            else {
                message.error(res['data'].message || 'Error');
                setRegisterLoader(false);

            }

        });

    };
    if (context.customerLogged === 'yes') {
        navigate('/0/customer');
        return null;
    }
    else {
        return (

            <> {updateStatus && (<>
            <CustomerForgetPassword visible={visibleForgetPassword} onClose={()=>setVisibleForgetPassword(false)}/>
            <div className="container " style={{ marginTop: '6%' }}>
                <header class="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s" style={{ background: '#286b2e' }}>
                    {/* <nav id="main-navbar">
                        <ul>
                            <li>+91 9080208860</li>
                            <li>24stardoctors@gmail.com</li>
                        </ul>
                    </nav> */}
                    <div class="container" >
                        <div class="row">
                            <div class="col-12">



                                <nav class="main-nav">
                                    <a href="index.html" class="logo">

                                        <img src={logo} alt="company logo" />
                                    </a>


                                    <ul class="nav">

                                        <li class="scroll-to-section"><a href="/" class="active">Home</a></li>
                                        {/*  <li class="scroll-to-section"><a href="#about">About Us</a></li>
                                        <li class="scroll-to-section"><a href="#services">What We Do</a></li>
                                        <li class="scroll-to-section"><a href="#portfolio">Activities</a></li>
                                        <li class="scroll-to-section"><a href="#blog">Resources</a></li>
                                        <li class="scroll-to-section"><a href="#contact">Contact Us</a></li>
                                        <li><button type="button" class="btn btn-info btn-rounded">Matrimony</button></li>
                                        <li><button type="button" class="btn btn-success btn-rounded">Login</button></li> */}



                                    </ul>


                                </nav>
                            </div>
                        </div>
                    </div>
                </header>
                <div id="about" class="container-fluid" style={{ background: '#fff !important' }}>
                    <div class="container bg-white">
                        <div class="row">
                            <Row gutter={32} >
                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Spin spinning={registerLoader}>
                                        <Card title="Register" style={{border:'3px solid green'}}>

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



                                                <Form.Item
                                                    label="Title"
                                                    name="title"
                                                    rules={[{ required: true, message: 'Please Enter Title' }]}
                                                >

                                                    <Select
                                                        showSearch
                                                        placeholder="Title"

                                                        optionFilterProp="children"
                                                        //onChange={titleOnChange}
                                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    >
                                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'name-title')}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    label="First Name"
                                                    name="first_name"
                                                    rules={[{ required: true, message: 'Please Enter First Name' }]}
                                                >
                                                    <Input placeholder="First Name" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Last Name"
                                                    name="last_name"
                                                    rules={[{ required: true, message: 'Please Enter Last Name' }]}
                                                >
                                                    <Input placeholder="Last Name" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Dob"
                                                    name="dob"
                                                    rules={[{ required: true, message: 'Please Enter Dob' }]}
                                                >

                                                    <Space direction="vertical">
                                                        <DatePicker onChange={dobOnChange} format='DD/MM/YYYY'
                                                            defaultValue={moment(moment().subtract(18, "years"), 'DD/MM/YYYY')}
                                                            disabledDate={dobDisabled}
                                                            allowClear={false}
                                                        />
                                                    </Space>
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
                                                        //onChange={genderOnChange}
                                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    >
                                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'gender')}
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
                                                    label="Email"
                                                    name="email"
                                                    rules={[{ required: true, message: 'Please Enter Email' }]}
                                                >
                                                    <Input placeholder="Email" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Country"
                                                    name="country"
                                                    rules={[{ required: true, message: 'Please Enter Country' }]}
                                                >

                                                    <CountryDropdown
                                                        className="ant-input"
                                                        value={country}
                                                        onChange={(val) => setCountry(val)} />
                                                </Form.Item>

                                                <Form.Item
                                                    label="State"
                                                    name="state"
                                                    rules={[{ required: true, message: 'Please Enter State' }]}
                                                >

                                                    <RegionDropdown
                                                        country={country}
                                                        className="ant-input"
                                                    // value={viewData.state}

                                                    //onChange={(val) => this.selectRegion(val)} 
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
                                                    <Button size="large" type="primary" htmlType="submit" style={{ background: '#286b2e' }}>
                                                        Register
                                                    </Button>
                                                </Form.Item>

                                            </Form>

                                        </Card></Spin>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={12} >
                                    <Spin spinning={loginLoader} >
                                        <Card title="Login" style={{border:'3px solid green'}}>
                                            
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
                                                    label="Email"
                                                    name="email"
                                                    rules={[{ required: true, message: 'Please Enter Email Id' }]}
                                                >
                                                    <Input placeholder="Email Id" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Password"
                                                    name="password"
                                                    rules={[{ required: true, message: 'Please Enter Password' }]}
                                                >
                                                    <Input.Password placeholder="Password" />
                                                </Form.Item>



                                                <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                                    <Button size="large" type="primary" htmlType="submit" style={{ background: '#286b2e' }}>
                                                        Login
                                                    </Button>
                                                </Form.Item>
                                                <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                                    <Button type="text" onClick={()=>setVisibleForgetPassword(true)} >Forget Password?</Button>
                                                </Form.Item>

                                            </Form>
                                        </Card>
                                    </Spin>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>


            </div> <footer style={{ background: '#286b2e' }}>
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
                                <p style={{ color: '#fff' }}>© Copyright 2022 World Tamil Music University

                                    {/*  <br />Design: <a rel="nofollow" href="https://peacesoft.in/">PeaceSoftTechnogies</a> */}
                                </p>
                            </div>
                        </div>
                    </div>
                </footer></>)}
                </>

        );
    }
};
export default Login;