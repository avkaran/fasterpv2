import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";

import Home from "./home";
import CustomerDashboard from "./dashboard";
import MyProfile from "./profile";
import MyTours from './tours/myTours';
import MyTourView from './tours/myTourView';
import MyBookings from './bookings';
import MyHotels from './hotels/myHotels';
import MyHotelView from './hotels/myHotelView';
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
                path='/:userId/customer/profile'
                element={<MyProfile />}
                title='Dashboard'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/:userId/customer/mytours'
                element={<MyTours />}
                title='My Tours'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/:userId/customer/mytour-view/:tourId'
                element={<MyTourView />}
                title='View Tour'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
              <Route
                path='/:userId/customer/myhotels'
                element={<MyHotels />}
                title='My Hotels'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/:userId/customer/myhotel-view/:hotelId'
                element={<MyHotelView />}
                title='View hotel'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
           <Route
                path='/:userId/customer/bookings'
                element={<MyBookings />}
                title='Bookings'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
          
        </Route>
    </>
    );

};
export default CustomerRoutes;