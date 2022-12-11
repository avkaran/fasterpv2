import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';
import $ from 'jquery';
import AOS from "aos";
import PsContext from '../../../../context';
import customerRoutes from '../routes';
import { aosInit } from '../../../../utils/data';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message, Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faNewspaper, faUser, faUsers, faArrowRightFromBracket, faCircleInfo, faCalendarDays, faArrowsDownToLine, faArrowUpRightFromSquare,faBars } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/images/logo.png';
import mobileLogo from '../assets/images/mobile-logo.png';
import { green, blue, red, cyan, grey, gold, yellow,volcano,lime,magenta } from '@ant-design/colors';
import '../../../../assets/themify-icons/css/themify-icons.css';
import "../css/style.css";
// import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css'
import { faImages,faHeart } from '@fortawesome/free-regular-svg-icons';
import avg from '../../../../assets/images/avatar.jpg';
import { MyButton } from '../../../../comp';
import OtpVerification from '../profile/otpVerification';
import CustomerPayment from '../profile/customerPayment';
const Layout = (props) => {
    const context = useContext(PsContext);
    const role = context.customerUser.role && context.customerUser.role.toLowerCase();
    const [updateStatus, setUpdateState] = useState(false)
    useEffect(() => {
        AOS.init(aosInit);
        AOS.refresh();
       
        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true);
           
        }
        );
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        AOS.refresh();
        if($("#sidebar_navigation_links").hasClass('nav-active')){
            $("#sidebar_navigation_links").removeClass("nav-active");
        }
    }, [props.location.pathname]);
    const onLogoutClick=()=>{
        context.customerLogout();	
    }

    const mobileNavClick = () =>{ 
        
        if($("#sidebar_navigation_links").hasClass('nav-active')){
            $("#sidebar_navigation_links").removeClass("nav-active");
        }
        else{
            $("#sidebar_navigation_links").addClass("nav-active");
        }
    }

    if (context.customerLogged !== 'yes') {
        return (<Navigate to="/member-login" />);
    }
    else {
        return (
            <>{updateStatus && (<div className="color-theme-blue mont-font loaded">
             {/*
             old code if otp completed only then processed next, ie, no skip
                 <OtpVerification isOtpVerified={parseInt(context.customerUser.is_otp_verified)===1} dataItem={context.customerUser}/> 
             {
                parseInt(context.customerUser.is_otp_verified)===1 && (<CustomerPayment isUnpaid={context.customerUser.payment_status!=='paid'} dataItem={context.customerUser}></CustomerPayment>)
             } */}
             <OtpVerification isOtpVerified={parseInt(context.customerUser.is_otp_verified)===1} dataItem={context.customerUser}/> 
             <CustomerPayment isUnpaid={context.customerUser.payment_status!=='paid'} dataItem={context.customerUser}></CustomerPayment>
             
              
                <div class="main-wrapper">
                    <div class="nav-header bg-white shadow-xs border-0">
                        <div class="">
                            <a href="/customer"><img src={context.isMobile?mobileLogo:logo} alt="MTC-24"/> </a>
                            {/*  //mobile menu
                            <a href="#" class="mob-menu ms-auto me-2 chat-active-btn"><i class="feather-message-circle text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
                            <a href="default-video.html" class="mob-menu me-2"><i class="feather-video text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
                            <a href="#" class="me-2 menu-search-icon mob-menu"><i class="feather-search text-grey-900 font-sm btn-round-md bg-greylight"></i></a>
                            <button class="nav-menu me-0 ms-2"></button> */}
                        </div>
                        <a href={"0/customer"} class="p-2 text-center ms-3 menu-icon center-menu-icon"><FontAwesomeIcon icon={faHome} /></a>
                        <a href={"0/customer/editprofile"} class="p-2 text-center ms-0 menu-icon center-menu-icon"><FontAwesomeIcon icon={faNewspaper} /></a>
                        <a href={"0/customer/gallery"} class="p-2 text-center ms-0 menu-icon center-menu-icon"><FontAwesomeIcon icon={faImages} /></a>
                        <a href={"0/customer/profile"} class="p-2 text-center ms-0 menu-icon center-menu-icon"><FontAwesomeIcon icon={faUser} /></a>
                        <a href={"0/customer/members"} class="p-2 text-center ms-0 menu-icon center-menu-icon"><FontAwesomeIcon icon={faUsers} /></a>
                        <Input.Search placeholder="Search" className='top_search_header'//onSearch={onSearch} 

                            enterButton />
                        <a href="#aa" class="p-2 text-center ms-auto menu-icon" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false">{/* <img src={context.customerUser.photo?context.baseUrl+context.customerUser.photo:context.noImg} alt="user" class="w40 mt--1" /> */}</a>
                          
                        <Popconfirm
                            title="Are you sure to logout?"
                            onConfirm={onLogoutClick}
                          //  onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                        >
                           <MyButton type="outlined" shape="circle" borderColor={red[6]}><FontAwesomeIcon icon={faArrowRightFromBracket} /></MyButton>
                        </Popconfirm>

                        <a href="javascript:;" className="top_nav_signout" onClick={e => mobileNavClick()}>
                                <FontAwesomeIcon icon={faBars} />
                        </a>
                    </div>
                    
                        { /* if class="navigation scroll-bar nav-active" mobile view sidebar
                        else class="navigation scroll-bar" */}
                    
                    <nav class="navigation scroll-bar" id="sidebar_navigation_links">
                        <div class="container ps-0 pe-0">
                            <div class="nav-content">
                                <div class="nav-wrap bg-white bg-transparent-card rounded-xxl shadow-xss pt-3 pb-1 mb-2 mt-2">
                                    <div class="nav-caption fw-600 font-xssss text-grey-500">Navigation</div>
                                    <ul class="mb-1 top-content">
                                        <li class="logo d-none d-xl-block d-lg-block"></li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={green[5]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faUser} /></MyButton><a href={"0/customer/dashboard"} class="nav-content-bttn open-font" >Dashboard</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={red[5]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faUser} /></MyButton><a href={"0/customer/editprofile"} class="nav-content-bttn open-font" >My Profile</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={magenta[5]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faUsers} /></MyButton><a href={"0/customer/members"} class="nav-content-bttn open-font" >Members</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={blue[8]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faHeart} /></MyButton><a href={"0/customer/matrimony"} class="nav-content-bttn open-font" >Matrimony</a>
                                            </Space>
                                        </li><li>
                                            <Space>
                                                <MyButton type="primary" color={volcano[8]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></MyButton><a href={"0/customer/express-interest/sent"} class="nav-content-bttn open-font" >Interest Sent</a>
                                            </Space>
                                        </li><li>
                                            <Space>
                                                <MyButton type="primary" color={lime[8]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faArrowsDownToLine} /></MyButton><a href={"0/customer/express-interest/received"} class="nav-content-bttn open-font" >Interest Received</a>
                                            </Space>
                                        </li>
                                        
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={blue[8]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faNewspaper} /></MyButton><a href={"0/customer"} class="nav-content-bttn open-font" >Articles</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={cyan[6]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faCircleInfo} /></MyButton><a href={"0/customer/announcements"} class="nav-content-bttn open-font" >Announcements</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>
                                                <MyButton type="primary" color={gold[5]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faCalendarDays} /></MyButton><a href={"0/customer/events"} class="nav-content-bttn open-font" >Events</a>
                                            </Space>
                                        </li>
                                        <li>
                                            <Space>

                                                <MyButton type="primary" color={green[6]} shape="circle" size="large">
                                                    <FontAwesomeIcon icon={faImages} /></MyButton><a href={"0/customer/gallery"} class="nav-content-bttn open-font" >Gallery</a>
                                            </Space>
                                        </li>



                                    </ul>
                                </div>


                            </div>
                        </div>
                    </nav>
                    {customerRoutes.map(item => item.allowed.indexOf(role) > -1 && (<Route key={item.title}  {...item} />))}
                </div>
              
            </div>)}
                           
            </>
        );
    }
};

export default Layout;