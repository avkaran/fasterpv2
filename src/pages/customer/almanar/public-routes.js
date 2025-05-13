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
import Collections from './tours/collections';
import Cart from './tours/cart';
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
                path='/public/products'
                element={<PublicTours key={window.location.pathname}/>}
                title='Tours'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/collections'
                element={<Collections key={window.location.pathname}/>}
                title='Collections'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/products-by-brand/:brand'
                element={<PublicTours key={window.location.pathname} />}
                title='Tours'
                
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/products-by-collection/:collection'
                element={<PublicTours key={window.location.pathname} />}
                title='Tours'
                
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
             <Route
                path='/public/product-view/:productId'
                element={<PublicTourView />}
                title='View Tour'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
              <Route
                path='/public/cart'
                element={<Cart />}
                title='View Tour'
                allowed={CustomerROLES.CUSTOMER}
                exact={true}
            />
            <Route
                path='/public/product-search/:phrase'
                element={<PublicTours />}
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
