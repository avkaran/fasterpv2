// FOR ADMIN
import Dashboard from "./dashboard";
import { ROLES } from "../../../../utils/data";
//new entries
import ListMembers from "./members";
import AddMember from "./members/addMember";
import MakePayment from "./members/makePayment.jsx";
import ViewMember from "./members/viewMember";
import EditMember from "./members/editMember";
import NewViewMember from "./members/newViewMember";
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import EditMatrymony from "./members/editMatrimony";
//import Docs from "../../../../docs";
//import Database from "../../../../devTools/database";
import Matrimony from "./matrimony";
import MemberCounts from "./members/memberCounts";
//import Coder from "../../../../devTools/coder";
const myroutes = [
    {
        path: '/:userId/admin',
        component: Dashboard,
        title: 'Dashboard',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members',
        component: ListMembers,
        title: 'Members',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/member-counts',
        component: MemberCounts,
        title: 'Member Counts',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/matrimony',
        component: Matrimony,
        title: 'Matrimony',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/filter/:filter_text',
        component: ListMembers,
        title: 'Members Filter',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/add-member',
        component: AddMember,
        title: 'Add Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/make-payment/:memberId',
        component: MakePayment,
        title: 'Make Payment',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/edit-matrimony/:memberId',
        component: EditMatrymony,
        title: 'Edit Matrimony',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/view/:memberId',
        component: ViewMember,
        title: 'View Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/edit/:memberId',
        component: EditMember,
        title: 'Edit Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/newview/:memberId',
        component: NewViewMember,

        title: 'New View Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/contents/:content_type/add',
        component: AddContent,
        title: 'Add Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/contents/:content_type/edit/:id',
        component: EditContent,
        title: 'Edit Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        exact: true,
        path: '/:userId/admin/contents/:contentype/list',
        component: ListContents,
        title: 'List Content',
        allowed: ROLES.ALL,
    },
    {
        path: '/:userId/admin/contents/:content_type/view/:id',
        component: ViewContent,
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
/*     {
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
        component:Coder,
        title: 'Coder',
        allowed: ROLES.ALL,
        exact: true
    }, */
];
export default myroutes;