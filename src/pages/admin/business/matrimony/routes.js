// FOR ADMIN
import Dashboard from "./dashboard";
import { ROLES } from "../../../../utils/data";
//new entries
import ListMembers from "./members";
import AddMember from "./members/addMember";

import NewViewMember from "./members/newViewMember";
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import DeveloperHome from "./dev";

import Packages from "./packages";

import BusinessNames from "./addNewDatails/businessNames";
import PackageDiscounts from "./packages/packageDiscounts"
import CasteList from "./addNewDatails/castes";
import EmployeeDesignations from "../../employee-designations";
import Branches from "../../branches";
import WhatsappReports from "../../whatsapp";
import dailyWhatsapp from "./whatsapp/dailyWhatsapp";
import Employees from "../../employees";

import Broker from "./addNewDatails/broker";
import Franchise from "./addNewDatails/franchise";
import MyAdminProfile from "../../my-accounts";
import BrokerProfile from "../../my-accounts/broker/brokerProfile";
import FranchiseProfile from "../../my-accounts/franchise/franchiseProfile";
import EmployeeProfile from "../../my-accounts/employee/employeeProfile";
import SmsTemplate from "../../sms-templates";
import Logs from "../../logs";
import PermissionError from "../../error-pages/permissionError";
import FranchisePaymentList from "./franchise/franchisePaymentsList";
import FranchiseTransactions from "./franchise/franchiseTransactions";
import BrokerPaymentList from "./broker/brokerPaymentsList";
import BrokerTransactions from "./broker/brokerTransactions";
import CrmCategoryList from "../../crm/categories";
import MemberCRM from "./crm/memberCrm";
import Advertisement from "../../advertisements";
import SearchMemberLogs from "./members/searchMemberLogs";
import MemberLogsByAction from "./members/memberLogsByAction";
import MembersByOrderStatus from "./members/membersByOrderStatus";
const myroutes = [
    {
        path: '/:userId/admin',
        component: Dashboard,
        title: 'Dashboard',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/developer',
        component: DeveloperHome,
        title: 'Developer',
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
        path: '/:userId/admin/members/member-logs',
        component: SearchMemberLogs,
        title: 'Members',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/logs-by-action/:action/:actionBy',
        component: MemberLogsByAction,
        title: 'Members',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/members/orders-by-status/:orderStatus',
        component: MembersByOrderStatus,
        title: 'Members',
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
        path: '/:userId/admin/packages',
        component: Packages,
        title: 'Packages',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/package-discounts',
        component: PackageDiscounts,
        title: 'Package Discounts',
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
        path: '/:userId/admin/business-names',
        component: BusinessNames,
        title: 'Business Names',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/castes',
        component: CasteList,
        title: 'Caste List',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/employee-designations',
        component: EmployeeDesignations,
        title: 'Caste List',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/branches',
        component: Branches,
        title: 'Branches',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/employees',
        component: Employees,
        title: 'Employees',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/broker',
        component: Broker,
        title: 'Broker',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/franchise',
        component: Franchise,
        title: 'Franchise',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/sms-templates',
        component: SmsTemplate,
        title: 'SmsTemplate',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/account-profile',
        component: MyAdminProfile,
        title: 'My Profile',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/broker-profile',
        component: BrokerProfile,
        title: 'My Broker Profile',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/franchise-profile',
        component: FranchiseProfile,
        title: 'My Franchise Profile',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/employee-profile',
        component: EmployeeProfile,
        title: 'My Employee Profile',
        allowed: ROLES.ALL,
        exact: true
    },

    {
        path: '/:userId/admin/logs',
        component: Logs,
        title: 'Logs',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/advertisements',
        component:Advertisement,
        title: 'Advertisements',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/whatsapp/wapp-reports',
        component: WhatsappReports,
        title: 'Whatsapp Reports',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/whatsapp/daily-whatsapp',
        component: dailyWhatsapp,
        title: 'Whatsapp Reports',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/franchise/payment-list',
        component: FranchisePaymentList,
        title: 'Franchise Payments',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/franchise/transactions',
        component: FranchiseTransactions,
        title: 'Franchise Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/broker/payment-list',
        component: BrokerPaymentList,

        title: 'Broker Payments',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/broker/transactions',
        component: BrokerTransactions,
        title: 'Broker Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/crm/crm-list',
        component: MemberCRM,
        title: 'Franchise Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/crm/categories',
        component: CrmCategoryList,
        title: 'Franchise Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/error/permission-error',
        component: PermissionError,
        title: 'Permission Error',
        allowed: ROLES.ALL,
        exact: true
    },
];
export default myroutes;