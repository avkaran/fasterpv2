import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";

import Register from "./register";
import Login from "./login";
import PublicTours from './tours/publicTours';
import PublicTourView from './tours/publicTourView';
import HomeTourSearch from './tours/publicHomeTourSearch';
import PublicHotels from './hotels/publicHotels';
import PublicHotelView from './hotels/publicHotelView';
import HomeHotelSearch from './hotels/publicHomeHotelSearch';

const UserPublicLayout = React.lazy(() => import('./public-layout'));
const CustomerPublicRoutes = (props) => {
    return (<>
        <Route path="/public" element={<UserPublicLayout />} >
            <Route
                path='/public/register'
                element={< Register />}
                title='Register'
                allowed={CustomerROLES.ALL}
                exact={true}
            />
            <Route
                path='/public/login'
                element={< Login />}
                title='Login'
                allowed={CustomerROLES.ALL}
                exact={true}
            />
             <Route
                path='/public/tours'
                element={<PublicTours />}
                title='Tours'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/tour-view/:tourId'
                element={<PublicTourView />}
                title='View Tour'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/public/home-tour-search/:phrase'
                element={<HomeTourSearch />}
                title='Tours'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
              <Route
                path='/public/hotels'
                element={<PublicHotels />}
                title='Hotels'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/hotel-view/:hotelId'
                element={<PublicHotelView />}
                title='View Hotel'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/public/home-hotel-search/:phrase'
                element={<HomeHotelSearch />}
                title='Hotels'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
           
        </Route>
    </>
    );

};
export default CustomerPublicRoutes;
