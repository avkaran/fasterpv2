import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
import PsContext from '../../../../context'
import { currentInstance, businesses } from '../../../../utils';
// FOR ADMIN
import Dashboard from "./dashboard";
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

import { ROLES } from "../../../../utils/data";
const AdminLayout = React.lazy(() => import('../../../../pages/admin/layout-desktop'));
const AdminLayoutMobile = React.lazy(() => import('../../../../pages/admin/layout-mobile'));
const AuthRoutes = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const role = context.adminUser(userId).role && context.adminUser(userId).role.toLowerCase();
    return (<>
        <Route path="/:userId/admin" element={props.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminLayoutMobile /> : <AdminLayout />} >
            <Route
                path='/:userId/admin'
                element={< Dashboard />}
                title='Dashboard'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/developer'
                element={< DeveloperHome />}
                title='Developer'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members'
                element={< ListMembers />}
                title='Members'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/member-logs'
                element={< SearchMemberLogs />}
                title='Members'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/logs-by-action/:action/:actionBy'
                element={< MemberLogsByAction />}
                title='Members'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/orders-by-status/:orderStatus'
                element={< MembersByOrderStatus />}
                title='Members'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/add-member'
                element={< AddMember />}
                title='Add Member'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/packages'
                element={< Packages />}
                title='Packages'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/package-discounts'
                element={< PackageDiscounts />}
                title='Package Discounts'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/newview/:memberId'
                element={< NewViewMember />}

                title='New View Member'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/contents/:content_type/add'
                element={< AddContent />}
                title='Add Content'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/contents/:content_type/edit/:id'
                element={< EditContent />}
                title='Edit Content'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                exact={true}
                path='/:userId/admin/contents/:contentype/list'
                element={< ListContents />}
                title='List Content'
                allowed={ROLES.ALL}
            />
            <Route
                path='/:userId/admin/contents/:content_type/view/:id'
                element={< ViewContent />}
                title='View Content'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/collections'
                element={< Collections />}
                title='Collections'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/business-names'
                element={< BusinessNames />}
                title='Business Names'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/castes'
                element={< CasteList />}
                title='Caste List'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/employee-designations'
                element={< EmployeeDesignations />}
                title='Caste List'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/branches'
                element={< Branches />}
                title='Branches'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/employees'
                element={< Employees />}
                title='Employees'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/broker'
                element={< Broker />}
                title='Broker'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise'
                element={< Franchise />}
                title='Franchise'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/sms-templates'
                element={< SmsTemplate />}
                title='SmsTemplate'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/myaccounts/account-profile'
                element={< MyAdminProfile />}
                title='My Profile'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/myaccounts/broker-profile'
                element={< BrokerProfile />}
                title='My Broker Profile'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/myaccounts/franchise-profile'
                element={< FranchiseProfile />}
                title='My Franchise Profile'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/myaccounts/employee-profile'
                element={< EmployeeProfile />}
                title='My Employee Profile'
                allowed={ROLES.ALL}
                exact={true}
            />

            <Route
                path='/:userId/admin/logs'
                element={< Logs />}
                title='Logs'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/advertisements'
                element={<Advertisement />}
                title='Advertisements'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/whatsapp/wapp-reports'
                element={< WhatsappReports />}
                title='Whatsapp Reports'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/whatsapp/daily-whatsapp'
                element={< dailyWhatsapp />}
                title='Whatsapp Reports'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise/payment-list'
                element={< FranchisePaymentList />}
                title='Franchise Payments'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise/transactions'
                element={< FranchiseTransactions />}
                title='Franchise Transactions'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/broker/payment-list'
                element={< BrokerPaymentList />}

                title='Broker Payments'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/broker/transactions'
                element={< BrokerTransactions />}
                title='Broker Transactions'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/crm/crm-list'
                element={< MemberCRM />}
                title='Franchise Transactions'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/crm/categories'
                element={< CrmCategoryList />}
                title='Franchise Transactions'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/error/permission-error'
                element={< PermissionError />}
                title='Permission Error'
                allowed={ROLES.ALL}
                exact={true}
            />
        </Route>
    </>
    );

};
export default AuthRoutes;