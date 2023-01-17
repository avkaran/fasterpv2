import { ROLES } from "../../../../utils/data"
const mynav = [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL },
	{
		name: 'Projects',
		path: '/:userId/admin/projects',
		icon: 'fa-solid fa-list-alt',
		exact: false,
		childrens: [
			{ name: 'All Projects', path: '/:userId/admin/projects', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL},
		],
		allowed: ROLES.ALL
	},
	{
		name: 'CMS',
		path: '/:userId/admin/contents/cms',
		icon: 'fa-solid fa-globe',
		exact: false,
		childrens: [
			{ name: 'List Pages', path: '/:userId/admin/contents/page/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'pages.list-pages' },
			{ name: 'List Announcements', path: '/:userId/admin/contents/announcement/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'announcements.list-announcement' },
			{ name: 'List Gallery', path: '/:userId/admin/contents/gallery/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL ,resourceName:'gallery.list-gallery'},
			{ name: 'List Events', path: '/:userId/admin/contents/event/list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL },
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
		name: 'CRM',
		path: '/:userId/admin/crm',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'CRM', path: '/:userId/admin/crm/crm-list', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'crm.list-crm' },
			{ name: 'categories', path: '/:userId/admin/crm/categories', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'crm.list-crm-categories' },
			
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Whatsapp',
		path: '/:userId/admin/whatsapp',
		icon: 'fa-solid fa-message',
		exact: false,
		childrens: [
			{ name: 'Whatsapp Reports', path: '/:userId/admin/whatsapp/wapp-reports', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'whatsapp.whatsapp-reports' },
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
	{
		name: 'Advertisements',
		path: '/:userId/admin/advertisements',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'Advertisements', path: '/:userId/admin/advertisements', icon: 'fa-solid fa-user-tie', exact: true, allowed: ROLES.ALL,resourceName:'advertisements.list-advertisements' },
		], 
		allowed: ROLES.ALL
	},
	{ name: 'Translations', path: '/:userId/admin/translations', icon: 'fa-solid fa-language', exact: true, allowed: ROLES.ALL },

];
export default mynav;