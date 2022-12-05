// FOR ADMIN
import Dashboard from "./dashboard";
import { ROLES } from "../../../../utils/data";
//new entries
import ListMembers from "./members";
import AddMember from "./members/addMember";
import MakePayment from "./members/makePayment.jsx";
import MemberViewTab from "./members/memberTab";
import PageTwo from "./members/pageTwo";
import PageThree from "./members/pageThree";
import PageFour from "./members/pageFour";
import PageFive from "./members/pageFive";
import PageSix from "./members/pageSix";
import EditPage from "./members/editPage";
import ViewPage from "./members/viewPage";
import WaitingMember from "./waitingMember";
import WaitingEntry from "./waitingMember/entry";
import RenewalMember from "./renewalMember";
import RenewalEntry from "./renewalMember/entry";
import NameChange from "./nameChange/nameChangeEntry";
import NewViewMember from "./members/newViewMember";
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import EditMatrymony from "./members/editMatrimony";
import Docs from "../../../../docs";
import Database from "../../../../devTools/database";
import LiveHospital from "./liveHospital";
import RenewalRemainders from "./renewal-reminder";

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
        path: '/:userId/admin/members/pagetwo/:Id',
        component: PageTwo,
        title: 'Page Two',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/pagethree/:Id',
        component: PageThree,
        title: 'Page Three',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/pagefour/:Id',
        component: PageFour,
        title: 'Page Four',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/pagefive/:Id',
        component: PageFive,
        title: 'Page Five',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/pagesix/:Id',
        component: PageSix,
        title: 'Page Six',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/editpage/:id',
        component: EditPage,
        title: 'Edit Page',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/viewpage/:id',
        component: ViewPage,
        title: 'View Page',
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
        path: '/:userId/admin/members/membertab/:id',
        component: MemberViewTab,
        title: 'Member View Tab',
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
        path: '/:userId/admin/waitingmember',
        component: WaitingMember,
        title: 'Waiting Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/renewalmember',
        component: RenewalMember,
        title: 'Renewal Member',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/livehospital',
        component: LiveHospital,
        title: 'Live Hospital',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/renewal-reminders',
        component: RenewalRemainders,
        title: 'Renewal Reminder',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/renewal/entry/:id',
        component: RenewalEntry,
        title: 'Renewal Entry',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/waiting/entry/:id',
        component: WaitingEntry,
        title: 'Waiting Entry',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/namechangeentry/:id',
        component: NameChange,
        title: 'Name Change',
        allowed: ROLES.ALL,
        exact: true
    },
];
export default myroutes;