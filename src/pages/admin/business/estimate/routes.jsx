import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
import AOS from "aos";
import PsContext from '../../../../context'
import { currentInstance, businesses } from '../../../../utils';

//this project components
import Dashboard from "./dashboard";
import EmployeeDesignations from "../../employee-designations";
import Branches from "../../branches";
import Employees from "../../employees";
import MyAdminProfile from "../../my-accounts";
import EmployeeProfile from "../../my-accounts/employee/employeeProfile";

import PermissionError from "../../error-pages/permissionError";
import JewelProducts from './products';
//addes for testing.
import { ROLES } from "../../../../utils/data";
import Estimates from './estimates';

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
                    path='/:userId/admin/error/permission-error'
                    element={<PermissionError />}
                    title='Permission Error'
                    allowed={ROLES.ALL}
                    exact={true}
                />
                 <Route
                    path='/:userId/admin/products'
                    element={<JewelProducts />}
                    title='Products'
                    allowed={ROLES.ALL}
                    exact={true}
                />
               <Route
                    path='/:userId/admin/estimates'
                    element={<Estimates />}
                    title='Estimates'
                    allowed={ROLES.ALL}
                    exact={true}
                />
            </Route>

        </>
    );

};

export default AuthRoutes;