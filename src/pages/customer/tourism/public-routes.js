import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Route, Routes, Outlet, useParams, useLocation } from 'react-router-dom';
// FOR ADMIN
import { CustomerROLES } from "../../../utils/data";

import Register from "./register";
import Login from "./login";
import PublicSearch from "./search/publicSearch";
import HomeSearch from "./search/homeSearch";
import PublicMembership from "./membership/publicMembership";
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
                path='/public/search'
                element={< PublicSearch />}
                title='Login'
                allowed={CustomerROLES.ALL}
                exact={true}
            />
            <Route
                path='/public/membership'
                element={< PublicMembership />}
                title='Login'
                allowed={CustomerROLES.ALL}
                exact={true}
            />
            <Route
                path='/public/home-search/:phrase'
                element={< HomeSearch />}
                title='Login'
                allowed={CustomerROLES.ALL}
                exact={true}
            />
        </Route>
    </>
    );

};
export default CustomerPublicRoutes;
