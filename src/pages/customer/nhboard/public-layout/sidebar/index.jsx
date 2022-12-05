import React from 'react';
import { withRouter } from 'react-router-dom';

import {currentNav} from '../../../../../utils'
import NavBar from './NavBar';
const Sidebar=(props)=>{
	return(
		<React.Fragment>
			
			<nav className="page-sidebar" id="sidebar">
				<div id="sidebar-collapse">
					{/*<div className="admin-block d-flex ">
						<div>
							{/*<img src="https://technext.github.io/admincast/assets/img/admin-avatar.png" width="45px" />*/}
						{/*</div>
						<div className="admin-info">
							<div className="font-strong">{context.adminUser(props.match.params.userId).department_name}</div><small>{context.adminUser(props.match.params.userId).deptype}</small></div>
    </div>*/}
    <hr className='my-1' />
					<ul className="side-menu metismenu" >
					<NavBar menus={currentNav}   role={props.role}/>
					</ul>

				</div>
			</nav>
			
		</React.Fragment>
	);
};

export default Sidebar;