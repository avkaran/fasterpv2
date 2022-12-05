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
import { apiRequest, decrypt, encrypt } from "../../../../models/core";
import { ViewItem } from "../../../../comp";
import { green, red } from '@ant-design/colors';
import queryString from 'query-string';
import { getLs, setLs, RemoveLs } from '../../../../utils'
const CustomerVerifyEmail = (props) => {
    const context = useContext(PsContext);
    const [registerForm] = Form.useForm();
    const [loginForm] = Form.useForm();
    const navigate = useNavigate();
    const [updateStatus, setUpdateState] = useState(false)
    const [registerLoader, setRegisterLoader] = useState(false);
    const [loginLoader, setLoginLoader] = useState(false);
    const [viewData, setViewData] = useState(null);
    const [isInvalid, setIsInvalid] = useState(null);
    useEffect(() => {
        AOS.init();
        AOS.refresh();
        //loadData();
        var qString = queryString.parse(props.location.search);
        if (qString.q) {
            try{
            var id=decrypt(qString.q);
           // console.log('id',id)
            UpdateEmailVerification(id);
           
            }catch(ex){
                setIsInvalid(true)
            }
           
        } else setIsInvalid(true);
        context.updateGlobal().then((res) => {
            if (res) {
                setUpdateState(true);
            }
        }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const UpdateEmailVerification = (id) => {
        var reqData = {
            query_type: 'update',
            table: 'users',
            where: { id: id },
            values: { is_email_verified: 1 }
        };

        apiRequest(reqData, "prod").then((res) => {
            //  setActivateTemplate(res[0][0]);
            //   setViewData(res[1][0]);
            //   console.log('view user', res)
            //logout if logged in.
            //
            setLs('customer_login_data', false);
           // setCustomerUser([]);
            setLs('customer_api', '');
          //  setCustomerApi(null);
            axios.defaults.headers.common['Api-Token'] = '';
            setLs('customer_logged', 'no');
            context.customerLogout()
           // setCustomerLogged('no');
            message.success("Email Verified")
            navigate("/member-login")
        }).catch(err => {
            message.error(err);

        })
    }
   
    return (

        <> {updateStatus && (<><div className="container " style={{ marginTop: '6%' }}>
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
                            isInvalid && (<span style={{ fontSize: '20px', color: red[6] }}>Invalid Url/Already Verified</span>)
                        }
                        {
                            !isInvalid && (<span style={{ fontSize: '20px', color: green[6] }}>Verifying Email...</span>)
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
            </footer></>)}</>

    );

};
export default CustomerVerifyEmail;