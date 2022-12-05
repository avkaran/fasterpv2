import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { currentRoutes } from '../../../../../utils';
import Logout from './Logout';
import UserProfile from './UserProfile';
import CompanyTitle from './CompanyTitle';
import { currentInstance } from '../../../../../utils';
import { businesses } from '../../../../../utils';
import PsContext from '../../../../../context';
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

		updateTitle();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.location.pathname]);

	const updateTitle = () => {
		let r = currentRoutes.find(item => item.path === props.location.pathname);

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
						

						<UserProfile />

						<li>
							<Logout />
						</li>

					</ul>

				</div>
			</header>

		</React.Fragment>
	);
};

export default Header;