import React from 'react';
import { useParams } from 'react-router-dom';

import {currentNav} from '../../../../../utils'
import img1 from '../../css/images/blog/01.jpg';
import img2 from '../../css/images/blog/02.jpg';
import img3 from '../../css/images/blog/03.jpg';
import footer from '../../css/images/map-footer.png';

/*import "../../css/js/jquery.min.js";
import "../../css/js/tether.min.js";

import "../../css/js/jquery.easing.js";
import "../../css/js/jquery-waypoints.js";
import "../../css/js/jquery-validate.js";

import "../../css/js/owl.carousel.js";
import "../../css/js/numinate.min6959.js?ver=4.9.3";
import "../../css/js/main.js";

import "../../css/js/jquery.themepunch.revolution.min.js";
import "../../css/js/slider.js";

import "../../css/js/extensions/revolution.extension.actions.min.js";
import "../../css/js/extensions/revolution.extension.carousel.min.js";
import "../../css/js/extensions/revolution.extension.kenburn.min.js";
import "../../css/js/extensions/revolution.extension.layeranimation.min.js";
import "../../css/js/extensions/revolution.extension.migration.min.js";
import "../../css/js/extensions/revolution.extension.navigation.min.js";
import "../../css/js/extensions/revolution.extension.parallax.min.js";
import "../../css/js/extensions/revolution.extension.slideanims.min.js";
import "../../css/js/extensions/revolution.extension.video.min.js";*/

const Footer=(props)=>{
	return(
		<React.Fragment>			
		<footer class="footer widget-footer clearfix">
        
        <div class="second-footer ttm-textcolor-white">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 widget-area">
                        <div class="widget widget_text  clearfix">
                            <h3 class="widget-title">About IMA NHB</h3>
                            <div class="textwidget widget-text">
                                The NHB was born in the year 1987 on 1st April. Necessitated at the time by the three fold increase in the Nursing Home Municipal Taxation.
                                <br/><br/>
                                <div class="social-icons circle social-hover">
                                    <ul class="list-inline">
                                        <li class="social-facebook"><a class="tooltip-top" target="_blank" href="#" data-tooltip="Facebook"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                                        <li class="social-twitter"><a class="tooltip-top" target="_blank" href="#" data-tooltip="Twitter"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                                        <li class="social-flickr"><a class=" tooltip-top" target="_blank" href="#" data-tooltip="flickr"><i class="fa fa-flickr" aria-hidden="true"></i></a></li>
                                        <li class="social-linkedin"><a class=" tooltip-top" target="_blank" href="#" data-tooltip="LinkedIn"><i class="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                    </ul>
                                </div>
                                <br/>
                                <div class="mb-20">
                                    <a class="ttm-btn ttm-btn-size-xs ttm-btn-shape-square ttm-btn-style-fill ttm-btn-bgcolor-skincolor ttm-btn-color-white" href="about.php">READ MORE</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 widget-area">
                        <div class="widget widget_nav_menu clearfix">
                           <h3 class="widget-title">Quick Links</h3>
                            <ul id="menu-footer-services">
                                <li><a href="registration.php">Register Now</a></li>
                                <li><a href="registration.php">Renew Now</a></li>
                                <li><a href="forms.php">Formats</a></li>
                                <li><a href="events-blog.php">Events</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 widget-area">
                        <div class="widget widget_text clearfix">
                            <h3 class="widget-title">Latest News</h3>
                          {/*  <ul class="widget-post ttm-recent-post-list">
                                <li>
                                    <a href="single-blog.html"><img src={img1} alt="post-img"/></a>
                                    <span class="post-date">May 01, 2022</span>
                                    <a href="single-blog.html">Successful Growth In Membership 2022</a>
                                </li>
                                <li>
                                    <a href="single-blog.html"><img src={img2} alt="post-img"/></a>
                                    <span class="post-date">May 03, 2022</span>
                                    <a href="single-blog.html">Achieving Best Service Awards</a>
                                </li>
                                <li>
                                    <a href="single-blog.html"><img src={img3}alt="post-img"/></a>
                                    <span class="post-date">May 05, 2019</span>
                                    <a href="single-blog.html">Seminar for Best Hospital management Strategy</a>
                                </li>
                            </ul>*/}
                        </div>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-6 col-lg-3 widget-area">
                        <div class="widget flicker_widget clearfix">
                           <h3 class="widget-title">Our Office</h3>
                           <div class="textwidget widget-text">
                                <img src={footer} class="img-fluid" alt="map-footer"/>
                                <br/>
                                <br/>
                                <ul class="ttm-our-location-list">
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-footer-text ttm-textcolor-white">
            <div class="container">
                <div class="row copyright">
                    <div class="col-md-12">
                        <div class="">
                            <span>Copyright © 2022&nbsp;<a href="#">IMA NHB</a>. All rights reserved.</span>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <ul id="menu-footer-menu" class="footer-nav-menu">
                            <li><a href="about.php">About Us</a></li>
                            <li><a href="about.php">Services</a></li>
                            <li><a href="#">Terms & Privacy</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
	<a id="totop" href="#top">
        <i class="fa fa-angle-up"></i>
    </a>
		</React.Fragment>
	);
};

export default Footer;