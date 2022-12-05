import React, {  } from 'react';


const SearchForm=(props)=>{

	return(
		<React.Fragment>

			<form className="navbar-search" >
				<div className="rel">
					<span className="search-icon"><i className="ti-search"></i></span>
					<input className="form-control" placeholder="Search here..." />
				</div>
			</form>
			
		</React.Fragment>
	);
};

export default SearchForm