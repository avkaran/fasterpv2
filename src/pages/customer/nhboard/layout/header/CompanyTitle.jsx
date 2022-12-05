import React from 'react';

import { upperCase } from '../../../../../utils';

import { currentInstance } from '../../../../../utils';
import { businesses } from '../../../../../utils';
const CompanyTitle = (props) => {

	return (
		<div className='header_company_title'>
			{upperCase(businesses[currentInstance.index].shortName)}
		</div>
	);
};

export default CompanyTitle