import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams } from 'react-router-dom';
import $ from 'jquery';
import AOS from "aos";
import PsContext from '../../../../context';
import routes from '../routes';
import { aosInit } from '../../../../utils/data';
import { Row, Col, Card, Form, Button, Input, Select, Space, DatePicker } from 'antd';
import { Spin, message, Popconfirm } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faNewspaper, faUser, faUsers, faArrowRightFromBracket, faCircleInfo, faCalendarDays, faArrowsDownToLine, faArrowUpRightFromSquare,faBars, faHouseMedicalFlag, faHouse } from '@fortawesome/free-solid-svg-icons'
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
import Header from './header';
import Footer from './footer';


const Layouts = (props) => {
    const context = useContext(PsContext);
    const role = context.customerUser.role && context.customerUser.role.toLowerCase();
    const [updateStatus, setUpdateState] = useState(false)

    useEffect(() => {
        if (context.customerLogged !== 'yes') {
            return (<Navigate to="/public/login" />);
        }
        AOS.init(aosInit);
        AOS.refresh();
        context.updateGlobal().then((res) => {
            if (res) setUpdateState(true)
        }
        );
      
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        AOS.refresh();
    }, [props.location.pathname]);
    const onLogoutClick=()=>{
        context.customerLogout();	
    }
    
   
 
        return (
            <> {context.customerLogged == 'yes' && updateStatus && (
              <><OtpVerification isOtpVerified={parseInt(context.customerUser.is_otp_verified)===1} dataItem={context.customerUser}/> 
              <div class="page">
	            <Header />
                {role ? routes.map(item => item.allowed.indexOf(role) > -1 && (<Route key={item.title}  {...item} />)) :  routes.map(item => (<Route key={item.title}  {...item} />))}                
	            <Footer />
            </div>
              </>
                )}
             
            </>
        );
  
};

export default Layouts;