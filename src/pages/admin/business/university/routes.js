// FOR ADMIN
import Dashboard from "./dashboard";
import { ROLES } from "../../../../utils/data";
//new entries
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import ListUsers from "./users";
import AddUser from "./users/addUser";
import ViewUser from "./users/viewUser";
import EditUser from "./users/editUser";
import Docs from "../../../../docs";
import Database from "../../../../devTools/database";
import Courses from "./courses";
import AddCourse from "./courses/addCourse";
import EditCourse from "./courses/editCourse";
import ViewCourse from "./courses/viewCourse";
import Coder from "../../../../devTools/coder";
import Translations from "../../translations";
const myroutes= [
    {
        path: '/:userId/admin',
        component: Dashboard,
        title: 'Dashboard',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/contents/:content_type/add',
        component:AddContent,
        title: 'Add Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/contents/:content_type/edit/:id',
        component:EditContent,
        title: 'Edit Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        exact:true ,
        path: '/:userId/admin/contents/:contentype/list',
        component:ListContents,
        title: 'List Content',
        allowed: ROLES.ALL,
    },
    {
        path: '/:userId/admin/contents/:content_type/view/:id',
        component:ViewContent,
        title: 'View Content',
        allowed: ROLES.ALL,
        exact: true
    },
  
    {
        path: '/:userId/admin/collections',
        component: Collections,
        title: 'Collections',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/translations',
        component: Translations,
        title: 'Translations',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/users',
        component:ListUsers,
        title: 'List Users',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/users/add-user',
        component: AddUser,
        title: 'Add User',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/users/view/:customerUserId',
        component:ViewUser,
        title: 'View User',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/users/edit/:customerUserId',
        component:EditUser,
        title: 'Edit User',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/filter/:filter_text',
        component: ListUsers,
        title: 'Members Filter',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/courses',
        component: Courses,
        title: 'Courses',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/courses/add-course',
        component: AddCourse,
        title: 'Add Course',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/courses/edit/:courseId',
        component: EditCourse,
        title: 'Edit Course',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/courses/view/:courseId',
        component: ViewCourse,
        title: 'View Course',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/docs',
        component: Docs,
        title: 'Documentation',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/database',
        component: Database,
        title: 'Database',
        allowed: ROLES.ALL,
        exact: true
    },
    
    {
        path: '/:userId/admin/coder',
        component: Coder,
        title: 'Coder',
        allowed: ROLES.ALL,
        exact: true
    },
 
];
export default myroutes;