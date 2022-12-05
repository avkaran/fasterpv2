import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route,Outlet } from 'react-router-dom';
import AOS from "aos";
import PsContext from '../../../context';
import Header from './header';
import Sidebar from './sidebar';
import { currentInstance} from '../../../utils';
import { aosInit } from '../../../utils/data';
import axios from 'axios';
import {message} from 'antd'
//addes for testing.
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'antd/dist/antd.css';
import '../../..//assets/css/aos.css';
import '../../..//assets/main.css';
import '../../..//assets/boxicons/css/boxicons.min.css';
import '../../..//assets/themify-icons/css/themify-icons.css';
import '../../..//assets/font-awesome/css/all.css';
import 'react-phone-input-2/lib/style.css'
const Layout = (props) => {
	const context = useContext(PsContext);
	const role =  context.adminUser(props.match.params.userId).role && context.adminUser(props.match.params.userId).role.toLowerCase();
	const [updateStatus, setUpdateState] = useState(false);
	const [currentRoutes,setCurrentRoutes]=useState([]);
	useEffect(() => {
	//	console.log("admin user",context.adminUser(props.match.params.userId))
		AOS.init(aosInit);
		AOS.refresh();
		axios.defaults.headers.common['Api-Token'] = context.adminApi(props.match.params.userId)
		context.updateGlobal().then((res) => {
			if (res) setUpdateState(true)
		}
		).catch((error) => {
			message.error(error)
		});
		import('../../admin/business/'+currentInstance.name+'/routes').then((module)=>{
			setCurrentRoutes(module.default);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		AOS.refresh();
	}, [props.location.pathname]);

	if (context.adminLogged(props.match.params.userId) !== 'yes') {
		return (<Navigate to="/a/admin-login" />);
	}
	else {
		return (
			<>{updateStatus && (<div className="" >
				<div className="page-wrapper">

					<Header />

					<Sidebar role={role} user={props.match.params.userId}/>
					
					<div className="content-wrapper" data-aos="fade-up" >
						<Outlet />
					</div>
				
				</div>
			</div>)}</>
		);
	}
};

export default Layout;