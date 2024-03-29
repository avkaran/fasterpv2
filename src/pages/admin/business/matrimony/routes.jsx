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
import EmployeeAttendance from './employee-attendance';

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
import DeleteMemberReport from "./members/deleteMemberReport";
import Districts from "./addNewDatails/districts"
import Education from "./addNewDatails/education";
import Ledgers from '../../finance/ledgers';
import FinancialTransactions from '../../finance/transactions';
import FinancialTrialBalance from '../../finance/trialBalance';
import FinancialBalance from '../../finance/balanceSheet';
import FinancialPLStatement from '../../finance/plStatement';
import FinancialLedgerTransactions from '../../finance/ledgerTransactions';
import { ROLES } from "../../../../utils/data";
import EditMember from './members/editMember';
import MyResellerTransactions from './reseller/myresellerTransactions';
import EmployeeAttendanceReports from './employee-attendance/attendanceReport';
const AdminLayout = React.lazy(() => import('../../layout-desktop'));
const AdminLayoutMobile = React.lazy(() => import('../../layout-mobile'));
const AuthRoutes = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const role = context.adminUser(userId).role && context.adminUser(userId).role.toLowerCase();
    return (<>
        <Route path="/:userId/admin" element={context.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminLayoutMobile /> : <AdminLayout />} >
            <Route
                path='/:userId/admin'
                element={< Dashboard />}
                title='Dashboard'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/developer'
                element={< DeveloperHome />}
                title='Developer'
                allowed={ROLES.AdminAndEmployee}
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
                path='/:userId/admin/members/edit/:memberId'
                element={< EditMember />}
                title='Edit Member'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/packages'
                element={< Packages />}
                title='Packages'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/package-discounts'
                element={< PackageDiscounts />}
                title='Package Discounts'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
           
            <Route
                path='/:userId/admin/contents/:content_type/add'
                element={< AddContent />}
                title='Add Content'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/contents/:content_type/edit/:id'
                element={< EditContent />}
                title='Edit Content'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                exact={true}
                path='/:userId/admin/contents/:contentype/list'
                element={< ListContents />}
                title='List Content'
                allowed={ROLES.AdminAndEmployee}
            />
            <Route
                path='/:userId/admin/contents/:content_type/view/:id'
                element={< ViewContent />}
                title='View Content'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/collections'
                element={< Collections />}
                title='Collections'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/business-names'
                element={< BusinessNames />}
                title='Business Names'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/castes'
                element={< CasteList />}
                title='Caste List'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/employee-designations'
                element={< EmployeeDesignations />}
                title='Employee Designations'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/branches'
                element={< Branches />}
                title='Branches'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/employees'
                element={< Employees />}
                title='Employees'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/employee-attendance'
                element={< EmployeeAttendance />}
                title='Employee Attendance'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/employee-attendance-report'
                element={< EmployeeAttendanceReports />}
                title='Attendance'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/broker'
                element={< Broker />}
                title='Broker'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise'
                element={< Franchise />}
                title='Franchise'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/sms-templates'
                element={< SmsTemplate />}
                title='SmsTemplate'
                allowed={ROLES.AdminAndEmployee}
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
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/advertisements'
                element={<Advertisement />}
                title='Advertisements'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/whatsapp/wapp-reports'
                element={< WhatsappReports />}
                title='Whatsapp Reports'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/whatsapp/daily-whatsapp'
                element={< dailyWhatsapp />}
                title='Whatsapp Reports'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/reseller/mytransactions'
                element={< MyResellerTransactions />}
                title='Franchise Payments'
                allowed={ROLES.All}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise/payment-list'
                element={< FranchisePaymentList />}
                title='Franchise Payments'
                allowed={ROLES.All}
                exact={true}
            />
            <Route
                path='/:userId/admin/franchise/transactions'
                element={< FranchiseTransactions />}
                title='Franchise Transactions'
                allowed={ROLES.All}
                exact={true}
            />
            <Route
                path='/:userId/admin/broker/payment-list'
                element={< BrokerPaymentList />}

                title='Broker Payments'
                allowed={ROLES.All}
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
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/crm/categories'
                element={< CrmCategoryList />}
                title='Franchise Transactions'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/error/permission-error'
                element={< PermissionError />}
                title='Permission Error'
                allowed={ROLES.ALL}
                exact={true}
            />
            <Route
                path='/:userId/admin/members/deleted-member'
                element={< DeleteMemberReport />}
                title='Deleted Members'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/districts'
                element={< Districts />}
                title='Districts'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/education'
                element={< Education />}
                title='Education'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
            <Route
                path='/:userId/admin/finance/ledgers'
                element={< Ledgers />}
                title='Ledgers'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/finance/transactions'
                element={< FinancialTransactions />}
                title='Ledgers'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
                  <Route
                path='/:userId/admin/finance/ledgertransactions'
                element={< FinancialLedgerTransactions />}
                title='Ledger Transactions'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/finance/trailbalance'
                element={< FinancialTrialBalance />}
                title='Trial Balance'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/finance/balancesheet'
                element={< FinancialBalance />}
                title='Balance Sheet'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
             <Route
                path='/:userId/admin/finance/plstatement'
                element={< FinancialPLStatement />}
                title='PL Statement'
                allowed={ROLES.AdminAndEmployee}
                exact={true}
            />
           
          
        </Route>
    </>
    );

};
export default AuthRoutes;