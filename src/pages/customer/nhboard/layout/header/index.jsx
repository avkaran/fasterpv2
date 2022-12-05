import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Logout from './Logout';
import UserProfile from './UserProfile';
import TopMenu from './TopMenu';
import CompanyTitle from './CompanyTitle';
import { currentInstance } from '../../../../../utils';
import { businesses } from '../../../../../utils';
import PsContext from '../../../../../context';
import { useNavigate } from 'react-router-dom';
import "../../css/css/animate.css";
import "../../css/css/owl.carousel.css";
import "../../css/css/flaticon.css";
import "../../css/css/prettyPhoto.css";
import "../../css/css/shortcodes.css";
import "../../css/css/main.css";
import "../../css/css/responsive.css";
import "../../css/css/layers.css";
import "../../css/css/settings.css";
import "../../css/css/font-awesome.css";
import "../../css/css/bootstrap.min.css";


const Header = (props) => {

	useEffect(() => {

		
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location.pathname]);

	
	
	
	return (
		<React.Fragment>
			<Helmet>
				
			</Helmet>
			<header id="masthead" class="header ttm-header-style-classic">
			<div class="ttm-topbar-wrapper ttm-bgcolor-darkgrey ttm-textcolor-white clearfix">
                <div class="container">
                    <div class="ttm-topbar-content">
                        <ul class="top-contact ttm-highlight-left text-left">
                            <li><i class="fa fa-clock-o"></i><strong> Registration / Renewal</strong> </li>
                        </ul>
                        <div class="topbar-right text-right">
                            <ul class="top-contact">
                                <li><i class="fa fa-envelope-o"></i><a href="mailto:info@example.com.com">admin@imanhb.org</a></li>
                                <li><i class="fa fa-phone"></i>+91 75488 25544</li>
								<li><i class="fa fa-question-circle"></i>FAQ</li>
                            </ul>
                            <div class="ttm-social-links-wrapper list-inline">
                                <ul class="social-icons">
                                    <li><a href="#"><i class="fa fa-facebook"></i></a>
                                    </li>
                                    <li><a href="#"><i class="fa fa-twitter"></i></a>
                                    </li>
                                    <li><a href="#"><i class="fa fa-flickr"></i></a>
                                    </li>
                                    <li><a href="#"><i class="fa fa-linkedin"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ttm-header-wrap">
                <div id="ttm-stickable-header-w" class="ttm-stickable-header-w clearfix">
                    <div id="site-header-menu" class="site-header-menu">
                        <div class="site-header-menu-inner ttm-stickable-header">
                        <TopMenu/>
                        </div>
                    </div>
                </div>
            </div>
        </header>		


		</React.Fragment>
	);
};

export default Header;