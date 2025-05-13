import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams, Outlet, useLocation, Link } from 'react-router-dom';
import $ from 'jquery';
import AOS from "aos";
import PsContext from '../../../../context';
import routes from '../public-routes';
import { aosInit } from '../../../../utils/data';
import { Spin } from 'antd';
import logo from '../assets/images/logo.png'
// import 'antd/dist/antd.css';
import 'react-phone-input-2/lib/style.css'
//import '../assets/css/aos.css';
import '../assets/icofont/icofont.min.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/custom.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Spinner } from 'react-bootstrap';
import { Button, Checkbox, Space, DatePicker } from 'antd';
import { MyButton } from '../../../../comp';

const Layouts = (props) => {
    const context = useContext(PsContext);
    const [updateStatus, setUpdateState] = useState(false)
    const { pathname } = useLocation();
    useEffect(() => {
        // AOS.init(aosInit);
        // AOS.refresh();
        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true)
        }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getBrands = () => {
        let m = context.psGlobal.collectionData.find(item => item.name === 'product-brand');
        let cData = m.collections.split(",");
        return cData.map(item => <li>
            <Link className="dropdown-item" to={`/public/products-by-brand/${item}`}>{item}</Link>
        </li>)
    }
    useEffect(() => {
        $("#sidebar").css("visibility", "hidden");
        window.scrollTo(0, 0)
    }, [pathname]);
    const onMobileMenuClick = () => {
        $("#sidebar").css("visibility", "visible");
    }
    const onSideBarBackClick = () => {
        $("#sidebar").css("visibility", "hidden");
    }
    if (context.customerLogged === 'yes') {
        return (<Navigate to="/0/customer/dashboard" />);
    }
    else {
        return (
            <>
                {!updateStatus && (<div className="text-center" style={{ marginTop: 'calc(30vh)' }} ><Spinner animation="border" /></div>)}
                {updateStatus && (
                    <><div>
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
                                                        <a className="nav-link" href="https://www.fat2fit.ae.org/" style={{ fontWeight: "bold" }}>
                                                            Home
                                                        </a>
                                                    </li>

                                                    <li className="nav-item">
                                                        <Link to="/public/products">
                                                            <a className="nav-link" style={{ fontWeight: "bold" }}>Catalog</a>
                                                        </Link>
                                                    </li>

                                                    {/* Products Dropdown */}
                                                    <li className="nav-item dropdown">
                                                        <a
                                                            className="nav-link dropdown-toggle"
                                                            href="#"
                                                            id="productsDropdown"
                                                            role="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                            style={{ fontWeight: "bold" }}
                                                        >
                                                            Products
                                                        </a>
                                                        <ul className="dropdown-menu" aria-labelledby="productsDropdown">
                                                            {getBrands()}
                                                        </ul>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/public/collections">
                                                            <a className="nav-link" style={{ fontWeight: "bold" }}>All Collections</a>
                                                        </Link>
                                                    </li>

                                                    <li className="nav-item">
                                                        <a className="nav-link" href="https://www.fat2fit.ae.org/contact-us" style={{ fontWeight: "bold" }}>
                                                            Contact Us
                                                        </a>
                                                    </li>
                                                    <li className="nav-item">
                                                    <Link to="/public/cart">
                                                        <a><i class="icofont-cart"></i> Cart</a>
                                                    </Link>
                                                    </li>
                                                </ul>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="content">
                            <Outlet />
                        </div>
                        {/* <section className="py-50 bg-theme">
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
                                                <li> <a href="https://www.fat2fit.ae.org/about-us"> About Us </a> </li>

                                                <li> <a href="https://www.fat2fit.ae.org/contact-us"> Contact us </a> </li>


                                            </ul>
                                        </div>
                                        <div className="col-md-2 xs-center col-xs-6">
                                            <div className="font-weight-600 mb-2">Policies</div>
                                            <ul className="policy">
                                                <li> <a href="https://www.fat2fit.ae.org/payment-terms"> Payment Terms </a> </li>
                                                <li> <a href="https://www.fat2fit.ae.org/cancellation-policy"> Cancellation Policy</a> </li>

                                            </ul>
                                        </div>
                                        <div className="col-md-4 xs-center">
                                            <div className="font-weight-600 mb-2">Address </div>
                                            <ul className="policy ">
                                                <li><a href="javascript:;">Addres line 1,</a></li>
                                                <li><a href="javascript:;">addrss line 2</a></li>
                                                <li><a href="javascript:;">address 3, Dubai - UAE</a></li>
                                                <li><a href="tel:+971502525840"><i className="icofont-phone pe-2" />+000 00 00 00 000</a></li>
                                                <li><a href="mailto:pakkir.mydeen@gmail.com"><i className="icofont-mail pe-2" /> you@yourmail.com</a>
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
                                    <div className="col">© 2023 Fat2Fit</div>
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
                            <div className="offcanvas-body">
                                {/* <Link to="/public/login"><a className="btn btn-block font-weight-600 border text-white rounded-20">LOGIN</a></Link><Link to="/public/register"><a className="btn btn-block bg-white font-weight-600 border text-theme rounded-20 mt-2" >REGISTER FREE</a></Link> */}

                                <ul className="menu-link">
                                    <li><a href="https://www.fat2fit.ae.org"> Home </a></li>
                                    <li><Link to="/public/tours"><a> Products </a></Link></li>
                                    <li><a href="https://www.fat2fit.ae.org/about-us"> About Us </a></li>

                                    <li><a href="https://www.fat2fit.ae.org/contact-us"> Contact Us </a></li>

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
                    </>)
                }

            </>

        );
    }

};

export default Layouts;