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
import { apiRequest } from "../../../../models/core";
import { MyButton } from "../../../../comp";
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
        var otp = Math.floor(1000 + Math.random() * 1000);
        var processedValues = {};
        Object.entries(values.hospital_members).forEach(([key, value]) => {
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
                navigate('/0/customer/register-wizard')
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

    const passwordValidate= (e) => {
    
        const len = e.target.value.length;
        
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.*[a-zA-Z]).{8,}$/i;
         
        if(!e.target.value || regex.test(e.target.value) === false){ 
          e.preventDefault();
          return false;
        }
        
    
      }
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
        navigate('/customer');
        return null;
    }
    else {
        return (

            <>
            {!updateStatus && (<><Spin spinning={true}/></>)}
             {updateStatus && (<>

            
          {/*   <div class="ttm-page-title-row">
            <div class="container">
                <div class="row">
                    <div class="col-md-12"> 
                        <div class="title-box ttm-textcolor-white">
                            <div class="page-title-heading">
                                <h1 class="title">Registration / Renewal</h1>
                            </div>
                            <div class="breadcrumb-wrapper">
                                <span>
                                    <a title="Homepage" href="index.php"><i class="ti ti-home"></i>&nbsp;&nbsp;Home</a>
                                </span>
                                <span class="ttm-bread-sep">&nbsp; | &nbsp;</span>
                                <span>Norms & Forms</span>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
        </div>*/}

 <div class="site-main" style={{padding: '10px 0 0 0px'}}>

 <section class="mt-md-12 mt-sm-0">
        <div class="row">
               
            <Row gutter={32}>
                                <Col className='gutter-row' xs={24} xl={6}>
                                </Col>

                                <Col className='gutter-row' xs={24} xl={12}>
                                    <Spin spinning={registerLoader}>
                                        <Card title="Register" class="title-header" headStyle={{ backgroundColor: '#0b0c26', color: '#ffffff' }}    >

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
                                                    label="Hospital Name"
                                                    name={['hospital_members', 'name']}
                                                    rules={[{ required: true, message: 'Please Enter Hospital Name' }]}
                                                >
                                                    <Input placeholder="Name" />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Mobile"
                                                    name={['hospital_members', 'mobile']}
                                                    rules={[{ required: true, message: 'Please Enter Mobile' }]}
                                                >

                                                    <PhoneInput
                                                        country={'in'}

                                                    //onChange={phone => {}}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Email Id"
                                                    name={['hospital_members', 'email_id']}
                                                    rules={[{ required: true, message: 'Please Enter Email Id' }]}
                                                >
                                                    <Input placeholder="Email Id" type="email"/>
                                                </Form.Item>

                                                <Form.Item
                                                    label="Type Of_ownership"
                                                    name={['hospital_members', 'type_of_ownership']}
                                                    rules={[{ required: true, message: 'Please Enter Type Of_ownership' }]}
                                                >

                                                    <Select
                                                        showSearch
                                                        placeholder="Type Of_ownership"

                                                        optionFilterProp="children"
                                                        //onChange={typeOf_ownershipOnChange}
                                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    >
                                                        {context.psGlobal.collectionOptions(context.psGlobal.collectionData, 'type_of_ownership')}
                                                    </Select>
                                                </Form.Item>

                                                <Form.Item
                                                    label="Doctor Name"
                                                    name={['hospital_members', 'doctor_name']}
                                                    rules={[{ required: true, message: 'Please Enter Doctor Name' }]}
                                                >
                                                    <Input placeholder="Doctor Name" />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Password"
                                                    name={['hospital_members', 'password']}
                                                    rules={[{ required: true, message: 'Please Enter Password' }]}
                                                  //  onChange={(e) => passwordValidate(e)}
                                                >
                                                    <Input.Password placeholder="Password" />
                                                </Form.Item>
                                                <Form.Item wrapperCol={{ offset: 12, span: 24 }}>
                                                    <MyButton size="large" type="primary" htmlType="submit" style={{}}>
                                                        Register
                                                    </MyButton>
                                                </Form.Item>


                                                <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
                                                    <Button type="text" href="/login">Already Member? Login</Button>
                                                </Form.Item>

                                            </Form>

                                        </Card></Spin>
                                </Col>
                                <Col className='gutter-row' xs={24} xl={6}>
                                </Col>

                            </Row>
                </div></section>


            </div></>)}</>

        );
    }
};
export default Register;