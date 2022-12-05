import _LOGO from '../assets/images/kl_logo.png';
import _FORGOT from '../assets/images/forgot.png';
import _FORGOT_GIF from '../assets/images/forgot.gif';
import _MALE from '../assets/images/male_large.jpg';
import _FEMALE from '../assets/images/female_large.jpg';

//export const VENDOR_LOGO = baseUrl+'/public/app_fav.png';
export const VENDOR_LOGO ='/public/app_fav.png';
export const LOGO = _LOGO;
export const FORGOT = _FORGOT;
export const FORGOT_GIF = _FORGOT_GIF;
export const MALE = _MALE;
export const FEMALE = _FEMALE;

export const printHeader = '';

export const aosInit = {
	offset: 100,
	duration: 600,
	easing: 'ease-in-sine',
	delay: 100,
};

export const bgClasses = {
	c_1: '#deeeff',
	c_2: '#f0f08f',
	c_3: '#d1f0ff',
	c_4: '#c6f6c6',
	c_5: '#ffd2d2',
	c_6: '#e4d6ff',
	c_7: '#eaeae9',
	c_8: '#fccaff',

	c_9: '#deeeff',
	c_10: '#f0f08f',
	c_11: '#c6f6c6',
};
export const ROLES = {
	ALL: ['admin','employee','franchise','broker'],
	Admin:['admin'],
	Employee:['employee'],
	AdminAndEmployee:['admin','employee'],
	Franchise:['franchise'],
	Broker:['broker'],
	FranchiseAndBroker:['franchise','broker'],
};
export const CustomerROLES = {
	CUSTOMER: ['customer'],
};
export const contentTypes={
	ANNOUNCEMENT :'announcement',
	SLIDER :'slider',
	GALLERY :'gallery',
	ARTICLE :'article',
	PAGE :'page',
	EVENT :'event',
	//downloads,videos
}
