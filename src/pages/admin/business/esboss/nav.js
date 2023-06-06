import { ROLES } from "../../../../utils/data"
const mynav = [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL },
	{
		name: 'Products',
		path: '/:userId/admin/products',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'Product List', path: '/:userId/admin/productservice/product', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL},
			{ name: 'Service List', path: '/:userId/admin/productservice/service', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL},
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
		name: 'Add New Details',
		path: '/:userId/admin/business-names',
		icon: 'fa-regular fa-briefcase',
		exact: true,
		childrens: [
			{ name: 'Business Names', path: '/:userId/admin/business-names', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'business-names.list-business-names' },	
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
	{
		name: 'SMS Templates',
		path: '/:userId/admin/sms-templates',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'SmsTemplate', path: '/:userId/admin/sms-templates', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'sms-templates.list-sms-templates' },
		], 
		allowed: ROLES.ALL
	},
	{
		name: 'Logs',
		path: '/:userId/admin/logs',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'Logs Report', path: '/:userId/admin/logs', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'logs.list-logs' },
		], 
		allowed: ROLES.ALL
	},

];
export default mynav;