import { ROLES } from "../../../../utils/data"

const mynav= [
	{ name: 'Dashboard', path: '/:userId/admin', icon: 'fa-solid fa-house', exact: true, allowed: ROLES.ALL },
	{
		name: 'Courses',
		path: '/:userId/admin/courses',
		icon: 'fa-solid fa-book',
		exact: false,
		childrens: [
			{ name: 'Add Course', path: '/:userId/admin/courses/add-course', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Courses', path: '/:userId/admin/courses', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Students',
		path: '/:userId/admin/Users',
		icon: 'fa-solid fa-user',
		exact: false,
		childrens: [
			{ name: 'Add Applicants', path: '/:userId/admin/users/add-user', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List List Applicants', path: '/:userId/admin/users', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
		
		
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Announcements',
		path: '/:userId/admin/contents/announcement',
		icon: 'fa-solid fa-receipt',
		exact: false,
		childrens: [
			{ name: 'Add Announcement', path: '/:userId/admin/contents/announcement/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Announcements', path: '/:userId/admin/contents/announcement/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Pages',
		path: '/:userId/admin/contents/page',
		icon: 'fa-solid fa-globe',
		exact: false,
		childrens: [
			{ name: 'Add Page', path: '/:userId/admin/contents/page/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Pages', path: '/:userId/admin/contents/page/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
		
		
		],
		allowed: ROLES.ALL
	},
	
	{
		name: 'Gallery',
		path: '/:userId/admin/contents/gallery',
		icon: 'fa-regular fa-images',
		exact: false,
		childrens: [
			{ name: 'Add Gallery', path: '/:userId/admin/contents/gallery/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Gallery', path: '/:userId/admin/contents/gallery/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Slider',
		path: '/:userId/admin/contents/slider',
		icon: 'fa-regular fa-clone',
		exact: false,
		childrens: [
			{ name: 'Add Slider Image', path: '/:userId/admin/contents/slider/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Slider', path: '/:userId/admin/contents/slider/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			
		
		],
		allowed: ROLES.ALL
	},
	{
		name: 'Events',
		path: '/:userId/admin/contents/event',
		icon: 'fa-regular fa-calendar-days',
		exact: false,
		childrens: [
			{ name: 'Add Event', path: '/:userId/admin/contents/event/add', icon: 'bx fa-gear', exact: true, allowed:ROLES.ALL },
			{ name: 'List Events', path: '/:userId/admin/contents/event/list', icon: 'bx fa-gear', exact: true, allowed: ROLES.ALL },
			
		
		],
		allowed: ROLES.ALL
	},
		
	{ name: 'Form Settings', path: '/:userId/admin/collections', icon: 'fa-regular fa-square-plus', exact: true, allowed: ROLES.ALL },
	{ name: 'Translations', path: '/:userId/admin/translations', icon: 'fa-solid fa-language', exact: true, allowed: ROLES.ALL },
];
export default mynav;