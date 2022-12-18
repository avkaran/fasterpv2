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
import dayjs from 'dayjs';
import { apiRequest, decrypt, encrypt } from "../../../../models/core";
import { ViewItem } from "../../../../comp";
import { green, red } from '@ant-design/colors';
import queryString from 'query-string';
import { getLs, setLs, RemoveLs } from '../../../../utils'
const CustomerResetPassword = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [resetPasswordForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [isInvalid, setIsInvalid] = useState(null);
    const [resetUserId, setResetUserId] = useState(null);
    useEffect(() => {
        AOS.init();
        AOS.refresh();
        //loadData();
        var qString = queryString.parse(props.location.search);

        if (qString.q) {
            try {
                var decryptQ = decrypt(qString.q);
                var splitData = decryptQ.split("$");
                if (splitData.length === 2) {
                    var expiryDateTime = dayjs.unix(splitData[0]);
                    if (expiryDateTime > dayjs()) {
                        var id = splitData[1];
                        // console.log(expiryDateTime)
                        setIsInvalid(false);
                        setResetUserId(id);
                        LoadUserData(id);
                    }
                    else {
                        //expired
                        setIsInvalid(true);
                    }

                }
                else setIsInvalid(true);

            } catch (ex) {
                setIsInvalid(true)
            }

        } else setIsInvalid(true);

        context.updateGlobal().then((res) => {
            if (res) {
                setUpdateState(true);
            }
        }
        ).catch((error) => {
            message.error(error)
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const LoadUserData = (id) => {
        var reqData = {
            query_type: 'query',
            query: "select id,first_name,email from users where status=1 and id=" + id,

        };

        apiRequest(reqData, "prod").then((res) => {
            setViewData(res[0]);
            resetPasswordForm.setFieldsValue({email:res[0].email})
        }).catch(err => {
            message.error(err);

        })
    }
    const onResetFormFinish=(values)=>{

        var reqData = { 
            query_type: 'update',
            table:'users',
            where:{id:resetUserId},
            values:{password:encrypt(values.password)}

        };
       
        apiRequest(reqData,"prod").then((res,error)=>{
            message.success("password Changed");
            navigate('/member-login')
        }).catch(err => {
            message.error(err);
           
        })
    }
    return (

        <>
         
         {updateStatus && (<><div className="container " style={{ marginTop: '6%' }}>
            <header class="header-area header-sticky wow slideInDown" data-wow-duration="0.75s" data-wow-delay="0s" style={{ background: '#286b2e' }}>
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
                        {
                            isInvalid && (<span style={{ fontSize: '20px', color: red[6] }}>Invalid Url/Link Expired</span>)
                        }
                        {
                            !isInvalid && (<>
                                <Card title="Reset Password">
                                    <Form
                                        name="basic"
                                        form={resetPasswordForm}
                                        labelAlign="left"
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 20 }}
                                        initialValues={{ remember: true }}
                                        onFinish={onResetFormFinish}
                                        autoComplete="off"
                                    >
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                           
                                            rules={[{ required: true, message: 'Please Enter Email Id' }]}
                                        >
                                            <Input placeholder="Email Id" disabled/>
                                        </Form.Item>

                                        <Form.Item
                                            label="New Password"
                                            name="password"
                                            rules={[{ required: true, message: 'Please Enter Password' }]}
                                        >
                                            <Input.Password placeholder="Password" />
                                        </Form.Item>

                                        <Form.Item
                                            label="Confirm New Password"
                                            name="confirm_password"
                                            dependencies={['password']}
                                            rules={[
                                                { required: true, message: 'Please Confirm your Password' },
                                                ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                            return Promise.resolve();
                                                        }

                                                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                                    },
                                                }),
                                            ]}
                                        >
                                            <Input.Password placeholder="Confirm Password" />
                                        </Form.Item>

                                        <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                            <Button size="large" type="primary" htmlType="submit" style={{ background: '#286b2e' }}>
                                                Reset Now
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Card></>)
                        }



                    </div>
                </div>
            </div>


        </div><footer style={{ background: '#286b2e' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
                            <p>© Copyright 2022 WTMU. All Rights Reserved.

                                <br />Design: <a rel="nofollow" href="https://peacesoft.in/">PeaceSoftTechnogies</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer></>)} <Spin spinning={!updateStatus}></Spin></>
    );

};
export default CustomerResetPassword;