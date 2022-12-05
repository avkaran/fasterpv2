import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
//import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message } from 'antd';
//import { VENDOR_LOGO } from '../../../utils/data';
import AOS from "aos";
import axios from 'axios';
import PsContext from '../../../../context'
import PhoneInput from 'react-phone-input-2'
import { green } from '@ant-design/colors';
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
                if (context.customerUser.member_status == 'initiated') {
                    navigate('/0/customer/register-wizard')
                } else {
                    navigate('/0/customer/dashboard')
                }
            }
            else {
                message.error(res['data'].message || 'Error');
                setLoginLoader(false);

            }

        });
    }


    return (

        <>
            <Row gutter={32}>
                <Col className='gutter-row' xs={24} xl={6}>
                </Col>
                <Col className='gutter-row' xs={24} xl={12}>
                    <Spin spinning={loginLoader}>
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
                                    <Input placeholder="Mobile No/Member Id" />
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
                                        <Button type="text" href="#/public/register">New User? Register</Button>
                                    </Col>
                                    <Col className="gutter-row" xs={24} xl={12}>
                                        {<Button type="text"
                                            style={{ color: green[7], float: 'right', fontWeight: 'bold' }}
                                            onClick={() => setShowOTPLogin(true)}
                                        >Login with OTP</Button>}
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Spin>
                </Col>
                <Col className='gutter-row' xs={24} xl={6}>
                </Col>
            </Row>
            <OTPLogin show={showOTPLogin} onCancel={() => setShowOTPLogin(false)} onLoginSuccess={onOTPLoginSuccess} /></>)
}
export default Login