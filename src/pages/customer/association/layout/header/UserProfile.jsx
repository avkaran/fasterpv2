import React, {  useContext } from 'react';
import { useParams, Link } from 'react-router-dom';

import { Nav, NavDropdown } from 'react-bootstrap';
import PsContext from '../../../../../context';


const UserProfile = (props) => {

	const context = useContext(PsContext);

	const getTitle = () => {
		return <div style={{
			fontSize: '12px',
			fontWeight: '600'
		}}>
			{''}
			{/*<span className='font-12 ms-2'>({capitalizeFirst(context.adminUser('').deptype)})</span>*/}
		</div>;
	}

	return (
		<React.Fragment>

			<Nav>
				<NavDropdown
					id="nav-dropdown"
					title={getTitle()}
				>
					<Link to="/admin/user" className='dropdown-item'>Profie</Link>
					<Link to="/admin" className='dropdown-item'>Support</Link>
					<hr className='dropdown-divider' />
					<a className='dropdown-item' href="!#">Logout</a>
				</NavDropdown>
			</Nav>


		</React.Fragment>
	);
};

export default UserProfile;