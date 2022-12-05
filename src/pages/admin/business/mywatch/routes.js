// FOR ADMIN
import Dashboard from "./dashboard";

import { ROLES } from "../../../../utils/data";
//new entries
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import Docs from "../../../../docs";
import Database from "../../../../devTools/database";
import Coder from "../../../../devTools/coder";
import EmployeeDesignations from "../../employee-designations";
import Branches from "../../branches";
import Employees from "../../employees";
import MyAdminProfile from "../../my-accounts";
import EmployeeProfile from "../../my-accounts/employee/employeeProfile";
import SmsTemplate from "../../sms-templates";
import Logs from "../../logs";
import PermissionError from "../../error-pages/permissionError";
import CrmCategoryList from "../../crm/categories";
import MemberCRM from "./crm/memberCrm";
import Translations from "../../translations";
import Advertisement from "../../advertisements";
import WhatsappReports from "../../whatsapp";
const myroutes = [
    {
        path: '/:userId/admin',
        element: Dashboard,
        title: 'Dashboard',
        allowed: ROLES.ALL,
        exact: true
    },
   
    {
        path: '/:userId/admin/contents/:content_type/add',
        element: AddContent,
        title: 'Add Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/contents/:content_type/edit/:id',
        element: EditContent,
        title: 'Edit Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        exact: true,
        path: '/:userId/admin/contents/:contentype/list',
        element: ListContents,
        title: 'List Content',
        allowed: ROLES.ALL,
    },
    {
        path: '/:userId/admin/contents/:content_type/view/:id',
        element: ViewContent,
        title: 'View Content',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/collections',
        element: Collections,
        title: 'Collections',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/employee-designations',
        element: EmployeeDesignations,
        title: 'Caste List',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/branches',
        element: Branches,
        title: 'Branches',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/employees',
        element: Employees,
        title: 'Employees',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/sms-templates',
        element: SmsTemplate,
        title: 'SmsTemplate',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/account-profile',
        element: MyAdminProfile,
        title: 'My Profile',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/myaccounts/employee-profile',
        element: EmployeeProfile,
        title: 'My Employee Profile',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/logs',
        element: Logs,
        title: 'Logs',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/advertisements',
        element:Advertisement,
        title: 'Advertisements',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/whatsapp/wapp-reports',
        element: WhatsappReports,
        title: 'Whatsapp Reports',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/crm/crm-list',
        element: MemberCRM,
        title: 'Franchise Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/crm/categories',
        element: CrmCategoryList,
        title: 'Franchise Transactions',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/error/permission-error',
        element: PermissionError,
        title: 'Permission Error',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/docs',
        element: Docs,
        title: 'Documentation',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/database',
        element: Database,
        title: 'Database',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/coder',
        element: Coder,
        title: 'Coder',
        allowed: ROLES.ALL,
        exact: true
    },
    {
        path: '/:userId/admin/translations',
        element: Translations,
        title: 'Translations',
        allowed: ROLES.ALL,
        exact: true
    },
];
export default myroutes;