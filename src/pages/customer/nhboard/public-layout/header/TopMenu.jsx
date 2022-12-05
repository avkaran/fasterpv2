import React, { useContext } from 'react';
import { Navigate, withRouter, Link, useNavigate } from 'react-router-dom';
import logo from '../../css/images/logo.png';
import mobileLogo from '../../assets/images/mobile-logo.png';
import { Nav, NavDropdown } from 'react-bootstrap';
import PsContext from '../../../../../context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faNewspaper, faUser, faUsers, faArrowRightFromBracket, faCircleInfo, faCalendarDays, faArrowsDownToLine, faArrowUpRightFromSquare, faBars, faHouseMedicalFlag, faHouse } from '@fortawesome/free-solid-svg-icons'
import { faImages, faHeart } from '@fortawesome/free-regular-svg-icons';
import { MyButton } from '../../../../../comp';
import { Spin, message, Popconfirm } from 'antd';


const TopMenu = (props) => {

	const context = useContext(PsContext);
	const navigate = useNavigate();
	const getTitle = () => {
		return <div style={{
			fontSize: '12px',
			fontWeight: '600'
		}}>
			{context.adminUser(props.match.params.userId).employee_name}
			{/*<span className='font-12 ms-2'>({capitalizeFirst(context.adminUser(props.match.params.userId).deptype)})</span>*/}
		</div>;
	}
	const onLogoutClick = () => {
		context.customerLogout();
		navigate(context.baseAPIUrl + "login");
	}
	console.log(context.baseAPIUrl);
	return (
		<React.Fragment><Popconfirm
			title="Are you sure to logout?"
			onConfirm={onLogoutClick}
			//  onCancel={cancel}
			okText="Yes"
			cancelText="No"
		>

		</Popconfirm>
			<div class="container">
				<div class="site-branding">
					<a class="home-link" href="index.php" title="Fondex" rel="home">
						<img id="logo-img" class="img-center" src={context.isMobile ? mobileLogo : logo} alt="logo-img"></img>
					</a>
				</div>

				<div id="site-navigation" class="site-navigation">
					<div class="ttm-rt-contact">

					</div>
					<div class="ttm-menu-toggle">
						<input type="checkbox" id="menu-toggle-form" />
						<label for="menu-toggle-form" class="ttm-menu-toggle-block">
							<span class="toggle-block toggle-blocks-1"></span>
							<span class="toggle-block toggle-blocks-2"></span>
							<span class="toggle-block toggle-blocks-3"></span>
						</label>
					</div>
					<nav id="menu" class="menu">
						{context.customerLogged !== 'yes' ?
							<ul class="dropdown">
								<li class="active"><a href="https://imanhb.org/index.php">Home</a></li>
								<li><a href="https://imanhb.org/about.php">About Us</a> </li>
								<li><a href={"#/public/register"}>Registration</a></li>
								<li><a href="https://imanhb.org/events-blog.php">Events</a></li>
								<li><a href="https://imanhb.org/forms.php">Norms & Forms</a></li>
								<li><a href="#">Notifications</a></li>
								<li> <a href={"#/public/login"}>Login</a></li>
							</ul>
							:
							<ul class="dropdown">
								<li class="active"><a href="https://imanhb.org/index.php">Home</a></li>
								<li class="dropdown-height">
									<NavDropdown title="PROFILE"> </NavDropdown>
									<ul class="dropdown" id="nav-dropdown">
										<li><Link to={"/0/customer/dashboard"} className='dropdown-item'>Dashboard</Link></li>
										{/*<li><Link to={"/"+context.customerUser.id+"/customer/register-wizard"} className='dropdown-item'>View Profie</Link></li>
												<li><Link to={"/#"+props.match.params.userId+"/customer/gallery"} className='dropdown-item'>Gallery</Link></li>
												<li><Link to={"/#"+props.match.params.userId+"/customer/profile"} className='dropdown-item'>Profile</Link></li>
												<li><Link to={"/#"+props.match.params.userId+"/customer/members"} className='dropdown-item'>Members</Link></li>
	<li><Link to="/admin" className='dropdown-item'>Support</Link></li>*/}
										<li><a className='dropdown-item' onClick={() => { if (window.confirm('Are you sure to logout?')) onLogoutClick() }}>Logout</a></li></ul>
								</li>
							</ul>

						}




					</nav>
				</div>
			</div>


		</React.Fragment>
	);
};

export default TopMenu;