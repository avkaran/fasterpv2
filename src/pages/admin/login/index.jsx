import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import $ from 'jquery';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Spin } from 'antd';
import toast from 'react-hot-toast';
import Pscontext from '../../../context';
import API from '../../../utils/api';
//import { VENDOR_LOGO } from '../../../utils/data';
import AOS from "aos";
import axios from 'axios';

const Login = (props) => {
    const context = useContext(Pscontext);
    const navigate = useNavigate();

    const [validated, setValidated] = useState(false);
    const [loader, setLoader] = useState(false);
    useEffect(() => {
        AOS.init();
        AOS.refresh();
        
    }, []);
    const handleFormSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }
        setLoader(true);
        API.post('admin-login', $("#frm_login").serialize()).then(res => {
            if (res['data'].errorcode === '200') {
                //axios.defaults.headers.common.Authorization = `Bearer ${res['data'].api}`
                axios.defaults.headers.common['Api-Token'] = `${res['data'].api}`;
             
                var allotedId=context.saveAdminLogin(res['data'].data, res['data'].api);
               
                context.updateAdminLogged(allotedId.toString());
                navigate('/'+allotedId.toString() +'/admin');
                setLoader(false);
            }
            else {
                toast.error(res['data'].message || 'Error');
                setLoader(false);
            }
            
        }).catch(er => {

        });

    };


    if (context.adminLogged('test') === 'yes') {
        navigate('/0/admin');
        return null;
    }
    else {
        return (

           

                <Row>
                    <Col md={{ span: 4, offset: 4 }}>


                        <Card className="shadow shadow-lg" data-aos="fade-up">
                            <Card.Body className="px-4 py-5" >
                                <Spin spinning={loader} >

                                    <div className="text-center mb-30">
                                        {/* <img src={VENDOR_LOGO} className="bg-white rounded-3  mb-3" alt="" style={{ width: '150px' }} /> */}
                                        <div className="font-bold mb-3">Admin Login</div>
                                    </div>
                                    <Form noValidate id="frm_login" method="post" validated={validated} onSubmit={handleFormSubmit} >
                                        <Row>
                                            <Col md={12}>
                                                <h6>Please login to your account</h6>
                                            </Col>
                                        </Row>
                                        <Row className="mt-3" >
                                            <Col md={12}>
                                                <Form.Control
                                                    type="text"
                                                    name="username"
                                                    placeholder="Username"
                                                    autoFocus
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mt-3" >
                                            <Col md={12}>
                                                <Form.Control
                                                    type="password"
                                                    name="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="mt-3 text-end" >
                                            <Col md={12}>
                                                <Button type="submit" variant="primary" className="btn-block">
                                                    LOG IN
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>

                                </Spin>
                            </Card.Body>
                        </Card>


                    </Col>
                </Row>

          
        );
    }
};
export default Login;