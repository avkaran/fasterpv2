import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Route, Routes,Outlet } from 'react-router-dom';
import $ from 'jquery';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Spin } from 'antd';
import toast from 'react-hot-toast';
import Pscontext from '../../../context';
import API from '../../../utils/api';

//import { VENDOR_LOGO } from '../../../utils/data';
import AOS from "aos";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
//// import 'antd/dist/antd.css';
import '../../../assets/css/aos.css';
import '../../../assets/main.css';
import '../../../assets/boxicons/css/boxicons.min.css';
import '../../../assets/themify-icons/css/themify-icons.css';
import '../../../assets/font-awesome/css/all.css';
const AdminLogin = React.lazy(() => import('../login'));
const AdminPublicLayout = (props) => {
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
                var allotedId = context.saveAdminLogin(res['data'].data, res['data'].api);
                context.updateAdminLogged(allotedId.toString());
                navigate('/' + allotedId.toString() + '/admin');
            }
            else {
                toast.error(res['data'].message || 'Error');
            }
            setLoader(false);
        }).catch(er => {

        });

    };

    if (context.adminLogged('test') === 'yes') {
        navigate('/0/admin');
        return null;
    }
    else {
        return (
            <div className="container " style={{ marginTop: '6%' }}>
                <Outlet />
            </div>
        );
    }
};
export default AdminPublicLayout;