import { ROLES } from "../../../../utils/data"
const mynav = [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL },
	/* {
		name: 'CMS',
		path: '/:userId/admin/cms',
		icon: 'fa-regular fa-chess-rook',
		exact: false,
		childrens: [
			{ name: 'Pages', path: '/:userId/admin/cms/pages', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Announcements', path: '/:userId/admin/cms/announcements', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'SMS Templates', path: '/:userId/admin/cms/sms-templates', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Mail Templates', path: '/:userId/admin/cms/mail-templates', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
		],
		allowed: ROLES.ALL
	}, */
	{
		name: 'Manage Members',
		path: '/:userId/admin/member',
		icon: 'fa-solid fa-user-group',
		exact: false,
		childrens: [
			{ name: 'All Members', path: '/:userId/admin/members', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL},
			{ name: 'Add Member', path: '/:userId/admin/members/add-member', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL,resourceName:'matrimony-members.add-new-member' },
			{ name: 'Member Logs', path: '/:userId/admin/members/member-logs', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Deleted Members', path: '/:userId/admin/members/deleted-member', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL,resourceName:'matrimony-members.list-deleted-members' },
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Packages',
		path: '/:userId/admin/packages',
		icon: 'fa-solid fa-cube',
		exact: false,
		childrens: [
			{ name: 'Packages', path: '/:userId/admin/packages', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'packages.list-packages' },
			{ name: 'Package Discounts', path: '/:userId/admin/package-discounts', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee ,resourceName:'packages.list-package-discounts'},

		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'CMS',
		path: '/:userId/admin/contents/cms',
		icon: 'fa-solid fa-globe',
		exact: false,
		childrens: [
			{ name: 'List Pages', path: '/:userId/admin/contents/page/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'pages.list-pages' },
			{ name: 'List Announcements', path: '/:userId/admin/contents/announcement/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'announcements.list-announcement' },
			{ name: 'List Gallery', path: '/:userId/admin/contents/gallery/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee ,resourceName:'gallery.list-gallery'},
			{ name: 'List Events', path: '/:userId/admin/contents/event/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'events.list-events'  },
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Success Story',
		path: '/:userId/admin/contents/succes-story',
		icon: 'fa-regular fa-calendar-days',
		exact: false,
		childrens: [
			{ name: 'List Success Stories', path: '/:userId/admin/contents/success-story/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'success-story.list-success-story' },
			{ name: 'Add Success Story', path: '/:userId/admin/contents/success-story/add', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'success-story.add-new-success-story' },

		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Branches',
		path: '/:userId/admin/branches',
		icon: 'fa-solid fa-code-branch',
		exact: false,
		childrens: [
			{ name: 'Branches', path: '/:userId/admin/branches', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'branches.list-branches' },
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Employees',
		path: '/:userId/admin/employees',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'Employees', path: '/:userId/admin/employees', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'employees.list-employees'}, //
			{ name: 'Employee Designations', path: '/:userId/admin/employee-designations', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'designations.list-designations' },
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Broker',
		path: '/:userId/admin/broker',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'Broker', path: '/:userId/admin/broker', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'brokers.list-brokers' },
			{ name: 'Payments', path: '/:userId/admin/broker/payment-list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'brokers.list-broker-payments' },
			{ name: 'Transactions', path: '/:userId/admin/broker/transactions', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'brokers.list-broker-transactions' },
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Franchise',
		path: '/:userId/admin/franchise',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'Franchise List', path: '/:userId/admin/franchise', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'franchise.list-franchise' },
			{ name: 'Payments', path: '/:userId/admin/franchise/payment-list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'franchise.list-franchise-payments' },
			{ name: 'Transactions', path: '/:userId/admin/franchise/transactions', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'franchise.list-franchise-transactions' },
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'CRM',
		path: '/:userId/admin/crm',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'CRM', path: '/:userId/admin/crm/crm-list', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'crm.list-crm' },
			{ name: 'categories', path: '/:userId/admin/crm/categories', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'crm.list-crm-categories' },
			
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Finance',
		path: '/:userId/admin/finance',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		childrens: [
			{ name: 'Ledgers', path: '/:userId/admin/finance/ledgers', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'finance.list-ledgers' },
			
			
		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Whatsapp',
		path: '/:userId/admin/whatsapp',
		icon: 'fa-solid fa-message',
		exact: false,
		childrens: [
			{ name: 'Whatsapp Reports', path: '/:userId/admin/whatsapp/wapp-reports', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'whatsapp.whatsapp-reports' },
			{ name: 'Daily Whatsapp', path: '/:userId/admin/whatsapp/daily-whatsapp', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'whatsapp.daily-whatsapp' },
			/* { name: 'Synch Data', path: '/:userId/admin/developer', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'whatsapp.synch-data' }, */
		],
		allowed: ROLES.AdminAndEmployee
	},
	{ name: 'Form Settings', path: '/:userId/admin/collections', icon: 'fa-regular fa-square-plus', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'form-settings.list-settings' },
	{
		name: 'Add New Details',
		path: '/:userId/admin/business-names',
		icon: 'fa-regular fa-briefcase',
		exact: true,
		childrens: [
			{ name: 'Business Names', path: '/:userId/admin/business-names', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'business-names.list-business-names' },
			{ name: 'Caste List', path: '/:userId/admin/castes', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'castes.list-castes' },
			{ name: 'District List', path: '/:userId/admin/districts', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'districts.list-districts' },
			{ name: 'Education List', path: '/:userId/admin/education', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'education.list-education' },


		],
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'My Account',
		path: '/:userId/admin/myaccounts',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'My Profile', path: '/:userId/admin/myaccounts/account-profile', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
		], 
		allowed: ROLES.ALL
	},
	{
		name: 'SmsTemplate',
		path: '/:userId/admin/sms-templates',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'SmsTemplate', path: '/:userId/admin/sms-templates', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'sms-templates.list-sms-templates' },
		], 
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Logs',
		path: '/:userId/admin/logs',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'Logs Report', path: '/:userId/admin/logs', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'logs.list-logs' },
		], 
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Advertisements',
		path: '/:userId/admin/advertisements',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'Advertisements', path: '/:userId/admin/advertisements', icon: 'bx fa-gear', exact: true, allowed: ROLES.AdminAndEmployee,resourceName:'advertisements.list-advertisements' },
		], 
		allowed: ROLES.AdminAndEmployee
	},
	{
		name: 'Transactions',
		path: '/:userId/admin/transactions',
		icon: 'fa-solid fa-user-tie',
		exact: false,
		 childrens: [
			{ name: 'Transactions', path: '/:userId/admin/reseller/mytransactions', icon: 'bx fa-gear', exact: true, allowed: ROLES.FranchiseAndBroker },
		], 
		allowed: ROLES.FranchiseAndBroker
	},


];
export default mynav;