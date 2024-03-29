import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams, useNavigate,Outlet } from 'react-router-dom';
import AOS from "aos";
import PsContext from '../../../context';
import Sidebar from './sidebar';
import { currentInstance } from '../../../utils';
import { aosInit } from '../../../utils/data';
import axios from 'axios';
import { message } from 'antd'
//addes for testing.
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'antd/dist/antd.css';
import '../../../assets/css/aos.css';
import '../../../assets/font-awesome/css/all.css';
import '../../../assets_mobile/css/styleae52.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faClose } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import HomeContainer from './homeContainer';
const Layout = (props) => {
	const context = useContext(PsContext);
const {userId}=useParams();
	const role = context.adminUser(userId).role && context.adminUser(userId).role.toLowerCase();
	const [updateStatus, setUpdateState] = useState(false);
	const [currentRoutes, setCurrentRoutes] = useState([]);
	const [visibleSideBar, setVisibleSideBar] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		//	console.log("admin user",context.adminUser(userId))
		AOS.init(aosInit);
		AOS.refresh();
		axios.defaults.headers.common['Api-Token'] = context.adminApi(userId)
		context.updateGlobal().then((res) => {
			if (res) setUpdateState(true)
		}
		).catch((error) => {
			message.error(error)
		});
		/* import('../../admin/business/' + currentInstance.name + '/routes').then((module) => {
			setCurrentRoutes(module.default);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps */
	}, []);


	if (context.adminLogged(userId) !== 'yes') {
		return (<Navigate to="/a/admin-login" />);
	}
	else {
		return (
			<>{updateStatus && (<>
				
				<Outlet />

			</>

			)}</>
		);
	}
};

export default Layout;