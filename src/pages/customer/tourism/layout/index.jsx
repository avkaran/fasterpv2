import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams, useLocation, Outlet, Link } from 'react-router-dom';
import $ from 'jquery';
import AOS from "aos";
import PsContext from '../../../../context';
import routes from '../routes';
import { aosInit } from '../../../../utils/data';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message, Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faNewspaper, faUser, faUsers, faArrowRightFromBracket, faCircleInfo, faCalendarDays, faArrowsDownToLine, faArrowUpRightFromSquare, faBars, faHouseMedicalFlag, faHouse } from '@fortawesome/free-solid-svg-icons'
import { green, blue, red, cyan, grey, gold, yellow, volcano, lime, magenta } from '@ant-design/colors';
// import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css'
import '../assets/css/aos.css';
import '../assets/icofont/icofont.min.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/custom.css';
import logo from '../assets/images/logo.png'
import { Spinner } from 'react-bootstrap';
import dayjs from 'dayjs'
const Layouts = (props) => {
    const context = useContext(PsContext);
    const [updateStatus, setUpdateState] = useState(false)
    const [show, setShow] = useState(false);
    const { pathname } = useLocation();
    useEffect(() => {

        /*  if (context.customerLogged !== 'yes') {
             return (<Navigate to="/public/login" />);
         } */
        // AOS.init(aosInit);
        // AOS.refresh();
        //change is_current_plan if have waiting plans
 

        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true)
        }
        );




        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        $("#sidebar").css("visibility", "hidden");
        window.scrollTo(0, 0)
    }, [pathname]);
    const onLogoutClick = () => {
        context.customerLogout();
    }
    const onMobileMenuClick = () => {
        $("#sidebar").css("visibility", "visible");
    }
    const onSideBarBackClick = () => {
        $("#sidebar").css("visibility", "hidden");
    }


    if (context.customerLogged !== 'yes') {
        return (<Navigate to="/public/login" />);
    }
    else {
        return (
            <>
                {!updateStatus && (<div className="text-center" style={{ marginTop: 'calc(30vh)' }} ><Spinner animation="border" /></div>)}
                {updateStatus && (
                    <>
                   {/*  <OtpVerification isOtpVerified={parseInt(context.customerUser.is_otp_verified) === 1} dataItem={context.customerUser} /> */}

                        <div>
                            <div className="fixed-top" style={{ zIndex: '999' }}>
                                {/*  <section className="secondary-header bg-theme">
                                    <div className="row">
                                        <div className="col-md-6" />
                                        <div className="col-md-6">
                                            <div className="text-end font-12 d-none d-sm-block">Call +91-8940150880 (India) |
                                                support@rajmatrimony.com | Live Support</div>
                                            <div className="text-end font-12 d-block d-md-none">Call +91-8940150880 (India) |
                                                support@rajmatrimony.com</div>
                                        </div>
                                    </div>
                                </section> */}
                                <section className="primary-header bg-white">
                                    <div className="row">
                                        <div className="col-md-3"><a href="/"><img src={logo} className="logo" /></a>
                                            <div className="d-block d-sm-none top-menu-link cursor-pointer "><a className="top-menu-link cursor-pointer" onClick={onMobileMenuClick}><i className="icofont-navigation-menu font-28" /></a>
                                            </div>
                                        </div>
                                        <div className="d-none d-sm-block col-md-9">
                                            <div className="d-flex justify-content-end ">
                                                <nav className="nav-menu">
                                                    <ul>
                                                        <li className="nav-item">
                                                            <Link to="/0/customer/dashboard" ><a className="nav-link" >Dashboard</a></Link>
                                                        </li>
                                                        <li className="nav-item"><Link to="/0/customer/mytours" ><a className="nav-link" >Tours</a></Link></li>
                                                        <li className="nav-item"><Link to="/0/customer/myhotels" ><a className="nav-link" >Hotels</a></Link></li>
                                                        <li className="nav-item"><Link to="/0/customer/profile" ><a className="nav-link" >My Profile</a></Link></li>
                                                        <li className="nav-item"><Link to="/0/customer/bookings" ><a className="nav-link" >My Bookings</a></Link></li>
                                                       {/*  <li class="drop-down">
                                                            <a className="nav-link">My Account</a>
                                                            <ul>
                                                                <li><Link to="/0/customer/profile-views/me"><a> My Bookings </a></Link></li>
                                                            </ul>
                                                        </li> */}
                                                       {/*  <li className="nav-item"><Link to="/0/customer/search" ><a className="nav-link" >Search</a></Link></li> */}

                                                        <li className="nav-item"><a className="nav-link" onClick={onLogoutClick}>Logout</a></li>

                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="content">
                                <section>
                                    <div className="container-fluid">
                                        <Outlet />
                                    </div>
                                </section>
                            </div>
                            {/*    <section className="py-50 bg-theme">
                                <div className="container">
                                    <div className="row">
                                        <div className="text-center col-md-12">
                                            <h4 className="text-center text-white font-weight-600 mb-30">Browse by Category</h4>
                                            <div className="mb-10">
                                                <ul className="footer-browse-category">
                                                    <li><a href="#" className="btnc2"> Religion : </a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                </ul>
                                            </div>
                                            <div className="mb-10">
                                                <ul className="footer-browse-category">
                                                    <li><a href="#" className="btnc2"> Caste : </a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                </ul>
                                            </div>
                                            <div>
                                                <ul className="footer-browse-category">
                                                    <li><a href="#" className="btnc2"> State : </a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Christian</a></li>
                                                    <li><a href className="tags">Hindu</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                    <li><a href className="tags">Muslim Offers</a></li>
                                                    <li><a href className="tags">Buddhist</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section> */}
                            <footer>
                                <div className="foot-widg py-50">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-md-2 xs-center col-xs-6">
                                                <div className="font-weight-600 mb-2">Company</div>
                                                <ul className="policy">
                                                    <li> <a href="https://www.azizatourism.com/about-us"> About Us </a> </li>

                                                    <li> <a href="https://www.azizatourism.com/contact-us"> Contact us </a> </li>


                                                </ul>
                                            </div>
                                            <div className="col-md-2 xs-center col-xs-6">
                                                <div className="font-weight-600 mb-2">Policies</div>
                                                <ul className="policy">
                                                    <li> <a href="https://www.azizatourism.com/payment-terms"> Payment Terms </a> </li>
                                                    <li> <a href="https://www.azizatourism.com/cancellation-policy"> Cancellation Policy</a> </li>

                                                </ul>
                                            </div>
                                            <div className="col-md-4 xs-center">
                                                <div className="font-weight-600 mb-2">Address </div>
                                                <ul className="policy ">
                                                    <li><a href="javascript:;">Office no. 122,</a></li>
                                                    <li><a href="javascript:;">Ascon house,Salah Al din road,</a></li>
                                                    <li><a href="javascript:;">Deira, Dubai - UAE</a></li>
                                                    <li><a href="tel:+971502525840"><i className="icofont-phone pe-2" />+971 50 25 25 840</a></li>
                                                    <li><a href="mailto:pakkir.mydeen@gmail.com"><i className="icofont-mail pe-2" /> pakkir.mydeen@gmail.com</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="col-md-3 xs-center">
                                                <div className="font-weight-600 mb-2">Follow Us </div>
                                                <ul className="social">
                                                    <li><a href><i className="icofont-facebook" /></a></li>
                                                    <li><a href="#"><i className="icofont-twitter" /></a></li>
                                                    <li><a href="#"><i className="icofont-instagram" /></a></li>
                                                    <li><a href="#"><i className="icofont-youtube" /></a></li>
                                                    <li><a href="#"><i className="icofont-whatsapp" /></a></li>
                                                </ul>
                                                {/*  <img src="/static/media/online-payment.15c6af5b.png" className="w-75" /> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </footer>
                            <section className=" bg-dark text-white py-10 font-12">
                                <div className="container">
                                    <div className="row">
                                        <div className="col">© 2023 Aziza Tourism</div>
                                        <div className="col">
                                            {/*  <div className="text-end">Designed by <a href="http://peacesoft.in" title="Peace Soft Technologies, Tirunelveli" target="_blank">Peace Soft</a></div> */}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div role="dialog" aria-modal="true" id="sidebar" className="sidebar-home-menu offcanvas offcanvas-end show" tabIndex={-1} style={{ "visibility": 'hidden' }}>
                            <div className="offcanvas-header">
                                <div className="offcanvas-title h5"><a onClick={onSideBarBackClick} className="text-white font-22" style={{ "-webkit-text-decoration": "none", "text-decoration": "none" }}><i className="icofont-arrow-right " /></a></div>
                            </div>
                            <div className="offcanvas-body"><Link to="/public/login"><a className="btn btn-block font-weight-600 border text-white rounded-20">LOGIN</a></Link><Link to="/public/register"><a className="btn btn-block bg-white font-weight-600 border text-theme rounded-20 mt-2" >REGISTER FREE</a></Link>
                                <ul className="menu-link">
                                    <li><a href="https://www.azizatourism.com"> Home </a></li>
                                    <li><a href="https://www.azizatourism.com/about-us"> About Us </a></li>

                                    <li><a href="https://www.azizatourism.com/contact-us"> Contact Us </a></li>

                                    {/* <li><a href="/download-app"> Download App </a></li> */}
                                </ul>
                                <hr />
                                <ul className="social-link">
                                    <li><a href="#"><i className="icofont-facebook" /></a></li>
                                    <li><a href="#"><i className="icofont-twitter" /></a></li>
                                    <li><a href="#"><i className="icofont-instagram" /></a></li>
                                    <li><a href="#"><i className="icofont-youtube" /></a></li>
                                    <li><a href="#"><i className="icofont-whatsapp" /></a></li>
                                </ul>
                            </div>
                        </div>
                    </>
                )}

            </>
        );
    }

};

export default Layouts;