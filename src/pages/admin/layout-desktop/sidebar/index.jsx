import React,{useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import {currentInstance} from '../../../../utils'
import NavBar from './NavBar';
const Sidebar=(props)=>{
	const [currentNav,setCurrentNav]=useState([]);
	useEffect(() => {
		
		import('../../business/'+currentInstance.name+'/nav').then((module)=>{
			setCurrentNav(module.default);
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return(
		<React.Fragment>
			
			<nav className="page-sidebar" id="sidebar">
				<div id="sidebar-collapse">
					{/*<div className="admin-block d-flex ">
						<div>
							{/*<img src="https://technext.github.io/admincast/assets/img/admin-avatar.png" width="45px" />*/}
						{/*</div>
						<div className="admin-info">
							<div className="font-strong">{context.adminUser(userId).department_name}</div><small>{context.adminUser(userId).deptype}</small></div>
    </div>*/}
    <hr className='my-1' />
					<ul className="side-menu metismenu" >
					<NavBar menus={currentNav} user={props.user}  role={props.role}/>
					</ul>

				</div>
			</nav>
			
		</React.Fragment>
	);
};

export default Sidebar;