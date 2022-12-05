import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Logout from './Logout';
import UserProfile from './UserProfile';
import CompanyTitle from './CompanyTitle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonBooth, faCheck } from '@fortawesome/free-solid-svg-icons'
import { currentInstance } from '../../../../utils';
import { businesses } from '../../../../utils';
import { MyButton } from '../../../../comp';
import { Dropdown, Menu, Space, message } from 'antd';
import PsContext from '../../../../context';
import { useNavigate } from 'react-router-dom';
const Header = (props) => {
	const navigate = useNavigate();
	const context = useContext(PsContext);
	const handleSidebarCollapse = () => {

		if (document.body.classList.contains('sidebar-mini')) {
			document.body.classList.remove('sidebar-mini');
			document.body.classList.add('fixed-layout');
		}
		else {
			document.body.classList.remove('fixed-layout');
			document.body.classList.add('sidebar-mini');
		}
	};

	const [title, setTitle] = useState(null);

	useEffect(() => {

		import('../../business/' + currentInstance.name + '/routes').then((module) => {
			//setCurrentRoutes(module.default);
			let r = module.default.find(item => item.path === props.location.pathname);
			updateTitle(r);
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location.pathname]);

	const updateTitle = (r) => {


		if (r && r.title) {
			setTitle(r.title);
		}
		else {
			if (currentInstance) {
				let b = businesses[currentInstance.index]
				setTitle(b.name);
			}
		}
	};
	const onDevMenuClick = ({ key }) => {
		if (key === 'documentation')
			navigate('/' + props.match.params.userId + '/admin/docs')
		else if (key === 'database')
			navigate('/' + props.match.params.userId + '/admin/database')
		else if (key === 'coder')
			navigate('/' + props.match.params.userId + '/admin/coder')
		else
			message.info(`Click on item ${key}`);
	};
	const menu = (
		<Menu onClick={onDevMenuClick}>
			<Menu.ItemGroup

				key='1'
				label='Group title'
			>Current Role
				<Menu.Item key="admin"><FontAwesomeIcon icon={faCheck} /> Admin</Menu.Item>
				<Menu.Item key="employee">Employee</Menu.Item>
			</Menu.ItemGroup>
			<Menu.ItemGroup

				key='1'
				label='Group title'
			>Dev Tools
				<Menu.Item key="api-calls">Api Calls</Menu.Item>
				<Menu.Item key="database">Database</Menu.Item>
				<Menu.Item key="coder">Coder</Menu.Item>
				<Menu.Item key="documentation">Documentation</Menu.Item>

			</Menu.ItemGroup>


		</Menu>

	);
	return (
		<React.Fragment>

			<Helmet>
				<title>{title}</title>
			</Helmet>
			<header className="header">
				<div className="page-brand">
					<a className="link" href="!#">
						<span className="brand">{businesses[currentInstance.index].shortName}
						</span>
						<span className="brand-mini">PS</span>
					</a>
				</div>

				<div className="flexbox flex-1">

					<ul className="nav navbar-toolbar">
						<li>
							{
								// eslint-disable-next-line jsx-a11y/anchor-is-valid
								(<a className="nav-link sidebar-toggler js-sidebar-toggler" onClick={() => handleSidebarCollapse()}><i className="ti-menu"></i></a>)
							}
						</li>
						<li className='d-none d-md-block' >
							{<CompanyTitle />}
						</li>

						{/*<li className='d-none d-md-block' >
							<SearchForm />
						</li>*/}

					</ul>

					<ul className="nav navbar-toolbar">
						{context.adminUser(props.match.params.userId).mode === "dev" && (<Dropdown overlay={menu}>
							{
								// eslint-disable-next-line jsx-a11y/anchor-is-valid
								(<a onClick={(e) => e.preventDefault()}>
									<Space>
										<MyButton type="outlined" size="small" shape="circle"><FontAwesomeIcon icon={faPersonBooth} /></MyButton>

									</Space>
								</a>)}
						</Dropdown>)}

						<UserProfile />

						<li>
							<Logout {...props} />
						</li>

					</ul>

				</div>
			</header>

		</React.Fragment>
	);
};

export default Header;