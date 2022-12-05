import { ROLES } from "../../../../utils/data"

const mynav= [
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
		path: '/:userId/admin/members',
		icon: 'fa-solid fa-user-group',
		exact: false,
		childrens: [
			{ name: 'All Members', path: '/:userId/admin/members', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Member Counts', path: '/:userId/admin/member-counts', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Member', path: '/:userId/admin/members/add-member', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
	
		],
		allowed: ROLES.ALL
	},
	{ name: 'Matrimony', path: '/:userId/admin/matrimony', icon: 'fa-solid fa-heart', exact: true, allowed: ROLES.ALL },
	{
		name: 'Articles',
		path: '/:userId/admin/contents/article',
		icon: 'fa-solid fa-newspaper',
		exact: false,
		childrens: [
			{ name: 'List Articles', path: '/:userId/admin/contents/article/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Article', path: '/:userId/admin/contents/article/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Pages',
		path: '/:userId/admin/contents/page',
		icon: 'fa-solid fa-globe',
		exact: false,
		childrens: [
			{ name: 'List Pages', path: '/:userId/admin/contents/page/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Page', path: '/:userId/admin/contents/page/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Announcements',
		path: '/:userId/admin/contents/announcement',
		icon: 'fa-solid fa-receipt',
		exact: false,
		childrens: [
			{ name: 'List Announcements', path: '/:userId/admin/contents/announcement/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Announcement', path: '/:userId/admin/contents/announcement/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Gallery',
		path: '/:userId/admin/contents/gallery',
		icon: 'fa-regular fa-images',
		exact: false,
		childrens: [
			{ name: 'List Gallery', path: '/:userId/admin/contents/gallery/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Gallery', path: '/:userId/admin/contents/gallery/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Events',
		path: '/:userId/admin/contents/event',
		icon: 'fa-regular fa-calendar-days',
		exact: false,
		childrens: [
			{ name: 'List Events', path: '/:userId/admin/contents/event/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			{ name: 'Add Event', path: '/:userId/admin/contents/event/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
		
		],
		allowed: ROLES.ALL
	},
	{ name: 'Add New Details', path: '/:userId/admin/collections', icon: 'fa-regular fa-square-plus', exact: true, allowed: ROLES.ALL },
];
export default mynav;