import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
import AOS from "aos";
import PsContext from '../../../../context'
import { currentInstance, businesses } from '../../../../utils';

//this project components
import Dashboard from "./dashboard";
import AddContent from "../../contents/addContent";
import ListContents from "../../contents"
import EditContent from "../../contents/editContent";
import ViewContent from "../../contents/viewContent";
import Collections from "../../collections";
import EmployeeDesignations from "../../employee-designations";
import Branches from "../../branches";
import Employees from "../../employees";
import MyAdminProfile from "../../my-accounts";
import EmployeeProfile from "../../my-accounts/employee/employeeProfile";
import SmsTemplate from "../../sms-templates";
import Logs from "../../logs";
import PermissionError from "../../error-pages/permissionError";
import ProductService from './products';

//addes for testing.
import { ROLES } from "../../../../utils/data";
const AdminLayout = React.lazy(() => import('../../layout-desktop'));
const AdminLayoutMobile = React.lazy(() => import('../../layout-mobile'));


const AuthRoutes = (props) => {
    const context = useContext(PsContext);
    const { userId } = useParams();
    const role = context.adminUser(userId).role && context.adminUser(userId).role.toLowerCase();
    return (
        <>
            <Route path="/:userId/admin" element={context.isMobile && businesses[currentInstance.index].responsive && businesses[currentInstance.index].responsive.isMobile ? <AdminLayoutMobile /> : <AdminLayout />} >
                <Route
                    path='/:userId/admin'
                    element={<Dashboard />}
                    title='Dashboard'
                    allowed={ROLES.ALL}
                    exact={true}
                />

                <Route
                    path='/:userId/admin/contents/:content_type/add'
                    element={<AddContent />}
                    title='Add Content'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/contents/:content_type/edit/:id'
                    element={<EditContent />}
                    title='Edit Content'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    exact={true}
                    path='/:userId/admin/contents/:contentype/list'
                    element={<ListContents />}
                    title='List Content'
                    allowed={ROLES.ALL}
                />
                <Route
                    path='/:userId/admin/contents/:content_type/view/:id'
                    element={<ViewContent />}
                    title='View Content'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/collections'
                    element={<Collections />}
                    title='Collections'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/employee-designations'
                    element={<EmployeeDesignations />}
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
                    element={<Employees />}
                    title='Employees'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/sms-templates'
                    element={<SmsTemplate />}
                    title='SmsTemplate'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/myaccounts/account-profile'
                    element={<MyAdminProfile />}
                    title='My Profile'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/myaccounts/employee-profile'
                    element={<EmployeeProfile />}
                    title='My Employee Profile'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/logs'
                    element={<Logs />}
                    title='Logs'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                <Route
                    path='/:userId/admin/error/permission-error'
                    element={<PermissionError />}
                    title='Permission Error'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                  <Route
                    path='/:userId/admin/productservice/:businessType'
                    element={<ProductService />}
                    title='Permission Error'
                    allowed={ROLES.ALL}
                    exact={true}
                />
            </Route>

        </>
    );

};

export default AuthRoutes;