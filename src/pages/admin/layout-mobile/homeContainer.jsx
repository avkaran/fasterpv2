import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, useParams, useNavigate,useLocation } from 'react-router-dom';
import AOS from "aos";
import PsContext from '../../../context';
import Sidebar from './sidebar';
import { currentInstance } from '../../../utils';
import { aosInit } from '../../../utils/data';
import axios from 'axios';
import { message } from 'antd'
//addes for testing.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faClose } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
const HomeContainer = (props) => {
    const context = useContext(PsContext);
    const navigate = useNavigate();
	const { pathname } = useLocation();
    const {role,userId,...other } = props;
    const [visibleSideBar, setVisibleSideBar] = useState(false);
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
		setVisibleSideBar(false)
	}, [pathname]);
    const log_out=()=>{
		toast((t) => (
			<span>
			  Do you want to logout ? 
			  <button onClick={()=>executeLogoutCall(t)} className="border text-success bg-light ms-2 me-2 font-12 font-weight-600" >
				Yes
			  </button>
			  <button onClick={() => toast.dismiss(t.id)} className="border text-danger bg-light ms-2 me-2 font-12 font-weight-600" >
				No
			  </button>
			</span>
		  ));
		  
	};
	const executeLogoutCall=(t)=>{
		context.adminLogout(userId);	
		toast.dismiss(t.id);	
		navigate('/a/admin-login')
	};
    return (
        <>
           <div className="appHeader bg-primary text-light">
					<div className="left">
						<a
							onClick={() => setVisibleSideBar(true)}
							className="headerButton"

						>
							<FontAwesomeIcon icon={faBars} />
						</a>
					</div>
					<div className="pageTitle">
						<img src={context.baseUrl + "public/mobileapp-logo.png"} alt="logo" className="logo" />
					</div>
					<div className="right">
						<a href="app-notifications.html" className="headerButton">
							<FontAwesomeIcon icon={faBell} />
							<span className="badge badge-danger">4</span>
						</a>
						<a onClick={log_out} className="headerButton">
							<img
								src={context.noMale}
								alt="image"
								className="imaged w32"
							/>
							<span className="badge badge-danger">6</span>
						</a>
					</div>
				</div>
				<div id="appCapsule">
					{
						props.children
					}
				</div>
				<div className="appBottomMenu">
					<a href="app-index.html" className="item active">
						<div className="col">
							<ion-icon name="pie-chart-outline" />
							<strong>Overview</strong>
						</div>
					</a>
					<a href="app-pages.html" className="item">
						<div className="col">
							<ion-icon name="document-text-outline" />
							<strong>Pages</strong>
						</div>
					</a>
					<a href="app-components.html" className="item">
						<div className="col">
							<ion-icon name="apps-outline" />
							<strong>Components</strong>
						</div>
					</a>
					<a href="app-cards.html" className="item">
						<div className="col">
							<ion-icon name="card-outline" />
							<strong>My Cards</strong>
						</div>
					</a>
					<a href="app-settings.html" className="item">
						<div className="col">
							<ion-icon name="settings-outline" />
							<strong>Settings</strong>
						</div>
					</a>
				</div>
				<Sidebar role={role} user={userId} show={visibleSideBar} onClose={() => setVisibleSideBar(false)} />

        </>
    );

};

export default HomeContainer;