import { ROLES } from "../../../../utils/data"
const mynav = [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL },
	{
		name: 'Tour Packages',
		path: '/:userId/admin/tour-packages',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'All Packages', path: '/:userId/admin/tour-packages', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'tour-packages.list-tour-package'},
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Hotels',
		path: '/:userId/admin/hotels',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'All Hotels', path: '/:userId/admin/hotels', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'hotels.list-hotels'},
			{ name: 'Rooms', path: '/:userId/admin/hotel-rooms', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'hotels.list-hotel-rooms'},
		],
		allowed: ROLES.ALL
	},
	{ name: 'Bookings', path: '/:userId/admin/bookings', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL,resourceName:'bookings.list-bookings' },
	{
		name: 'CMS',
		path: '/:userId/admin/contents/cms',
		icon: 'fa-solid fa-globe',
		exact: false,
		childrens: [
			{ name: 'List Pages', path: '/:userId/admin/contents/page/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'pages.list-pages' },
			{ name: 'List Sliders', path: '/:userId/admin/contents/slider/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'sliders.list-slider' },
		/* 	{ name: 'List Announcements', path: '/:userId/admin/contents/announcement/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'announcements.list-announcement' }, */
			{ name: 'List Gallery', path: '/:userId/admin/contents/gallery/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL ,resourceName:'gallery.list-gallery'},
			/* { name: 'List Events', path: '/:userId/admin/contents/event/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL }, */
		],
		allowed: ROLES.ALL
	},


	{
		name: 'Branches',
		path: '/:userId/admin/branches',
		icon: 'fa-solid fa-code-branch',
		exact: false,
		childrens: [
			{ name: 'Branches', path: '/:userId/admin/branches', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'branches.list-branches' },
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Employees',
		path: '/:userId/admin/employees',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'Employees', path: '/:userId/admin/employees', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'employees.list-employees'}, //
			{ name: 'Employee Designations', path: '/:userId/admin/employee-designations', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'designations.list-designations' },
		],
		allowed: ROLES.ALL
	},
	{ name: 'Form Settings', path: '/:userId/admin/collections', icon: 'fa-regular fa-square-plus', exact: true, allowed: ROLES.ALL,resourceName:'form-settings.list-settings' },

	{
		name: 'My Account',
		path: '/:userId/admin/myaccounts',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'My Profile', path: '/:userId/admin/myaccounts/account-profile', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL },
		], 
		allowed: ROLES.ALL
	},
];
export default mynav;