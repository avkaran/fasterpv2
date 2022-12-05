import React, { useState } from 'react';
import axios from 'axios';
import PsContext from './index';
import { getLs, setLs, RemoveLs } from '../utils';
import { baseUrl } from '../utils';
import { listCollections, collectionOptions, getWhereClause, capitalizeFirst, getBase64, encrypt, decrypt, apiRequest,sendSms,sendWhatsapp,sendEmail,shortenUrl,addLog } from '../models/core'
import noImg from '../assets/images/no-img.jpg';
import noMale from  '../assets/images/male.png';
import noFemale from  '../assets/images/female.png';

import { useMediaQuery } from 'react-responsive';
const PsContextProvider = (props) => {
	const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
	//for admin users
	const checkAdminLogged = (id) => { return getLs(id + '_admin_logged') || 'no'; };
	const getAdminUser = (id) => {
		return getLs(id + '_admin_login_data') ? JSON.parse(decrypt(getLs(id + '_admin_login_data'))) : [];
	};
	const getAdminApi = (id) => { return getLs(id + '_admin_api') || ''; };
	//const [adminLogged, setAdminLogged] = useState(checkAdminLogged());
	//const [adminUser, setAdminUser] = useState(getAdminUser());
	//const [adminApi, setAdminApi] = useState(getAdminApi());
	const saveAdminLogin = (user, api) => {
		var user_count = 0;
		if (getLs('admin_user_count')) {
			user_count = parseInt(getLs('admin_user_count')) + 1;
			setLs('admin_user_count', user_count);
		}
		else
			setLs('admin_user_count', 0);

		setLs(user_count + '_admin_login_data', encrypt(JSON.stringify(user)));
		//setAdminUser(user);
		setLs(user_count + '_admin_api', api);


		//setAdminApi(api);

		return user_count;
	};

	const adminLogout = (id) => {
		setLs(id + '_admin_login_data', false);
		//setAdminUser([]);
		setLs(id + '_admin_api', '');
		//	setAdminApi(null);
		//axios.defaults.headers.common['Api-Token'] = '';
		setLs(id + '_admin_logged', 'no');
		//setAdminLogged('no');
		RemoveLs(id + '_admin_login_data');
		RemoveLs(id + '_admin_api');
		RemoveLs(id + '_admin_logged');
		//remove count
		/* var user_count = 0;
		if (getLs('admin_user_count')) {
			user_count = parseInt(getLs('admin_user_count'));
			if (user_count > 1)
				setLs('admin_user_count', user_count - 1);
			else
				setLs('admin_user_count', 0);
		}
		else
			setLs('admin_user_count', 0); */
			//verify removed ids, and re use that. 
	};
	const updateAdminUser = (id, user) => {
		setLs(id + '_admin_login_data', JSON.stringify(user));
		//	setAdminUser(user);
	};
	const updateAdminLogged = (id) => {
		setLs(id + '_admin_logged', 'yes');
		//setAdminLogged('yes');
	};

	const isAdminResourcePermit=(id,resource_name)=>{
		var currentUser=getAdminUser(id);
		if(currentUser.role==='admin' || currentUser.role==='dev')
			return true;

		var permissionsAllowed=currentUser.permissions;
		if(permissionsAllowed.indexOf(resource_name)>-1)
			return true;
		else return false;
	}

	//for customer users
	const checkCustomerLogged = () => { return getLs('customer_logged') || 'no'; };
	const getCustomerUser = () => {
		return getLs('customer_login_data') ? JSON.parse(getLs('customer_login_data')) : [];
	};
	const getCustomerApi = () => { return getLs('customer_api') || ''; };
	const [customerLogged, setCustomerLogged] = useState(checkCustomerLogged());
	const [customerUser, setCustomerUser] = useState(getCustomerUser());
	const [customerApi, setCustomerApi] = useState(getCustomerApi());
	const saveCustomerLogin = (user, api) => {
		setLs('customer_login_data', JSON.stringify(user));
		setCustomerUser(user);
		setLs('customer_api', api);
		setCustomerApi(api);
	};

	const customerLogout = () => {
		setLs('customer_login_data', false);
		setCustomerUser([]);
		setLs('customer_api', '');
		setCustomerApi(null);
		axios.defaults.headers.common['Api-Token'] = '';
		setLs('customer_logged', 'no');
		setCustomerLogged('no');
	};
	const updateCustomerUser = (user) => {
		setLs('customer_login_data', JSON.stringify(user));
		setCustomerUser(user);
	};
	const updateCustomerLogged = () => {
		setLs('customer_logged', 'yes');
		setCustomerLogged('yes');
	};

	const [psGlobal, setPsGlobal] = useState({})

	const updateGlobal = async () => {

		return new Promise((resolve, reject) => {

			listCollections().then(res => {
				if (res) {
					let globalVars = {
						collectionData: res,
						collectionOptions: collectionOptions,
						getWhereClause: getWhereClause,
						capitalizeFirst: capitalizeFirst,
						getBase64: getBase64,
						encrypt: encrypt,
						decrypt: decrypt,
						apiRequest: apiRequest,
						addLog:addLog,
						sendSms: sendSms,
						sendWhatsapp:sendWhatsapp,
						sendEmail: sendEmail,
						shortenUrl:shortenUrl,
					}
					setPsGlobal(globalVars)
					resolve(true)
				}

			}).catch((error) => {
				reject(error)
			});
		});

	}
	const updateCollectionData = async () => {

		return new Promise((resolve, reject) => {

			listCollections().then(res => {
				if (res) {
					let globalVars = psGlobal;
					globalVars.collectionData = res;
					setPsGlobal(globalVars)
					resolve(true)
				}

			}).catch((error) => {
				reject(error)
			});
		});
	}
	return (
		<PsContext.Provider value={{
			baseUrl: baseUrl,
			isMobile:isMobile,
			noImg: noImg,
			noMale: noMale,
			noFemale: noFemale,
			//for admin
			adminLogged: checkAdminLogged,
			adminUser: getAdminUser,
			adminApi: getAdminApi,
			saveAdminLogin: saveAdminLogin,
			updateAdminUser: updateAdminUser,
			updateAdminLogged: updateAdminLogged,
			adminLogout: adminLogout,
			isAdminResourcePermit:isAdminResourcePermit,
			//for customer
			customerLogged: customerLogged,
			customerUser: customerUser,
			customerApi: customerApi,
			saveCustomerLogin: saveCustomerLogin,
			updateCustomerUser: updateCustomerUser,
			updateCustomerLogged: updateCustomerLogged,
			customerLogout: customerLogout,

			psGlobal: psGlobal,
			updateGlobal: updateGlobal,
			updateCollectionData: updateCollectionData,


		}}
		>
			{props.children}
		</PsContext.Provider>
	);
};

export default PsContextProvider;