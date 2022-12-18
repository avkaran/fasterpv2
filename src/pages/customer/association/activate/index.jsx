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
import ViewProfile from "../matrimony/viewProfile";
import { apiRequest, decrypt, encrypt } from "../../../../models/core";
import { ViewItem } from "../../../../comp";
import { red } from '@ant-design/colors';
const ActivateMember = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [activateTemplate, setActivateTemplate] = useState(null);
    const [viewData, setViewData] = useState(null);
    const [isInvalid, setIsInvalid] = useState(null);
    useEffect(() => {
        AOS.init();
        AOS.refresh();
        loadData();
        context.updateGlobal().then((res) => {
            if (res) {
                setUpdateState(true);
            }
        }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const loadData = () => {
        var reqData = [{
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select * from sms_templates where template_for='activation-confirm' and status='1'"
        },
        {
            query_type: 'query', //query_type=insert | update | delete | query
            query: "select *,ROUND(DATE_FORMAT(FROM_DAYS(DATEDIFF(now(),dob)), '%Y')) AS age from members where id='" + decrypt(props.match.params.memberId) + "'"
        },
        ]
        apiRequest(reqData, "dev").then((res, error) => {
            setActivateTemplate(res[0][0]);
            setViewData(res[1][0]);
            console.log('view user', res)
            var currentUser = res[1][0];
            if (currentUser.payment_status == 'paid')
                setIsInvalid(true);
        }).catch(err => {
            message.error(err);

        })
    }
    const onActivateFinish = (values) => {
        setRegisterLoader(true);

        var reqData = {
            query_type: 'update',
            table: 'members',
            where: { id: decrypt(props.match.params.memberId) },
            values: { member_status: 'active', payment_status: 'paid' }
        };

        context.psGlobal.apiRequest(reqData, "prod").then((res) => {
            processSms();
            message.success("Member Activated");
            setIsInvalid(true);
           setRegisterLoader(false);
        }).catch(err => {
            message.error(err);
            setRegisterLoader(false);
        })

    };
    const processSms = () => {


        var smsData = {
            template_id: activateTemplate.template_id, //query_type=insert | update | delete | query
            unicode: activateTemplate.is_unicode,
            messages: [
                {
                    mobile_no: viewData.mobile_no,
                    message: activateTemplate.template.replace("{Name}", viewData.name).replace("{MemberId}",viewData.member_id)
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

        <> {updateStatus && (<><div className="container " style={{ marginTop: '6%' }}>
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
                        {
                            isInvalid && (<span style={{fontSize:'20px',color:red[6]}}>Invalid Url/Already Activated</span>)
                        }          
                        {viewData && !isInvalid && (<>
                            <Card title="Activate New Member">
                                <Row gutter={16}>
                                    <Col xs={24} xl={12}>
                                        <Spin spinning={registerLoader}>
                                            <ViewItem label="Payment Status" value={viewData.payment_status} labelCol={12} wrapperCol={12} />
                                            <ViewItem label="Paid Date" value={viewData.paid_date} labelCol={12} wrapperCol={12} />
                                            <ViewItem label="Payment Mode" value={viewData.payment_mode} labelCol={12} wrapperCol={12} />
                                            <ViewItem label="Amount" value={viewData.amount} labelCol={12} wrapperCol={12} />
                                            <ViewItem label="Payment Info" value={viewData.payment_note} labelCol={12} wrapperCol={12} />
                                        </Spin>
                                    </Col>
                                    <Col xs={24} xl={12}>
                                        <Form
                                            name="basic"
                                            form={registerForm}
                                            labelAlign="left"
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 20 }}
                                            initialValues={{ remember: true }}
                                            onFinish={onActivateFinish}
                                            autoComplete="off"
                                        >








                                            <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                                <Button size="large" type="primary" htmlType="submit" style={{}}>
                                                    Activate Now
                                                </Button>
                                            </Form.Item>




                                        </Form>
                                    </Col>
                                </Row>



                            </Card><ViewProfile memberData={viewData} showBackButton={false} onBack={() => {
                                //setIsViewProfile(false);
                            }} /></>
                        )
                        }


                    </div>
                </div>
            </div>


        </div><footer style={{ background: '#03a4ed' }}>
                <div class="container">
                    <div class="row">
                        <div class="col-lg-12 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.25s">
                            <p>© Copyright 2022 24 Manai Telugu Chettiars. All Rights Reserved.

                                <br />Design: <a rel="nofollow" href="https://peacesoft.in/">PeaceSoftTechnogies</a>
                            </p>
                        </div>
                    </div>
                </div>
            </footer></>)}</>

    );

};
export default ActivateMember;