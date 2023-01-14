import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";

import Home from "./home";
import CustomerDashboard from "./dashboard";

import LoggedInMembership from "./membership/loggedInMembership";
import LoggedInSearch from "./search/loggedInSearch";
import MyProfile from "./profile";
import MyMatches from "./profiles/myMatches";
import ExpressInterestProfiles from "./profiles/expressInterestProfiles";
import ViewedProfiles from "./profiles/viewedProfiles";
import MyPlan from "./membership/myPlan";
import MyPaymentBack from './membership/paymentBack';
const UserLayout = React.lazy(() => import('./layout'));
const CustomerRoutes = (props) => {
    return (<>
        <Route path="/:userId/customer" element={<UserLayout />} >
           
            <Route
                path='/:userId/customer/dashboard'
                element={<CustomerDashboard />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/membership'
                element={<LoggedInMembership />}
                title='Membership'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/search'
                element={<LoggedInSearch />}
                title='Membership'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/profile'
                element={<MyProfile />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/mymatches'
                element={<MyMatches />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/express-interest/:sendBy'
                element={<ExpressInterestProfiles />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/profile-views/:viewedBy'
                element={<ViewedProfiles />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/:userId/customer/myplan'
                element={<MyPlan />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/:userId/customer/payment-back/:orderNumber'
                element={<MyPaymentBack />}
                title='Payment Response back'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
        </Route>
    </>
    );

};
export default CustomerRoutes;