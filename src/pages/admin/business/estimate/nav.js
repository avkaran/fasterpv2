import { ROLES } from "../../../../utils/data"
const mynav = [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL }, 
	{
		name: 'Products',
		path: '/:userId/admin/products',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'All Products', path: '/:userId/admin/products', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,allowed: ROLES.ALL,resourceName:'products.list-products'},
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Estimates',
		path: '/:userId/admin/estimates',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'All Estimates', path: '/:userId/admin/estimates', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,allowed: ROLES.ALL,resourceName:'estimates.list-estimate'},
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